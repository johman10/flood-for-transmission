import { derived, writable, get } from 'svelte/store';
import Transmission from '~helpers/Transmission';
import {
  SESSION_COLUMN_ALT_SPEED_DOWN,
  SESSION_COLUMN_ALT_SPEED_ENABLED,
  SESSION_COLUMN_ALT_SPEED_UP,
  SESSION_COLUMN_SPEED_LIMIT_DOWN_ENABLED,
  SESSION_COLUMN_SPEED_LIMIT_DOWN,
  SESSION_COLUMN_SPEED_LIMIT_UP_ENABLED,
  SESSION_COLUMN_SPEED_LIMIT_UP,
  SESSION_COLUMN_UNITS,
  SESSION_COLUMN_RPC_VERSION,
} from '~helpers/constants/columns';

const transmission = new Transmission();
const SESSION_REQUEST_INTERVAL = 2000;
const SESSION_BASE_COLUMNS = [
  SESSION_COLUMN_ALT_SPEED_DOWN,
  SESSION_COLUMN_ALT_SPEED_ENABLED,
  SESSION_COLUMN_ALT_SPEED_UP,
  SESSION_COLUMN_SPEED_LIMIT_DOWN_ENABLED,
  SESSION_COLUMN_SPEED_LIMIT_DOWN,
  SESSION_COLUMN_SPEED_LIMIT_UP_ENABLED,
  SESSION_COLUMN_SPEED_LIMIT_UP,
  SESSION_COLUMN_UNITS,
  SESSION_COLUMN_RPC_VERSION,
];
let updateSessionTimeout;
const store = writable({});
const { set, subscribe, update } = store;

function updateSession(setSession) {
  if (updateSessionTimeout) {
    clearTimeout(updateSessionTimeout);
  }

  transmission
    .getSession(SESSION_BASE_COLUMNS)
    .then(setSession)
    // TODO: Error handling
    .catch(console.error)
    .finally(() => {
      updateSessionTimeout = setTimeout(
        updateSession.bind(null, setSession),
        SESSION_REQUEST_INTERVAL
      );
    });
}

function createSessionStore() {
  updateSession(set);

  return {
    subscribe,
    set,
    addColumns: (columns) =>
      transmission.getSession(columns).then((result) => {
        const currentSession = get(store);
        set({ ...currentSession, ...result });
        return { ...currentSession, ...result };
      }),
    speedLimit: (direction) =>
      derived(store, ($session) => {
        if ($session[SESSION_COLUMN_ALT_SPEED_ENABLED]) {
          return direction === 'upload'
            ? $session[SESSION_COLUMN_ALT_SPEED_UP]
            : $session[SESSION_COLUMN_ALT_SPEED_DOWN];
        }

        if (
          direction === 'upload' &&
          $session[SESSION_COLUMN_SPEED_LIMIT_UP_ENABLED]
        ) {
          return $session[SESSION_COLUMN_SPEED_LIMIT_UP];
        }

        if (
          direction === 'download' &&
          $session[SESSION_COLUMN_SPEED_LIMIT_DOWN_ENABLED]
        ) {
          return $session[SESSION_COLUMN_SPEED_LIMIT_DOWN];
        }

        return null;
      }),
    updateSpeedLimit: (direction, enabled, limit, altSpeed) =>
      update((state) => {
        let enabledKey;
        let limitKey;

        if (altSpeed) {
          enabledKey = SESSION_COLUMN_ALT_SPEED_ENABLED;
          if (direction === 'upload') {
            limitKey = SESSION_COLUMN_ALT_SPEED_UP;
          } else {
            limitKey = SESSION_COLUMN_ALT_SPEED_DOWN;
          }
        } else {
          if (direction === 'upload') {
            enabledKey = SESSION_COLUMN_SPEED_LIMIT_UP_ENABLED;
            limitKey = SESSION_COLUMN_SPEED_LIMIT_UP;
          } else {
            enabledKey = SESSION_COLUMN_SPEED_LIMIT_DOWN_ENABLED;
            limitKey = SESSION_COLUMN_SPEED_LIMIT_DOWN;
          }
        }

        const data = {
          [enabledKey]: enabled,
          [limitKey]: limit,
        };
        transmission.setSession(data).catch(() => set(state));
        return { ...state, ...data };
      }),
    toggleAltSpeeds: (enabled) =>
      update((state) => {
        const data = {
          [SESSION_COLUMN_ALT_SPEED_ENABLED]: enabled,
        };
        transmission.setSession(data).catch(() => set(state));
        return { ...state, ...data };
      }),
    getPortTest: () => transmission.getPortTest(),
    updateBlocklist: () => transmission.updateBlocklist(),
    update: (data) => transmission.setSession(data),
  };
}

export const session = createSessionStore();
