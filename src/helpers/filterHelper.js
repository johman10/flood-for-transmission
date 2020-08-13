import { STATUSSES } from '~helpers/Transmission';
import {
  TRANSMISSION_COLUMN_DOWNLOAD_PROGRESS,
  TRANSMISSION_COLUMN_STATUS,
  TRANSMISSION_COLUMN_ERROR,
  TRANSMISSION_COLUMN_NAME,
  TRANSMISSION_COLUMN_LABELS,
  TRANSMISSION_COLUMN_TRACKERS,
} from '~helpers/constants/columns';
import { trackerStripper } from '~helpers/trackerHelper';

export function statusFilter(status, torrent) {
  switch (status) {
    case 'downloading':
      return [
        STATUSSES.indexOf('downloading'),
        STATUSSES.indexOf('download-waiting'),
      ].includes(torrent[TRANSMISSION_COLUMN_STATUS]);
    case 'complete':
      return torrent[TRANSMISSION_COLUMN_DOWNLOAD_PROGRESS] === 1;
    case 'stopped':
      return (
        torrent[TRANSMISSION_COLUMN_STATUS] === STATUSSES.indexOf('stopped')
      );
    case 'checking':
      return [
        STATUSSES.indexOf('checking'),
        STATUSSES.indexOf('check-waiting'),
      ].includes(torrent[TRANSMISSION_COLUMN_STATUS]);
    case 'seeding':
      return [
        STATUSSES.indexOf('seeding'),
        STATUSSES.indexOf('seed-waiting'),
      ].includes(torrent[TRANSMISSION_COLUMN_STATUS]);
    case 'error':
      return torrent[TRANSMISSION_COLUMN_ERROR];
    default:
      return true;
  }
}

export function searchFilter(query, torrent) {
  if (!query) return true;

  const replaceRegex = /[^a-z0-9]/g;
  const searchValue = query.toLowerCase().replace(replaceRegex, '');
  const value = torrent[TRANSMISSION_COLUMN_NAME].toLowerCase().replace(
    replaceRegex,
    ''
  );
  return value.includes(searchValue);
}

export function labelFilter(label, torrent) {
  if (!label) return true;

  if (label === 'unlabeled') {
    return (
      !torrent[TRANSMISSION_COLUMN_LABELS] ||
      !torrent[TRANSMISSION_COLUMN_LABELS].length
    );
  }

  return torrent[TRANSMISSION_COLUMN_LABELS].includes(label);
}

export function trackerFilter(tracker, torrent) {
  if (!tracker) return true;

  return !!torrent[TRANSMISSION_COLUMN_TRACKERS].find(
    (t) => trackerStripper(t.announce) === tracker
  );
}
