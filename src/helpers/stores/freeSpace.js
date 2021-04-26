import { writable } from 'svelte/store';
import { paths } from '~helpers/stores';
import Transmission from '~helpers/Transmission';

const FREE_SPACES_STORAGE_KEY = 'free-spaces';
const FREE_SPACES_REQUEST_INTERVAL = 10 * 60 * 1000; // 10 minutes
const transmission = new Transmission();
let updateFreeSpacesTimeout = null;

function getFreeSpaces(storedPaths, setFreeSpace) {
  if (updateFreeSpacesTimeout) {
    clearTimeout(updateFreeSpacesTimeout);
  }

  const promises = storedPaths.map((path) => transmission.getFreeSpace(path));
  Promise.all(promises)
    .then((freeSpaces) => {
      setFreeSpace(freeSpaces);
    })
    // TODO: Error handling
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      updateFreeSpacesTimeout = setTimeout(
        getFreeSpaces,
        FREE_SPACES_REQUEST_INTERVAL,
        storedPaths,
        setFreeSpace
      );
    });
}

function getConfigValue() {
  const storedConfig = window.localStorage.getItem(FREE_SPACES_STORAGE_KEY);
  if (storedConfig) return storedConfig === 'true';
  return false;
}

function storeConfigValue(value) {
  window.localStorage.setItem(
    FREE_SPACES_STORAGE_KEY,
    value ? 'true' : 'false'
  );
}

function createFreeSpaceStore() {
  const configStore = writable(getConfigValue());
  const { set, update, subscribe } = writable([], (set) => {
    let pathUnsubscribe;
    const configStoreUnsubscribe = configStore.subscribe(($config) => {
      if (!$config) {
        clearTimeout(updateFreeSpacesTimeout);
        return;
      }

      pathUnsubscribe = paths.subscribe(($paths) => {
        getFreeSpaces($paths, set);
      });
    });

    return () => {
      clearTimeout(updateFreeSpacesTimeout);
      configStoreUnsubscribe?.();
      pathUnsubscribe?.();
    };
  });

  return {
    subscribe,
    set,
    update,
    setConfig: (value) => {
      configStore.set(value);
      storeConfigValue(value);
    },
    configStore,
  };
}
export const freeSpace = createFreeSpaceStore();
