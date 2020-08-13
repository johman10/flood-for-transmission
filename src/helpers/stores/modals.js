import { writable } from 'svelte/store';

function createModalsStore() {
  const { subscribe, set, update } = writable();

  return {
    subscribe,
    set,
    update,
    open: (modalName) => {
      set(modalName);
    },
    close: () => {
      set();
    },
  };
}
export const modals = createModalsStore();
