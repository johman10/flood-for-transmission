import config from '~helpers/configHelper';
import { writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'mobileView';

function getConfiguredValue() {
  return (
    JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY)) ??
    config.MOBILE_VIEW
  );
}

function createMobileView() {
  const { subscribe, set, update } = writable(getConfiguredValue());

  return {
    subscribe,
    set: (value) => {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
      set(value);
    },
    update,
  };
}

export const mobileView = createMobileView();
