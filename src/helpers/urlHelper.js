export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return false;
  }
};
