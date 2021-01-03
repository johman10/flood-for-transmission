import { writable } from 'svelte/store';

function createModalsStore() {
  const { subscribe, set, update } = writable();

  return {
    subscribe,
    set,
    update,
    open: ({ component, props = {}, large = false, ...rest }) => {
      const restKeys = Object.keys(rest);
      if (restKeys.length)
        throw new Error(
          `[Modals] received unrecognized parameters ${restKeys.join(',')}`
        );
      set({ component, props, large });
    },
    close: () => {
      set();
    },
  };
}
export const modals = createModalsStore();
