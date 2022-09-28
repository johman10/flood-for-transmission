import { writable } from 'svelte/store';

const PATHS_STORAGE_KEY = 'paths';

function getPaths() {
  const storedPaths = window.localStorage.getItem(PATHS_STORAGE_KEY);
  if (storedPaths) return JSON.parse(storedPaths);
  return [];
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
  const { subscribe, set, update } = writable(getPaths());
  const paths = {
    subscribe,
    set(value) {
      set(value);
      storeValue(value);
    },
    update,
    popup,
    add(path) {
      let newValue;
      update((value) => {
        newValue = value
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

  // Fetch preconfigured data and set common path from it
  fetch('./preconf.json')
    .then(res => res.json())
    .then(json => {
      let predPaths = json.COMMON_PATH.split(';');
      predPaths.forEach(elem => {
        paths.add(elem);
      });
    });

  return paths;
}
export const paths = createPathStore();
