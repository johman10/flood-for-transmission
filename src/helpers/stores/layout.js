import { readable, writable } from 'svelte/store';

const MOBILE_QUERY = '(max-width: 700px)';

// Phones get the full screen torrent detail modal, larger screens the docked pane
export const isMobile = readable(
  window.matchMedia(MOBILE_QUERY).matches,
  (set) => {
    const mediaQueryList = window.matchMedia(MOBILE_QUERY);
    const handleChange = (event) => set(event.matches);
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }
);

// Bumped whenever something asks for the details pane to be shown, so a
// collapsed pane can expand itself.
export const detailsPaneRequest = writable(0);
