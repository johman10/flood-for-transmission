import { writable } from 'svelte/store';
import { torrents } from '~helpers/stores/torrents';

function createRateData() {
  const currentTimestamp = Date.now();
  const dataPoints = 60;
  const { subscribe, update, set } = writable({
    upload: new Array(dataPoints).fill(0),
    download: new Array(dataPoints).fill(0),
    timestamps: new Array(dataPoints)
      .fill(currentTimestamp)
      .map((value, index) => value - (dataPoints - index) * 1000),
  });

  torrents.totalRate.subscribe(($rate) => {
    const data = { ...$rate, timestamp: Date.now() };
    update((rateData) => {
      const rateDataClone = { ...rateData };
      rateDataClone.timestamps.shift();
      rateDataClone.upload.shift();
      rateDataClone.download.shift();
      rateDataClone.timestamps.push(data.timestamp);
      rateDataClone.upload.push(data.upload);
      rateDataClone.download.push(data.download);
      return rateDataClone;
    });
  });

  return {
    subscribe,
    update,
    set,
  };
}
export const rateData = createRateData();
