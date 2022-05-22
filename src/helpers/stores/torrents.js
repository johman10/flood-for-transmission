import { derived, writable, get } from 'svelte/store';
import Transmission from '~helpers/Transmission';
import {
  STATUSES,
  STATUS_DOWNLOADING,
  STATUS_STOPPED,
} from '~helpers/constants/statuses';
import {
  COLUMN_MAP,
  TRANSMISSION_COLUMN_STATUS,
  TRANSMISSION_COLUMN_LABELS,
  TRANSMISSION_COLUMN_TRACKERS,
  TRANSMISSION_COLUMN_DOWNLOAD_DIR,
  TRANSMISSION_COLUMN_UPLOAD_RATE,
  TRANSMISSION_COLUMN_DOWNLOAD_RATE,
  TRANSMISSION_COLUMN_NAME,
  TRANSMISSION_COLUMN_ETA,
  UI_COLUMN_TOTAL_SEEDERS,
  UI_COLUMN_TOTAL_LEECHERS,
  TRANSMISSION_COLUMN_MAGNET_LINK,
} from '~helpers/constants/columns';
import { sorting } from '~helpers/stores/sorting';
import {
  transmissionColumns,
  uiColumns,
  filters,
  alerts,
} from '~helpers/stores';
import {
  searchFilter,
  statusFilter,
  trackerFilter,
  labelFilter,
} from '~helpers/filterHelper';
import { trackerStripper } from '~helpers/trackerHelper';
import { copyToClipboard } from '../copyHelper';

const TORRENT_FETCHING_TIMEOUT = 1000;

const transmission = new Transmission();
let updateTorrentTimeout;
const store = writable([]);
let previousActiveColumns = null;

const sorted = derived(
  [store, filters, sorting],
  ([$torrents, $filters, $sorting]) => {
    let filteredTorrents = $torrents;
    const hasFilter = !!Object.values($filters).filter(Boolean).length;
    if (hasFilter) {
      filteredTorrents = $torrents.filter((torrent) => {
        const search = searchFilter($filters.search, torrent);
        const status = statusFilter($filters.status, torrent);
        const label = labelFilter($filters.label, torrent);
        const tracker = trackerFilter($filters.tracker, torrent);
        return search && status && label && tracker;
      });
    }

    const transmissionSortingColumns = COLUMN_MAP[$sorting.id];
    if (!transmissionSortingColumns) {
      console.warn('Unrecognized sorting');
      return filteredTorrents;
    }

    return filteredTorrents.sort((torrentA, torrentB) => {
      const sortingValues = transmissionSortingColumns
        .map((transmissionColumn) => {
          let aValue = torrentA[transmissionColumn];
          let bValue = torrentB[transmissionColumn];
          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          // Transmission ETA -1, is infinity so mimic that behaviour
          if (transmissionColumn === TRANSMISSION_COLUMN_ETA) {
            if (aValue === -1) aValue = Number.MAX_SAFE_INTEGER;
            if (bValue === -1) bValue = Number.MAX_SAFE_INTEGER;
          }

          // TODO: consider some way of setting a sorting value/key per column so that this can be abstracted
          if ($sorting.id === UI_COLUMN_TOTAL_SEEDERS.id) {
            aValue = Math.max(...aValue.map((a) => a.seederCount));
            bValue = Math.max(...bValue.map((b) => b.seederCount));
          }

          if ($sorting.id === UI_COLUMN_TOTAL_LEECHERS.id) {
            aValue = Math.max(...aValue.map((a) => a.leecherCount));
            bValue = Math.max(...bValue.map((b) => b.leecherCount));
          }

          let returnValue = 0;
          if (aValue < bValue) returnValue = -1;
          if (aValue > bValue) returnValue = 1;
          if ($sorting.direction === 'desc') returnValue *= -1;
          return returnValue;
        })
        .filter(Boolean);
      return sortingValues[0] || 0;
    });
  }
);

function getRecentlyActiveTorrents() {
  if (updateTorrentTimeout) {
    clearTimeout(updateTorrentTimeout);
  }

  transmission
    .getTorrents('recently-active', get(transmissionColumns))
    .then(({ torrents, removed }) => {
      store.update((currentTorrents) => {
        const updatedTorrents = currentTorrents.map((torrent) => {
          const activeTorrent = torrents.find((t) => t.id === torrent.id);
          if (!activeTorrent) return torrent;

          return {
            ...torrent,
            ...activeTorrent,
          };
        });

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

        const addedTorrents = torrents.filter(
          (at) => !currentTorrents.find((ct) => ct.id === at.id)
        );

        previousActiveColumns = activeColumns;
        let newTorrents = [...updatedTorrents, ...addedTorrents];
        newTorrents = newTorrents.filter(
          (torrent) => !removed.includes(torrent.id)
        );
        return newTorrents;
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
    sorted,
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
    rename: (ids, path, name) =>
      store.update((state) => {
        transmission.renamePath(ids, path, name).catch(() => store.set(state));
        return state.map((torrent) => {
          if (!ids.includes(torrent.id)) return torrent;

          return {
            ...torrent,
            [TRANSMISSION_COLUMN_NAME]: name,
          };
        });
      }),
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
    startNow: (ids) =>
      store.update((state) => {
        transmission.startNowTorrents(ids).catch(() => store.set(state));
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
    copyMagnetLinks: (ids) => {
      const torrents = get(store);
      const selectedTorrents = torrents.filter((torrent) =>
        ids.includes(torrent.id)
      );
      const magnetLinks = selectedTorrents.map(
        (torrent) => torrent[TRANSMISSION_COLUMN_MAGNET_LINK]
      );

      return copyToClipboard(magnetLinks.join(', '))
        .then(() => {
          alerts.add('Magnet links copied');
        })
        .catch(() => {
          alerts.add('Magnet links copy failed', 'negative');
        });
    },
    reannounce: (ids) => transmission.reannounceTorrents(ids),
    remove: (ids, deleteLocalData) =>
      transmission.removeTorrents({ ids, deleteLocalData }),
    add: (data) => transmission.addTorrent(data),
    queueMoveTop: (ids) => transmission.queueMoveTop(ids),
    queueMoveUp: (ids) => transmission.queueMoveUp(ids),
    queueMoveDown: (ids) => transmission.queueMoveDown(ids),
    queueMoveBottom: (ids) => transmission.queueMoveBottom(ids),
  };
}
export const torrents = createTorrentsStore();
