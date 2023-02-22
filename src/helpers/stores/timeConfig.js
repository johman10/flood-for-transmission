import config from '~helpers/configHelper';
import { writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'timeConfig';

function getConfiguredValue() {
  return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY)) ?? config.NOTATION_24H;
}

function createTimeConfig() {
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

export const timeConfig = createTimeConfig();
