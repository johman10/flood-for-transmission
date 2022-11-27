import { writable } from 'svelte/store';

const PATHS_STORAGE_KEY = 'paths';

function getPaths() {
  const storedPaths = window.localStorage.getItem(PATHS_STORAGE_KEY);
  if (storedPaths) return JSON.parse(storedPaths);

  return fetch('./config.json')
    .then((res) => res.json())
    .then((json) => {
      let commonPaths = json.COMMON_PATH.split(',');
      return commonPaths.map((path) => path.trim()).filter(Boolean);
    })
    .catch((e) => {
      console.error('Something went wrong while fetching config.json', e);
      return [];
    });
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
