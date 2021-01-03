import { writable } from 'svelte/store';

function createContextMenuStore() {
  const { subscribe, set, update } = writable();

  return {
    subscribe,
    set,
    update,
    open: ({
      component,
      props = {},
      coordinates,
      matchElementWidth,
      element,
      ...rest
    }) => {
      const restKeys = Object.keys(rest);
      if (restKeys.length)
        throw new Error(
          `[ContextMenu] received unrecognized parameters ${restKeys.join(',')}`
        );
      set({
        component,
        props,
        coordinates,
        matchElementWidth,
        element,
      });
    },
    close: () => {
      set();
    },
  };
}
export const contextMenu = createContextMenuStore();
