import { writable } from 'svelte/store';

const PANEL_SHOWN_STORAGE_KEY = 'panel-shown';

function createPanelStore() {
  const value = window.localStorage.getItem(PANEL_SHOWN_STORAGE_KEY);
  const { subscribe, update, set } = writable(value === 'true' || value === null);

  return {
    subscribe,
    toggle: () => {
      update((currentValue) => {
        window.localStorage.setItem(
          PANEL_SHOWN_STORAGE_KEY,
          (!currentValue).toString()
        );
        return !currentValue;
      });
    },
    close: () => {
      window.localStorage.setItem(
        PANEL_SHOWN_STORAGE_KEY,
        'false'
      );
      set(false);
    }
  };
}
export const panel = createPanelStore();
