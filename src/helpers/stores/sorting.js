import { writable } from 'svelte/store';
import { UI_COLUMN_PERCENT_COMPLETE } from '~helpers/constants/columns';

const SORTING_STORAGE_KEY = 'torrent-sorting'

function getSorting() {
  const storedSorting = window.localStorage.getItem(SORTING_STORAGE_KEY);
  if (storedSorting) return JSON.parse(storedSorting);

  // Default sorting
  return { column: UI_COLUMN_PERCENT_COMPLETE, direction: 'desc' };
}

function createSortingStore() {
  const { subscribe, set, update } = writable(getSorting());

  return {
    subscribe,
    set(value) {
      window.localStorage.setItem(SORTING_STORAGE_KEY, JSON.stringify(value));
      set(value);
    },
    update,
    updateToColumn(column) {
      let newValue;
      update((value) => {
        if (value.column === column && value.direction === 'desc') {
          newValue = { ...value, direction: 'asc' };
          return newValue;
        }
        newValue = { column, direction: 'desc' };
        return newValue;
      });
      window.localStorage.setItem(SORTING_STORAGE_KEY, JSON.stringify(newValue));
    }
  };
}
export const sorting = createSortingStore();
