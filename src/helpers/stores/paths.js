import config from '~helpers/configHelper';
import { writable } from 'svelte/store';

const PATHS_STORAGE_KEY = 'paths';

function getPaths() {
  const storedPaths = window.localStorage.getItem(PATHS_STORAGE_KEY);
  if (storedPaths) return JSON.parse(storedPaths);
  return config.COMMON_PATH || []
}

function cleanValue(value) {
  return value.filter(Boolean);
}

function storeValue(value) {
  const cleanedValue = cleanValue(value);
  window.localStorage.setItem(PATHS_STORAGE_KEY, JSON.stringify(cleanedValue));
}

const popup = writable({ element: null, shown: false });

function createPathStore() {
  const { subscribe, set, update } = writable([]);
  let initialized = false;

  const setAndStore = (value) => {
    set(value);
    storeValue(value);
  };

  const paths = {
    init: async () => {
      if (initialized) return;

      const paths = await getPaths();
      console.log(paths);
      setAndStore(paths);

      initialized = true;
    },
    subscribe,
    set: setAndStore,
    update,
    popup,
    add(path) {
      let newValue;
      update((value) => {
        newValue = value;
        if (!value.includes(path)) {
          newValue = [...value, path];
        }
        return newValue;
      });
      storeValue(newValue);
    },
    remove(removingPath) {
      let newValue;
      update((value) => {
        newValue = value.filter((path) => path !== removingPath);
        return newValue;
      });
      storeValue(newValue);
    },
  };

  return paths;
}
export const paths = createPathStore();
