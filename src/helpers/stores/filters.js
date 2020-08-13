import { writable } from 'svelte/store';

function createFiltersStore() {
  const { subscribe, set, update } = writable({
    search: null,
    status: null,
    label: null,
    tracker: null,
  });

  return {
    subscribe,
    set,
    update,
  };
}
export const filters = createFiltersStore();
