import { get, writable } from 'svelte/store';
import Transmission from '~helpers/Transmission';
import { scheduleWhenVisible, isSameData } from '~helpers/pollHelper';

const transmission = new Transmission();
const SESSION_STATS_REQUEST_INTERVAL = 10000;
let cancelUpdate;
const store = writable({});
const { set, subscribe } = store;

function updateSessionStats(setSessionStats) {
  cancelUpdate?.();

  transmission
    .getSessionStats()
    .then((result) => {
      if (!result) {
        return;
      }
      // Avoid waking up every subscriber when nothing changed
      if (isSameData(result, get(store))) return;
      setSessionStats(result);
    })
    // TODO: Error handling
    .catch(console.error)
    .finally(() => {
      cancelUpdate = scheduleWhenVisible(
        updateSessionStats.bind(null, setSessionStats),
        SESSION_STATS_REQUEST_INTERVAL
      );
    });
}

function createSessionStatsStore() {
  updateSessionStats(set);

  return {
    subscribe,
  };
}

export const sessionStats = createSessionStatsStore();
