import { writable, get } from 'svelte/store';

const createIpAddressStore = () => {
  const { set, update, subscribe } = writable({});

  return {
    set,
    update,
    subscribe,
    add: (ipAddresses) => {
      const currentStoreValue = get({ set, update, subscribe });
      const existingIpAddresses = Object.keys(currentStoreValue);
      const newIpAddresses = ipAddresses.filter(
        (ip) => !existingIpAddresses.includes(ip)
      );

      if (!newIpAddresses.length) {
        return Promise.resolve(currentStoreValue);
      }

      return fetch(
        `https://get.geojs.io/v1/ip/country.json?ip=${newIpAddresses.join(',')}`
      )
        .then((response) => response.json())
        .then((output) => {
          update((value) => {
            output.forEach((item) => {
              value[item.ip] = {
                country: item.country,
                name: item.name,
              };
            });
            return value;
          });
          return get({ set, update, subscribe });
        });
    },
  };
};

export const ipAddress = createIpAddressStore();
