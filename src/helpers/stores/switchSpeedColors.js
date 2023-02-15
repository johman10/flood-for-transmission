import config from '~helpers/configHelper';
import { writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'switchSpeedColors';

function getConfiguredValue() {
  const storedConfig = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedConfig === null) {
    return config.SWITCH_COLORS || false;
  }
  return storedConfig === 'true';
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
