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
  priorityFilter,
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
    // performance.mark('start');
    let filteredTorrents = $torrents;
    const hasFilter = !!Object.values($filters).filter(
      (value) => value !== null
    ).length;
    if (hasFilter) {
      filteredTorrents = $torrents.filter((torrent) => {
        const search = searchFilter($filters.search, torrent);
        const status = statusFilter($filters.status, torrent);
        const label = labelFilter($filters.label, torrent);
        const tracker = trackerFilter($filters.tracker, torrent);
        const priority = priorityFilter($filters.priority, torrent);
        return search && status && label && tracker && priority;
      });
    }

    const transmissionSortingColumns = COLUMN_MAP[$sorting.id];
    if (!transmissionSortingColumns) {
      console.warn('Unrecognized sorting');
      return filteredTorrents;
    }

    const output = filteredTorrents.sort((torrentA, torrentB) => {
      const sortingValues = transmissionSortingColumns
        .map((transmissionColumn) => {
          let aValue = torrentA[transmissionColumn];
          let bValue = torrentB[transmissionColumn];
          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          // Transmission ETA less than 0 is unknown/infinity so mimic that behaviour.
          // Reference: https://github.com/transmission/transmission/blob/3.00/libtransmission/transmission.h#L1748-L1749
          if (transmissionColumn === TRANSMISSION_COLUMN_ETA) {
            if (aValue < 0) aValue = Number.MAX_SAFE_INTEGER;
            if (bValue < 0) bValue = Number.MAX_SAFE_INTEGER;
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

    // performance.mark('end');

    // performance.measure('measure a to b', 'start', 'end');
    // console.log(performance.getEntriesByType('measure')[0].duration);

    // // Finally, clean up the entries.
    // performance.clearMarks();
    // performance.clearMeasures();

    return output;
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
      const abc = [
        ...value,
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (1 + 1),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (2 + 2),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (3 + 3),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (4 + 4),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (5 + 5),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (6 + 6),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (7 + 7),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (8 + 8),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (9 + 9),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (10 + 10),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (11 + 11),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (12 + 12),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (13 + 13),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (14 + 14),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (15 + 15),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (16 + 16),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (17 + 17),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (18 + 18),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (19 + 19),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (20 + 20),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (21 + 21),
        })),
        ...value.map((x) => ({
          ...x,
          id: x.id + value.length * (22 + 22),
        })),
      ];
      // console.log(abc.map((x) => x.id).sort((a, b) => a - b));
      store.set(abc);
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
  };
}
export const torrents = createTorrentsStore();
