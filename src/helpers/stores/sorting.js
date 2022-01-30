import { writable } from 'svelte/store';
import { UI_COLUMN_PERCENT_COMPLETE } from '~helpers/constants/columns';
import { uiColumns } from '~helpers/stores';

const SORTING_STORAGE_KEY = 'torrent-sorting';
const DEFAULT_SORTING = {
  id: UI_COLUMN_PERCENT_COMPLETE.id,
  direction: 'desc',
};

function storeSorting(value) {
  window.localStorage.setItem(SORTING_STORAGE_KEY, JSON.stringify(value));
}

function getSorting() {
  const storedSorting = window.localStorage.getItem(SORTING_STORAGE_KEY);
  if (storedSorting) {
    const sorting = JSON.parse(storedSorting);

    if (sorting.id) return sorting;

    // Migrate from using column name to column ID
    const uiColumnId = uiColumns.getColumnId(sorting.column);
    // Sorting seems invalid, fallback to the default sorting
    if (!uiColumnId) return DEFAULT_SORTING;

    const newSorting = {
      id: uiColumnId,
      direction: sorting.direction,
    };
    storeSorting(newSorting);
    return newSorting;
  }

  // Default sorting
  return DEFAULT_SORTING;
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
          newValue = { ...value, direction: 'asc' };
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
