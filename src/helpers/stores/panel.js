import { writable } from 'svelte/store';

const PANEL_SHOWN_STORAGE_KEY = 'panel-shown';

function createPanelStore() {
  const value = window.localStorage.getItem(PANEL_SHOWN_STORAGE_KEY);
  const { subscribe, update } = writable(value === 'true' || value === null);

  return {
    subscribe,
    toggle: () => {
      update((currentValue) => {
        window.localStorage.setItem(PANEL_SHOWN_STORAGE_KEY, (!currentValue).toString());
        return !currentValue;
      });
    },
  };
}
export const panel = createPanelStore();
