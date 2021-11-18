import { writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'switchSpeedColors';

function getConfiguredValue() {
  return window.localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
}

function createSwitchSpeedColors() {
  const { subscribe, set, update } = writable(getConfiguredValue());

  return {
    subscribe,
    set: (value) => {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, value);
      set(value);
    },
    update,
  };
}

export const switchSpeedColors = createSwitchSpeedColors();
