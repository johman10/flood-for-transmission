import config from '~helpers/configHelper';
import { writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'tableHeaderConfig';

function getConfiguredValue() {
  return (
    JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY)) ??
    config.WRAP_HEADER
  );
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
