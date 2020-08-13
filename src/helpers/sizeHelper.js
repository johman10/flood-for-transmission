const SIZES = ['B', 'kB', 'MB', 'GB', 'TB'];
const SPEED_SIZES = SIZES.map((size) => `${size}/s`);

export const getSize = (
  value,
  { isSpeed = false, startSize = 'B', perSize = 1024 }
) => {
  if (Number.isNaN(value)) return {};

  let sizeIndex = startSize ? SIZES.indexOf(startSize) : 0;
  let sizeValue = value || 0;

  while (sizeValue >= perSize) {
    sizeIndex += 1;
    sizeValue /= perSize;
  }

  if (sizeValue < 100) {
    sizeValue = Math.round((sizeValue + Number.EPSILON) * 10) / 10;
  } else {
    sizeValue = Math.round(sizeValue);
  }

  return {
    value: sizeValue,
    size: isSpeed ? SPEED_SIZES[sizeIndex] : SIZES[sizeIndex],
  };
};
