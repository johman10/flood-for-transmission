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
import { transmissionColumns, filters, alerts } from '~helpers/stores';
import {
  searchFilter,
  statusFilter,
  trackerFilter,
  labelFilter,
  priorityFilter,
} from '~helpers/filterHelper';
import { trackerStripper } from '~helpers/trackerHelper';
import { copyToClipboard } from '../copyHelper';
import { scheduleWhenVisible } from '~helpers/pollHelper';

const TORRENT_FETCHING_TIMEOUT = 1000;
// "recently-active" only reports changes from the last minute, so after a
// longer gap (hidden tab, sleeping laptop) everything is fetched again.
const MAX_RECENTLY_ACTIVE_GAP = 30000;

const transmission = new Transmission();
let cancelUpdate;
let lastFetch = 0;
const store = writable([]);
// Updated after every poll, even when nothing changed, so the speed graph keeps moving
const totalRate = writable({ upload: 0, download: 0 });
// Columns of the last full fetch; a newly enabled column needs a full fetch to fill it
let fetchedColumns = [];

function scheduleUpdate(fetchTorrents) {
  cancelUpdate?.();
  cancelUpdate = scheduleWhenVisible(fetchTorrents, TORRENT_FETCHING_TIMEOUT);
}

function updateTotalRate() {
  const data = { upload: 0, download: 0 };
  get(store).forEach((torrent) => {
    data.upload += torrent[TRANSMISSION_COLUMN_UPLOAD_RATE];
    data.download += torrent[TRANSMISSION_COLUMN_DOWNLOAD_RATE];
  });
  totalRate.set(data);
}

const sorted = derived(
  [store, filters, sorting],
  ([$torrents, $filters, $sorting]) => {
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

    return filteredTorrents.sort((torrentA, torrentB) => {
      for (const transmissionColumn of transmissionSortingColumns) {
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
        if (returnValue) return returnValue;
      }
      return 0;
    });
  }
);

function getRecentlyActiveTorrents() {
  const columns = get(transmissionColumns);
  if (
    Date.now() - lastFetch > MAX_RECENTLY_ACTIVE_GAP ||
    columns.some((column) => !fetchedColumns.includes(column))
  ) {
    getAllTorrents();
    return;
  }

  let nextFetch = getRecentlyActiveTorrents;

  transmission
    .getTorrents('recently-active', columns)
    .then((result) => {
      if (!result) {
        return;
      }
      lastFetch = Date.now();

      const { torrents, removed } = result;
      // Nothing changed, so keep the same array and skip re-sorting and re-rendering
      if (torrents.length || removed.length) {
        store.update((currentTorrents) => {
          const activeTorrents = new Map(
            torrents.map((torrent) => [torrent.id, torrent])
          );
          const removedIds = new Set(removed);
          const updatedTorrents = currentTorrents
            .filter((torrent) => !removedIds.has(torrent.id))
            .map((torrent) => {
              const activeTorrent = activeTorrents.get(torrent.id);
              activeTorrents.delete(torrent.id);
              if (!activeTorrent) return torrent;

              return {
                ...torrent,
                ...activeTorrent,
              };
            });

          // Whatever wasn't matched to an existing torrent was just added
          const addedTorrents = [...activeTorrents.values()].filter(
            (torrent) => !removedIds.has(torrent.id)
          );

          return [...updatedTorrents, ...addedTorrents];
        });
      }
      updateTotalRate();
    })
    // TODO: Error handling
    .catch((e) => {
      console.error(e);
      nextFetch = getAllTorrents;
    })
    .finally(() => {
      scheduleUpdate(nextFetch);
    });
}

function getAllTorrents() {
  let hasError = false;
  const columns = get(transmissionColumns);

  transmission
    .getTorrents(undefined, columns)
    .then((value) => {
      if (!value) {
        hasError = true;
        return;
      }
      hasError = false;
      lastFetch = Date.now();
      fetchedColumns = columns;
      store.set(value);
      updateTotalRate();
    })
    // TODO: Error handling
    .catch((e) => {
      console.error(e);
      hasError = true;
    })
    .finally(() => {
      scheduleUpdate(hasError ? getAllTorrents : getRecentlyActiveTorrents);
    });
}

function createTorrentsStore() {
  getAllTorrents();

  return {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    totalRate: { subscribe: totalRate.subscribe },
    sorted,
    labels: derived(store, ($torrents) =>
      [
        ...new Set(
          $torrents.flatMap((torrent) => torrent[TRANSMISSION_COLUMN_LABELS])
        ),
      ].sort()
    ),
    trackers: derived(store, ($torrents) =>
      [
        ...new Set(
          $torrents.flatMap((torrent) =>
            torrent[TRANSMISSION_COLUMN_TRACKERS].flatMap((tracker) =>
              trackerStripper(tracker.announce)
            )
          )
        ),
      ].sort()
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
