import config from '~helpers/configHelper';
import { writable } from 'svelte/store';

const SORTING_STORAGE_KEY = 'torrent-sorting';

function storeSorting(value) {
  window.localStorage.setItem(SORTING_STORAGE_KEY, JSON.stringify(value));
}

function getSorting() {
  const storedSorting = JSON.parse(
    window.localStorage.getItem(SORTING_STORAGE_KEY)
  );
  const currentSorting = {
    id: storedSorting?.id ?? config.SORT_COLUMN,
    direction: storedSorting?.direction ?? config.SORT_DIRECTION,
  };
  storeSorting(currentSorting);
  return currentSorting;
}

function createSortingStore() {
  const { subscribe, set, update } = writable(getSorting());

  return {
    subscribe,
    set(value) {
      storeSorting(value);
      set(value);
    },
    update,
    updateToColumn(id) {
      let newValue;
      update((value) => {
        if (value.id === id && value.direction === 'desc') {
          newValue = { id, direction: 'asc' };
          return newValue;
        }

        newValue = { id, direction: 'desc' };
        return newValue;
      });
      window.localStorage.setItem(
        SORTING_STORAGE_KEY,
        JSON.stringify(newValue)
      );
    },
  };
}
export const sorting = createSortingStore();
