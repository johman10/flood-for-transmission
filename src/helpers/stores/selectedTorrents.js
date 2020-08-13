import { writable } from 'svelte/store';

function createSelectedTorrentsStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set,
    update,
    add: (ids) =>
      update((state) =>
        [...state, ...ids].filter((v, i, a) => a.indexOf(v) === i)
      ),
    remove: (id) => update((state) => state.filter((sid) => sid !== id)),
    clear: () => set([]),
  };
}
export const selectedTorrents = createSelectedTorrentsStore();
