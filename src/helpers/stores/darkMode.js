import config from '~helpers/configHelper';
import { get, readable, writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'darkMode';

const darkModeMediaQueryList =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
const browserPrefersDarkModeStore = readable(
  darkModeMediaQueryList.matches,
  (set) => {
    const handleDarkModeChange = (e) => {
      set(e.matches);
    };

    darkModeMediaQueryList.addEventListener('change', handleDarkModeChange);

    return () => {
      darkModeMediaQueryList.removeEventListener(
        'change',
        handleDarkModeChange
      );
    };
  }
);

// Returns the value from the storage or 'auto' if no storage value is found
function getConfiguredValue() {
  return window.localStorage.getItem(LOCAL_STORAGE_KEY) ?? config.DARK_MODE ?? 'auto';
}

// Returns whether darkMode is enabled
// Takes into account browser configuration as well as app configuration
function getDarkModeEnabled(configuredValue = getConfiguredValue()) {
  if (configuredValue === 'enabled') {
    return true;
  }

  if (configuredValue === 'disabled') {
    return false;
  }

  return get(browserPrefersDarkModeStore);
}

function createDarkModeStore() {
  const { subscribe, set } = writable(getDarkModeEnabled());
  const configuredValue = writable(getConfiguredValue());

  browserPrefersDarkModeStore.subscribe(() => {
    set(getDarkModeEnabled());
  });

  return {
    subscribe,
    configuredValue,
    set: (newValue) => {
      if (!['enabled', 'disabled', 'auto'].includes(newValue)) {
        throw new Error(
          `Invalid darkMode configuration received: ${newValue}. Should be one of enabled, disabled or auto`
        );
      }
      window.localStorage.setItem(LOCAL_STORAGE_KEY, newValue);
      configuredValue.set(newValue);
      set(getDarkModeEnabled(newValue));
    },
  };
}
export const darkMode = createDarkModeStore();
