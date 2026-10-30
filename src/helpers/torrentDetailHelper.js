import { get } from 'svelte/store';
import {
  isMobile,
  detailsPaneRequest,
  modals,
  selectedTorrents,
} from '~helpers/stores';
import { TorrentDetail } from '~components/Modal';

export const openTorrentDetails = (torrentId) => {
  if (get(isMobile)) {
    modals.open({
      component: TorrentDetail,
      large: true,
      props: { torrentId },
    });
    return;
  }

  if (get(selectedTorrents).at(-1) !== torrentId) {
    selectedTorrents.set([torrentId]);
  }
  detailsPaneRequest.update((count) => count + 1);
};
