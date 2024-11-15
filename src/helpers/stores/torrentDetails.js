import { TRANSMISSION_COLUMN } from '~helpers/constants/columns';
import { writable } from 'svelte/store';
import Transmission from '~helpers/Transmission';

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
      if (!torrents.length) {
        return;
      }
      setTorrent({
        ...torrents[0],
        [TRANSMISSION_COLUMN.FILES]: torrents[0][TRANSMISSION_COLUMN.FILES].map(
          (file, index) => ({
            ...file,
            index: index.toString(),
          })
        ),
        loaded: true,
      });
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
    setPriority: (torrent, fileIndices, priority) => {
      let params;
      const fileIndicesInt = fileIndices.map((fileIndex) =>
        parseInt(fileIndex)
      );
      switch (priority) {
        case -2:
          params = { 'files-unwanted': fileIndicesInt };
          break;
        case -1:
          params = {
            'priority-low': fileIndicesInt,
            'files-wanted': fileIndicesInt,
          };
          break;
        case 0:
          params = {
            'priority-normal': fileIndicesInt,
            'files-wanted': fileIndicesInt,
          };
          break;
        case 1:
          params = {
            'priority-high': fileIndicesInt,
            'files-wanted': fileIndicesInt,
          };
          break;
      }
      transmission
        .setTorrents([torrent[TRANSMISSION_COLUMN.ID]], params)
        .catch(() => {
          set({ ...torrent, loaded: true });
        });

      const newTorrent = structuredClone(torrent);
      fileIndices.forEach((fileIndex) => {
        newTorrent[TRANSMISSION_COLUMN.FILE_STATS][fileIndex].priority =
          priority;
        newTorrent[TRANSMISSION_COLUMN.FILE_STATS][fileIndex].wanted =
          !!params['files-wanted'];
      });
      set({ ...newTorrent, loaded: true });
    },
    setTrackers: (torrent, trackerUrls) => {
      transmission
        .setTorrents([torrent[TRANSMISSION_COLUMN.ID]], {
          [TRANSMISSION_COLUMN.TRACKER_URLS]: trackerUrls,
        })
        .catch(() => set({ ...torrent, loaded: true }));
    },
    setDetails: (torrent, data) => {
      const promise = transmission
        .setTorrents([torrent[TRANSMISSION_COLUMN.ID]], data)
        .catch(() => set({ ...torrent, loaded: true }));

      let newTorrent = structuredClone(torrent);
      newTorrent = { ...newTorrent, ...data };
      set({ ...newTorrent, loaded: true });

      return promise;
    },
  };
}

export const torrentDetails = createTorrentDetailsStore();
