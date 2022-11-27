const SIZES = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB'];
const SPEED_SIZES = SIZES.map((size) => `${size}/s`);

export const getSize = (
  value,
  { isSpeed = false, startSize = 'B', perSize = 1024 }
) => {
  if (Number.isNaN(value)) return {};

  let sizeIndex = SIZES.indexOf(startSize) > -1 ? SIZES.indexOf(startSize) : 0;
  if (value === 0)
    return {
      value: 0,
      size: isSpeed ? SPEED_SIZES[sizeIndex] : SIZES[sizeIndex],
    };

  sizeIndex = Math.floor(Math.log(value) / Math.log(perSize));
  const size = isSpeed ? SPEED_SIZES[sizeIndex] : SIZES[sizeIndex];
  const number = value / Math.pow(perSize, sizeIndex);
  const output =
    number < 100
      ? Math.round((number + Number.EPSILON) * 10) / 10
      : Math.round(number);

  return {
    value: output,
    size,
  };
};
