import {
  STATUSES,
  STATUS_STOPPED,
  STATUS_DOWNLOADING,
  STATUS_SEEDING,
} from '~helpers/Transmission';
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
  } else if (STATUSES[torrent[TRANSMISSION_COLUMN_STATUS]] === STATUS_STOPPED) {
    statusClass = 'stopped';
  } else if (
    [STATUS_DOWNLOADING, STATUS_SEEDING].includes(
      STATUSES[torrent[TRANSMISSION_COLUMN_STATUS]]
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
