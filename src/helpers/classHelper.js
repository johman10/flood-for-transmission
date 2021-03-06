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

// Some of these may not happen since Transmission would perhaps not have metadata and checking at the same time
// However, there is no documentation available for what statuses are relevant together and which are not
// Full list of possible combinations:
// error
// stopped
// active
// checking
// completed error
// completed stopped
// completed active
// completed checking
// metadata error
// metadata stopped
// metadata active
// metadata checking
// selected error
// selected stopped
// selected active
// selected checking
// selected completed error
// selected completed stopped
// selected completed active
// selected completed checking
// selected metadata error
// selected metadata stopped
// selected metadata active
// selected metadata checking

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

  return [progressClass, statusClass, selectedClass].filter(Boolean).join(' ');
}
