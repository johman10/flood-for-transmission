export const cloneObject = (object) => {
  if (typeof object !== 'object') return object;

  const newObject = {};

  Object.keys(object).forEach((key) => {
    const value = object[key];
    if (typeof value !== 'object') {
      newObject[key] = value;
    } else if (Array.isArray(value)) {
      newObject[key] = value.map(cloneObject);
    } else {
      newObject[key] = cloneObject(value);
    }
  });

  return newObject;
};
