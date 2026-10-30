import { TRANSMISSION_COLUMN } from '~helpers/constants/columns';
import { writable, get } from 'svelte/store';
import Transmission from '~helpers/Transmission';
import { scheduleWhenVisible } from '~helpers/pollHelper';

const TORRENT_REQUEST_INTERVAL = 1000;
const transmission = new Transmission();

// Columns that can get big (thousands of files, hundreds of peers) are only
// requested while the tab that shows them is open.
const HEAVY_COLUMNS = [
  TRANSMISSION_COLUMN.FILES,
  TRANSMISSION_COLUMN.FILE_STATS,
  TRANSMISSION_COLUMN.PEERS,
];
const BASE_COLUMNS = Object.values(TRANSMISSION_COLUMN).filter(
  (column) => !HEAVY_COLUMNS.includes(column)
);
const DEFAULT_VALUES = {
  [TRANSMISSION_COLUMN.PEERS]: [],
};

const PRIORITY_PARAMS = {
  [-1]: 'priority-low',
  0: 'priority-normal',
  1: 'priority-high',
};

function createTorrentDetailsStore() {
  const store = writable({});
  const { set, update, subscribe } = store;

  let torrentId = 0;
  let extraColumns = [];
  let cancelPoll = null;
  // Bumped on every local change so responses requested before it are dropped
  // instead of briefly reverting the optimistic update.
  let version = 0;

  const stopPolling = () => {
    cancelPoll?.();
    cancelPoll = null;
  };

  const poll = () => {
    stopPolling();
    if (!torrentId) return;

    const requestedId = torrentId;
    const requestedVersion = version;
    const current = get(store);
    const columns = [...BASE_COLUMNS, ...extraColumns];
    // File names and sizes never change on their own, so they're fetched once.
    // Progress, priority and wanted state live in fileStats.
    if (
      extraColumns.includes(TRANSMISSION_COLUMN.FILE_STATS) &&
      !current[TRANSMISSION_COLUMN.FILES]?.length
    ) {
      columns.push(TRANSMISSION_COLUMN.FILES);
    }

    transmission
      .getTorrents(requestedId, columns)
      .then((torrents) => {
        if (
          !torrents?.length ||
          requestedId !== torrentId ||
          requestedVersion !== version
        ) {
          return;
        }
        update((torrent) => ({
          ...DEFAULT_VALUES,
          ...torrent,
          ...torrents[0],
          loaded: true,
        }));
      })
      // TODO: Error handling
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        if (requestedId !== torrentId || cancelPoll) return;
        cancelPoll = scheduleWhenVisible(poll, TORRENT_REQUEST_INTERVAL);
      });
  };

  const setTorrentId = (id) => {
    stopPolling();
    torrentId = id;
    version += 1;
    set({});
    poll();
  };

  const updateFileStats = (torrent, fileIndices, change) => {
    const fileStats = [...torrent[TRANSMISSION_COLUMN.FILE_STATS]];
    fileIndices.forEach((fileIndex) => {
      fileStats[fileIndex] = { ...fileStats[fileIndex], ...change };
    });
    version += 1;
    set({ ...torrent, [TRANSMISSION_COLUMN.FILE_STATS]: fileStats });
  };

  return {
    set,
    update,
    subscribe,
    setTorrentId,
    clearTorrentId: () => {
      stopPolling();
      torrentId = 0;
      extraColumns = [];
      set({});
    },
    // Tabs call this with the heavy columns they need; fetches right away so
    // switching tabs doesn't wait for the next tick.
    setExtraColumns: (columns) => {
      extraColumns = columns;
      if (torrentId) poll();
    },
    setFilesWanted: (torrent, fileIndices, wanted) => {
      if (!fileIndices.length) return;
      const previous = torrent;
      transmission
        .setTorrents([torrent[TRANSMISSION_COLUMN.ID]], {
          [wanted ? 'files-wanted' : 'files-unwanted']: fileIndices,
        })
        .catch(() => set(previous));
      updateFileStats(torrent, fileIndices, { wanted });
    },
    setFilesPriority: (torrent, fileIndices, priority) => {
      if (!fileIndices.length) return;
      const previous = torrent;
      transmission
        .setTorrents([torrent[TRANSMISSION_COLUMN.ID]], {
          [PRIORITY_PARAMS[priority]]: fileIndices,
        })
        .catch(() => set(previous));
      updateFileStats(torrent, fileIndices, { priority });
    },
    setTrackers: (torrent, trackerList) => {
      transmission
        .setTorrents([torrent[TRANSMISSION_COLUMN.ID]], {
          [TRANSMISSION_COLUMN.TRACKER_LIST]: trackerList,
        })
        .catch(() => set({ ...torrent, loaded: true }));
    },
    setDetails: (torrent, data) => {
      const promise = transmission
        .setTorrents([torrent[TRANSMISSION_COLUMN.ID]], data)
        .catch(() => set({ ...torrent, loaded: true }));

      version += 1;
      set({ ...torrent, ...data, loaded: true });

      return promise;
    },
  };
}

export const torrentDetails = createTorrentDetailsStore();
