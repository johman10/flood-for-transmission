import { TRANSMISSION_COLUMN } from '~helpers/constants/columns';
import { writable } from 'svelte/store';
import Transmission from '~helpers/Transmission';
import { cloneObject } from '~helpers/objectHelper';

const TORRENT_REQUEST_INTERVAL = 1000;
const transmission = new Transmission();
let updateTorrentTimeout = null;

function getTorrent(torrentId, setTorrent) {
  if (updateTorrentTimeout) {
    clearTimeout(updateTorrentTimeout);
  }

  transmission
    .getTorrents(torrentId, Object.values(TRANSMISSION_COLUMN))
    .then((torrents) => {
      setTorrent(torrents[0]);
    })
    // TODO: Error handling
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      updateTorrentTimeout = setTimeout(
        getTorrent,
        TORRENT_REQUEST_INTERVAL,
        torrentId,
        setTorrent
      );
    });
}

function createTorrentDetailsStore() {
  const torrentId = writable(0);
  const { set, update, subscribe } = writable({}, (set) => {
    const unsubscribe = torrentId.subscribe(($torrentId) => {
      if (!$torrentId) return set({});

      getTorrent($torrentId, set);
    });

    return () => {
      clearTimeout(updateTorrentTimeout);
      unsubscribe();
    };
  });

  return {
    set,
    update,
    subscribe,
    setTorrentId: torrentId.set,
    clearTorrentId: () => torrentId.set(0),
    setPriority: (torrent, fileNames, priority) => {
      const allFileNames = torrent[TRANSMISSION_COLUMN.FILES].map(
        (file) => file.name
      );
      const fileIndices = fileNames.map((fileName) =>
        allFileNames.indexOf(fileName)
      );
      let params;
      switch (priority) {
        case -2:
          params = { 'files-unwanted': fileIndices };
          break;
        case -1:
          params = { 'priority-low': fileIndices, 'files-wanted': fileIndices };
          break;
        case 0:
          params = {
            'priority-normal': fileIndices,
            'files-wanted': fileIndices,
          };
          break;
        case 1:
          params = {
            'priority-high': fileIndices,
            'files-wanted': fileIndices,
          };
          break;
      }
      transmission
        .setTorrents([torrent[TRANSMISSION_COLUMN.ID]], params)
        .catch(() => {
          set(torrent);
        });

      const newTorrent = cloneObject(torrent);
      fileIndices.forEach((fileIndex) => {
        newTorrent[TRANSMISSION_COLUMN.FILE_STATS][fileIndex].priority =
          priority;
        newTorrent[TRANSMISSION_COLUMN.FILE_STATS][fileIndex].wanted =
          !!params['files-wanted'];
      });
      set(newTorrent);
    },
    removeTrackers: (torrent, trackers) => {
      transmission
        .setTorrents([torrent[TRANSMISSION_COLUMN.ID]], {
          trackerRemove: trackers,
        })
        .catch(() => set(torrent));

      const newTorrent = cloneObject(torrent);
      const newTrackers = newTorrent[TRANSMISSION_COLUMN.TRACKERS].filter(
        (tracker) => !trackers.includes(tracker.id)
      );
      newTorrent[TRANSMISSION_COLUMN.TRACKERS] = newTrackers;
      set(newTorrent);
    },
    addTrackers: (torrent, trackers) => {
      transmission
        .setTorrents([torrent[TRANSMISSION_COLUMN.ID]], {
          trackerAdd: trackers,
        })
        .catch(() => set(torrent));

      const newTorrent = cloneObject(torrent);
      const trackerLength = newTorrent[TRANSMISSION_COLUMN.TRACKERS].length;
      const newTrackers = trackers.map((t, i) => ({
        announce: t,
        id: i + trackerLength,
        tier: i + trackerLength,
      }));
      newTorrent[TRANSMISSION_COLUMN.TRACKERS] = [
        ...newTorrent[TRANSMISSION_COLUMN.TRACKERS],
        ...newTrackers,
      ];
      set(newTorrent);
    },
  };
}

export const torrentDetails = createTorrentDetailsStore();
