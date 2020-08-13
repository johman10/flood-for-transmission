import { STATUSSES } from '~helpers/Transmission';
import {
  TRANSMISSION_COLUMN_DOWNLOAD_PROGRESS,
  TRANSMISSION_COLUMN_ERROR,
  TRANSMISSION_COLUMN_METADATA_PROGRESS,
  TRANSMISSION_COLUMN_STATUS,
} from '~helpers/constants/columns';

export function generateTorrentStatusClass(torrent, selected = false) {
  let progressClass = '';
  let statusClass = '';
  let selectedClass = '';

  if (torrent[TRANSMISSION_COLUMN_DOWNLOAD_PROGRESS] === 1) {
    progressClass = 'completed';
  } else if (torrent[TRANSMISSION_COLUMN_METADATA_PROGRESS] < 1) {
    progressClass = 'metadata';
  }

  if (torrent[TRANSMISSION_COLUMN_ERROR] > 1) {
    statusClass = 'error';
  } else if (STATUSSES[torrent[TRANSMISSION_COLUMN_STATUS]] === 'stopped') {
    statusClass = 'stopped';
  } else if (
    ['downloading', 'seeding'].includes(
      STATUSSES[torrent[TRANSMISSION_COLUMN_STATUS]]
    )
  ) {
    statusClass = 'active';
  } else {
    statusClass = 'checking';
  }

  if (selected) {
    selectedClass = 'selected';
  }

  return `${progressClass} ${statusClass} ${selectedClass}`
    .split('  ')
    .join(' ')
    .trim();
}
