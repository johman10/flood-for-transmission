import { writable } from 'svelte/store';
import Transmission from '~helpers/Transmission';

const transmission = new Transmission();
const SESSION_STATS_REQUEST_INTERVAL = 10000;
let updateSessionTimeout;
const store = writable({});
const { set, subscribe } = store;

function updateSessionStats(setSessionStats) {
  if (updateSessionTimeout) {
    clearTimeout(updateSessionTimeout);
  }

  transmission
    .getSessionStats()
    .then(setSessionStats)
    // TODO: Error handling
    .catch(console.error)
    .finally(() => {
      updateSessionTimeout = setTimeout(
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
