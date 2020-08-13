import { writable } from 'svelte/store';
import { uuid } from '~helpers/uuidHelper';

const ALERT_DURATION = 5000;

function createAlertStore() {
  const { subscribe, update } = writable([]);

  const remove = (id) =>
    update((state) => state.filter((alert) => alert.id !== id));

  return {
    subscribe,
    remove,
    add: (message, type = 'positive') =>
      update((state) => {
        const id = uuid();
        setTimeout(() => {
          remove(id);
        }, ALERT_DURATION);
        return [...state, { id, message, type }];
      }),
  };
}
export const alerts = createAlertStore();
