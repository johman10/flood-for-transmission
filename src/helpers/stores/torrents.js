import { derived, writable, get } from 'svelte/store';
import Transmission, { STATUSES, STATUS_DOWNLOADING, STATUS_STOPPED } from '~helpers/Transmission';
import {
  COLUMN_MAP,
  TRANSMISSION_COLUMN_STATUS,
  TRANSMISSION_COLUMN_LABELS,
  TRANSMISSION_COLUMN_TRACKERS,
  TRANSMISSION_COLUMN_DOWNLOAD_DIR,
  TRANSMISSION_COLUMN_UPLOAD_RATE,
  TRANSMISSION_COLUMN_DOWNLOAD_RATE
} from '~helpers/constants/columns';
import { filters } from '~helpers/stores/filters';
import {
  searchFilter,
  statusFilter,
  trackerFilter,
  labelFilter,
} from '~helpers/filterHelper';
import { trackerStripper } from '~helpers/trackerHelper';
import { transmissionColumns, uiColumns } from '~helpers/stores/columns';

const TORRENT_FETCHING_TIMEOUT = 1000;

const transmission = new Transmission();
let updateTorrentTimeout;
const store = writable([]);
let previousActiveColumns = null;

function getRecentlyActiveTorrents() {
  if (updateTorrentTimeout) {
    clearTimeout(updateTorrentTimeout);
  }

  transmission
    .getTorrents('recently-active', get(transmissionColumns))
    .then((activeTorrents) => {
      store.update((currentTorrents) => {
        const newTorrents = currentTorrents.map((torrent) => {
          const activeTorrent = activeTorrents.find((t) => t.id === torrent.id);
          if (!activeTorrent) return torrent;

          return {
            ...torrent,
            ...activeTorrent,
          };
        });
        // TODO: take care of removed torrents too!
        const addedTorrents = activeTorrents.filter(
          (at) => !currentTorrents.find((ct) => ct.id === at.id)
        );

        const activeColumns = get(uiColumns.active);
        // If no column was added, just keep fetching the recently active
        if (
          previousActiveColumns &&
          activeColumns.every((column) =>
            previousActiveColumns.includes(column)
          )
        ) {
          updateTorrentTimeout = setTimeout(
            getRecentlyActiveTorrents,
            TORRENT_FETCHING_TIMEOUT
          );
        } else {
          // If an ui column was added, fetch all to fill the column correctly.
          updateTorrentTimeout = setTimeout(
            getAllTorrents,
            TORRENT_FETCHING_TIMEOUT
          );
        }
        previousActiveColumns = activeColumns;
        return [...newTorrents, ...addedTorrents];
      });
    })
    // TODO: Error handling
    .catch((e) => {
      console.error(e);
      updateTorrentTimeout = setTimeout(
        getAllTorrents,
        TORRENT_FETCHING_TIMEOUT
      );
    });
}

function getAllTorrents() {
  if (updateTorrentTimeout) {
    clearTimeout(updateTorrentTimeout);
  }

  transmission
    .getTorrents(undefined, get(transmissionColumns))
    .then((value) => {
      store.set(value);
      updateTorrentTimeout = setTimeout(
        getRecentlyActiveTorrents,
        TORRENT_FETCHING_TIMEOUT
      );
    })
    // TODO: Error handling
    .catch((e) => {
      console.error(e);
      updateTorrentTimeout = setTimeout(
        getAllTorrents,
        TORRENT_FETCHING_TIMEOUT
      );
    });
}

function createTorrentsStore() {
  getAllTorrents(store.set);

  return {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    totalRate: derived(store, ($torrents) => {
      const data = { upload: 0, download: 0 };
      $torrents.forEach((torrent) => {
        data.upload += torrent[TRANSMISSION_COLUMN_UPLOAD_RATE];
        data.download += torrent[TRANSMISSION_COLUMN_DOWNLOAD_RATE];
      });
      return data;
    }),
    filtered: derived([store, filters], ([$torrents, $filters]) => {
      if (!Object.values($filters).filter(Boolean).length) {
        return $torrents;
      }

      return $torrents.filter((torrent) => {
        const search = searchFilter($filters.search, torrent);
        const status = statusFilter($filters.status, torrent);
        const label = labelFilter($filters.label, torrent);
        const tracker = trackerFilter($filters.tracker, torrent);
        return search && status && label && tracker;
      });
    }),
    labels: derived(store, ($torrents) =>
      $torrents
        .flatMap((torrent) => torrent[TRANSMISSION_COLUMN_LABELS])
        .filter((item, index, list) => list.indexOf(item) === index)
        .sort()
    ),
    trackers: derived(store, ($torrents) =>
      $torrents
        .flatMap((torrent) =>
          torrent[TRANSMISSION_COLUMN_TRACKERS].flatMap((tracker) =>
            trackerStripper(tracker.announce)
          )
        )
        .filter((item, index, list) => list.indexOf(item) === index)
        .sort()
    ),
    start: (ids) =>
      store.update((state) => {
        transmission.startTorrents(ids).catch(() => store.set(state));
        return state.map((torrent) => {
          if (!ids.includes(torrent.id)) return torrent;

          return {
            ...torrent,
            [TRANSMISSION_COLUMN_STATUS]: STATUSES.indexOf(STATUS_DOWNLOADING),
          };
        });
      }),
    stop: (ids) =>
      store.update((state) => {
        transmission.stopTorrents(ids).catch(() => store.set(state));
        return state.map((torrent) => {
          if (!ids.includes(torrent.id)) return torrent;

          return {
            ...torrent,
            [TRANSMISSION_COLUMN_STATUS]: STATUSES.indexOf(STATUS_STOPPED),
          };
        });
      }),
    setTorrents: (ids, data) => {
      return transmission.setTorrents(ids, data).then(() => {
        store.update((state) => {
          return state.map((t) => {
            if (!ids.includes(t.id)) return t;
            return { ...t, ...data };
          });
        });
      });
    },
    setLocation: (ids, location, move) => {
      return transmission.setTorrentsLocation(ids, location, move).then(() => {
        store.update((state) => {
          return state.map((t) => {
            if (!ids.includes(t.id)) return t;
            return { ...t, [TRANSMISSION_COLUMN_DOWNLOAD_DIR]: location };
          });
        });
      });
    },
    verify: (ids) => transmission.verifyTorrents(ids),
    reannounce: (ids) => transmission.reannounceTorrents(ids),
    remove: (ids, deleteLocalData) =>
      transmission.removeTorrents({ ids, deleteLocalData }),
    add: (data) => transmission.addTorrent(data),
  };
}
export const torrents = createTorrentsStore();
