import config from '~helpers/configHelper';
import { writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'tableHeaderConfig';

function getConfiguredValue() {
  const storedConfig = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedConfig === null) {
    return config.WRAP_HEADER || false;
  }
  return storedConfig === 'true';
}

function createTableHeaderConfig() {
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

export const tableHeaderConfig = createTableHeaderConfig();
