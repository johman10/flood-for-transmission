export function trackerStripper(trackerUrl) {
  const parts = trackerUrl
    .split('://')[1]
    .split(':')[0]
    .split('/')[0]
    .split('.');
  return [parts[parts.length - 2], parts[parts.length - 1]].join('.');
}
