export const TRANSMISSION_COLUMN_ADDED = 'addedDate';
export const TRANSMISSION_COLUMN_COMMENT = 'comment';
export const TRANSMISSION_COLUMN_CREATED = 'dateCreated';
export const TRANSMISSION_COLUMN_DONE = 'doneDate';
export const TRANSMISSION_COLUMN_DOWNLOAD_DIR = 'downloadDir';
export const TRANSMISSION_COLUMN_DOWNLOAD_PROGRESS = 'percentDone';
export const TRANSMISSION_COLUMN_DOWNLOAD_RATE = 'rateDownload';
export const TRANSMISSION_COLUMN_DOWNLOADED = 'downloadedEver';
export const TRANSMISSION_COLUMN_DOWNLOADING_FROM = 'peersSendingToUs';
export const TRANSMISSION_COLUMN_ERROR = 'error';
export const TRANSMISSION_COLUMN_ERROR_STRING = 'errorString';
export const TRANSMISSION_COLUMN_ETA = 'eta';
export const TRANSMISSION_COLUMN_HASH = 'hashString';
export const TRANSMISSION_COLUMN_ID = 'id';
export const TRANSMISSION_COLUMN_LABELS = 'labels';
export const TRANSMISSION_COLUMN_METADATA_PROGRESS = 'metadataPercentComplete';
export const TRANSMISSION_COLUMN_NAME = 'name';
export const TRANSMISSION_COLUMN_PEERS = 'peers';
export const TRANSMISSION_COLUMN_PEERS_CONNECTED = 'peersConnected';
export const TRANSMISSION_COLUMN_PRIORITY = 'bandwidthPriority';
export const TRANSMISSION_COLUMN_PRIVATE = 'isPrivate';
export const TRANSMISSION_COLUMN_RATIO = 'uploadRatio';
export const TRANSMISSION_COLUMN_RECHECK_PROGRESS = 'recheckProgress';
export const TRANSMISSION_COLUMN_SEEDING_TO = 'peersGettingFromUs';
export const TRANSMISSION_COLUMN_SIZE = 'sizeWhenDone';
export const TRANSMISSION_COLUMN_STATUS = 'status';
export const TRANSMISSION_COLUMN_TRACKERS = 'trackers';
export const TRANSMISSION_COLUMN_UPLOAD_RATE = 'rateUpload';
export const TRANSMISSION_COLUMN_UPLOADED = 'uploadedEver';
export const TRANSMISSION_COLUMN_FILES = 'files';
export const TRANSMISSION_COLUMN_FILE_STATS = 'fileStats';
export const TRANSMISSION_COLUMN_QUEUE_POSITION = 'queuePosition';
export const TRANSMISSION_COLUMN_TRACKER_STATS = 'trackerStats';
export const TRANSMISSION_COLUMN_MAGNET_LINK = 'magnetLink';

export const TRANSMISSION_COLUMN = {
  ADDED: TRANSMISSION_COLUMN_ADDED,
  COMMENT: TRANSMISSION_COLUMN_COMMENT,
  CREATED: TRANSMISSION_COLUMN_CREATED,
  DONE: TRANSMISSION_COLUMN_DONE,
  DOWNLOAD_DIR: TRANSMISSION_COLUMN_DOWNLOAD_DIR,
  DOWNLOAD_PROGRESS: TRANSMISSION_COLUMN_DOWNLOAD_PROGRESS,
  DOWNLOAD_RATE: TRANSMISSION_COLUMN_DOWNLOAD_RATE,
  DOWNLOADED: TRANSMISSION_COLUMN_DOWNLOADED,
  DOWNLOADING_FROM: TRANSMISSION_COLUMN_DOWNLOADING_FROM,
  ERROR_STRING: TRANSMISSION_COLUMN_ERROR_STRING,
  ERROR: TRANSMISSION_COLUMN_ERROR,
  ETA: TRANSMISSION_COLUMN_ETA,
  FILE_STATS: TRANSMISSION_COLUMN_FILE_STATS,
  FILES: TRANSMISSION_COLUMN_FILES,
  HASH: TRANSMISSION_COLUMN_HASH,
  ID: TRANSMISSION_COLUMN_ID,
  LABELS: TRANSMISSION_COLUMN_LABELS,
  MAGNET_LINK: TRANSMISSION_COLUMN_MAGNET_LINK,
  METADATA_PROGRESS: TRANSMISSION_COLUMN_METADATA_PROGRESS,
  NAME: TRANSMISSION_COLUMN_NAME,
  PEERS_CONNECTED: TRANSMISSION_COLUMN_PEERS_CONNECTED,
  PEERS: TRANSMISSION_COLUMN_PEERS,
  PRIORITY: TRANSMISSION_COLUMN_PRIORITY,
  PRIVATE: TRANSMISSION_COLUMN_PRIVATE,
  QUEUE_POSITION: TRANSMISSION_COLUMN_QUEUE_POSITION,
  RATIO: TRANSMISSION_COLUMN_RATIO,
  RECHECK_PROGRESS: TRANSMISSION_COLUMN_RECHECK_PROGRESS,
  SEEDING_TO: TRANSMISSION_COLUMN_SEEDING_TO,
  SIZE: TRANSMISSION_COLUMN_SIZE,
  STATUS: TRANSMISSION_COLUMN_STATUS,
  TRACKERS: TRANSMISSION_COLUMN_TRACKERS,
  TRACKER_STATS: TRANSMISSION_COLUMN_TRACKER_STATS,
  UPLOAD_RATE: TRANSMISSION_COLUMN_UPLOAD_RATE,
  UPLOADED: TRANSMISSION_COLUMN_UPLOADED,
};

export const SESSION_COLUMN_ALT_SPEED_DOWN = 'alt-speed-down';
export const SESSION_COLUMN_ALT_SPEED_ENABLED = 'alt-speed-enabled';
export const SESSION_COLUMN_ALT_SPEED_TIME_BEGIN = 'alt-speed-time-begin';
export const SESSION_COLUMN_ALT_SPEED_TIME_ENABLED = 'alt-speed-time-enabled';
export const SESSION_COLUMN_ALT_SPEED_TIME_END = 'alt-speed-time-end';
export const SESSION_COLUMN_ALT_SPEED_UP = 'alt-speed-up';
export const SESSION_COLUMN_BLOCKLIST_ENABLED = 'blocklist-enabled';
export const SESSION_COLUMN_BLOCKLIST_SIZE = 'blocklist-size';
export const SESSION_COLUMN_BLOCKLIST_URL = 'blocklist-url';
export const SESSION_COLUMN_CACHE_SIZE = 'cache-size-mb';
export const SESSION_COLUMN_DHT_ENABLED = 'dht-enabled';
export const SESSION_COLUMN_DOWNLOAD_DIR = 'download-dir';
export const SESSION_COLUMN_DOWNLOAD_QUEUE_ENABLED = 'download-queue-enabled';
export const SESSION_COLUMN_DOWNLOAD_QUEUE_SIZE = 'download-queue-size';
export const SESSION_COLUMN_IDLE_SEEDING_LIMIT = 'idle-seeding-limit';
export const SESSION_COLUMN_IDLE_SEEDING_LIMIT_ENABLED =
  'idle-seeding-limit-enabled';
export const SESSION_COLUMN_INCOMPLETE_DIR = 'incomplete-dir';
export const SESSION_COLUMN_INCOMPLETE_DIR_ENABLED = 'incomplete-dir-enabled';
export const SESSION_COLUMN_LPD_ENABLED = 'lpd-enabled';
export const SESSION_COLUMN_PEER_LIMIT_GLOBAL = 'peer-limit-global';
export const SESSION_COLUMN_PEER_LIMIT_PER_TORRENT = 'peer-limit-per-torrent';
export const SESSION_COLUMN_PEER_PORT = 'peer-port';
export const SESSION_COLUMN_PEER_PORT_RANDOM_ON_START =
  'peer-port-random-on-start';
export const SESSION_COLUMN_PEX_ENABLED = 'pex-enabled';
export const SESSION_COLUMN_PORT_FORWARDING_ENABLED = 'port-forwarding-enabled';
export const SESSION_COLUMN_QUEUE_STALLED_ENABLED = 'queue-stalled-enabled';
export const SESSION_COLUMN_QUEUE_STALLED_MINUTES = 'queue-stalled-minutes';
export const SESSION_COLUMN_REMOVE_ADDED = 'trash-original-torrent-files';
export const SESSION_COLUMN_RENAME_PARTIAL_FILES = 'rename-partial-files';
export const SESSION_COLUMN_SCRIPT_DONE_ENABLED = 'script-torrent-done-enabled';
export const SESSION_COLUMN_SCRIPT_DONE = 'script-torrent-done-filename';
export const SESSION_COLUMN_SEED_QUEUE_ENABLED = 'seed-queue-enabled';
export const SESSION_COLUMN_SEED_QUEUE_SIZE = 'seed-queue-size';
export const SESSION_COLUMN_SEED_RATIO_LIMIT = 'seedRatioLimit';
export const SESSION_COLUMN_SEED_RATIO_LIMITED = 'seedRatioLimited';
export const SESSION_COLUMN_SPEED_LIMIT_DOWN = 'speed-limit-down';
export const SESSION_COLUMN_SPEED_LIMIT_DOWN_ENABLED =
  'speed-limit-down-enabled';
export const SESSION_COLUMN_SPEED_LIMIT_UP = 'speed-limit-up';
export const SESSION_COLUMN_SPEED_LIMIT_UP_ENABLED = 'speed-limit-up-enabled';
export const SESSION_COLUMN_START_ADDED = 'start-added-torrents';
export const SESSION_COLUMN_UNITS = 'units';
export const SESSION_COLUMN_UNITS_SIZE = 'size-bytes';
export const SESSION_COLUMN_UNITS_SPEED = 'speed-bytes';
export const SESSION_COLUMN_UTP_ENABLED = 'utp-enabled';

export const SESSION_COLUMN = {
  ALT_SPEED_DOWN: SESSION_COLUMN_ALT_SPEED_DOWN,
  ALT_SPEED_ENABLED: SESSION_COLUMN_ALT_SPEED_ENABLED,
  ALT_SPEED_TIME_BEGIN: SESSION_COLUMN_ALT_SPEED_TIME_BEGIN,
  ALT_SPEED_TIME_ENABLED: SESSION_COLUMN_ALT_SPEED_TIME_ENABLED,
  ALT_SPEED_TIME_END: SESSION_COLUMN_ALT_SPEED_TIME_END,
  ALT_SPEED_UP: SESSION_COLUMN_ALT_SPEED_UP,
  BLOCKLIST_ENABLED: SESSION_COLUMN_BLOCKLIST_ENABLED,
  BLOCKLIST_SIZE: SESSION_COLUMN_BLOCKLIST_SIZE,
  BLOCKLIST_URL: SESSION_COLUMN_BLOCKLIST_URL,
  CACHE_SIZE: SESSION_COLUMN_CACHE_SIZE,
  DHT_ENABLED: SESSION_COLUMN_DHT_ENABLED,
  DOWNLOAD_DIR: SESSION_COLUMN_DOWNLOAD_DIR,
  DOWNLOAD_QUEUE_ENABLED: SESSION_COLUMN_DOWNLOAD_QUEUE_ENABLED,
  DOWNLOAD_QUEUE_SIZE: SESSION_COLUMN_DOWNLOAD_QUEUE_SIZE,
  IDLE_SEEDING_LIMIT_ENABLED: SESSION_COLUMN_IDLE_SEEDING_LIMIT_ENABLED,
  IDLE_SEEDING_LIMIT: SESSION_COLUMN_IDLE_SEEDING_LIMIT,
  INCOMPLETE_DIR_ENABLED: SESSION_COLUMN_INCOMPLETE_DIR_ENABLED,
  INCOMPLETE_DIR: SESSION_COLUMN_INCOMPLETE_DIR,
  LPD_ENABLED: SESSION_COLUMN_LPD_ENABLED,
  PEER_LIMIT_GLOBAL: SESSION_COLUMN_PEER_LIMIT_GLOBAL,
  PEER_LIMIT_PER_TORRENT: SESSION_COLUMN_PEER_LIMIT_PER_TORRENT,
  PEER_PORT_RANDOM_ON_START: SESSION_COLUMN_PEER_PORT_RANDOM_ON_START,
  PEER_PORT: SESSION_COLUMN_PEER_PORT,
  PEX_ENABLED: SESSION_COLUMN_PEX_ENABLED,
  PORT_FORWARDING_ENABLED: SESSION_COLUMN_PORT_FORWARDING_ENABLED,
  QUEUE_STALLED_ENABLED: SESSION_COLUMN_QUEUE_STALLED_ENABLED,
  QUEUE_STALLED_MINUTES: SESSION_COLUMN_QUEUE_STALLED_MINUTES,
  REMOVE_ADDED: SESSION_COLUMN_REMOVE_ADDED,
  RENAME_PARTIAL_FILES: SESSION_COLUMN_RENAME_PARTIAL_FILES,
  SCRIPT_DONE_ENABLED: SESSION_COLUMN_SCRIPT_DONE_ENABLED,
  SCRIPT_DONE: SESSION_COLUMN_SCRIPT_DONE,
  SEED_QUEUE_ENABLED: SESSION_COLUMN_SEED_QUEUE_ENABLED,
  SEED_QUEUE_SIZE: SESSION_COLUMN_SEED_QUEUE_SIZE,
  SEED_RATIO_LIMIT: SESSION_COLUMN_SEED_RATIO_LIMIT,
  SEED_RATIO_LIMITED: SESSION_COLUMN_SEED_RATIO_LIMITED,
  SPEED_LIMIT_DOWN_ENABLED: SESSION_COLUMN_SPEED_LIMIT_DOWN_ENABLED,
  SPEED_LIMIT_DOWN: SESSION_COLUMN_SPEED_LIMIT_DOWN,
  SPEED_LIMIT_UP_ENABLED: SESSION_COLUMN_SPEED_LIMIT_UP_ENABLED,
  SPEED_LIMIT_UP: SESSION_COLUMN_SPEED_LIMIT_UP,
  START_ADDED: SESSION_COLUMN_START_ADDED,
  UNITS_SIZE: SESSION_COLUMN_UNITS_SIZE,
  UNITS_SPEED: SESSION_COLUMN_UNITS_SPEED,
  UNITS: SESSION_COLUMN_UNITS,
  UTP_ENABLED: SESSION_COLUMN_UTP_ENABLED,
};

export const SESSION_STATS_CUMULATIVE_STATS = 'cumulative-stats';
export const SESSION_STATS_TOTAL_UPLOAD = 'uploadedBytes';
export const SESSION_STATS_TOTAL_DOWNLOAD = 'downloadedBytes';

export const UI_COLUMN_ADDED = {
  label: 'Added',
  id: 1,
};
export const UI_COLUMN_BASE_PATH = {
  label: 'Base Path',
  id: 2,
};
export const UI_COLUMN_COMMENT = {
  label: 'Comment',
  id: 3,
};
export const UI_COLUMN_CREATION_DATE = {
  label: 'Creation Date',
  id: 4,
};
export const UI_COLUMN_DONE = {
  label: 'Done',
  id: 5,
};
export const UI_COLUMN_DOWNLOAD_SPEED = {
  label: 'Download Speed',
  id: 6,
};
export const UI_COLUMN_DOWNLOADED = {
  label: 'Downloaded',
  id: 7,
};
export const UI_COLUMN_ERROR = {
  label: 'Error',
  id: 8,
};
export const UI_COLUMN_ETA = {
  label: 'ETA',
  id: 9,
};
export const UI_COLUMN_FILE_SIZE = {
  label: 'File Size',
  id: 10,
};
export const UI_COLUMN_HASH = {
  label: 'Hash',
  id: 11,
};
export const UI_COLUMN_LABELS = {
  label: 'Labels',
  id: 12,
};
export const UI_COLUMN_NAME = {
  label: 'Name',
  id: 13,
};
export const UI_COLUMN_PEERS = {
  label: 'Downloading from',
  oldLabels: ['Peers'],
  id: 14,
};
export const UI_COLUMN_PERCENT_COMPLETE = {
  label: 'Percent Complete',
  id: 15,
};
export const UI_COLUMN_PRIVATE = {
  label: 'Private',
  id: 16,
};
export const UI_COLUMN_QUEUE_POSITION = {
  label: 'Queue Position',
  id: 17,
};
export const UI_COLUMN_RATIO = {
  label: 'Ratio',
  id: 18,
};
export const UI_COLUMN_SEEDS = {
  label: 'Seeding to',
  oldLabels: ['Seeds'],
  id: 19,
};
export const UI_COLUMN_STATUS = {
  label: 'Status',
  id: 20,
};
export const UI_COLUMN_TRACKERS = {
  label: 'Trackers',
  id: 21,
};
export const UI_COLUMN_UPLOAD_SPEED = {
  label: 'Upload Speed',
  id: 22,
};
export const UI_COLUMN_UPLOADED = {
  label: 'Uploaded',
  id: 23,
};
export const UI_COLUMN_TOTAL_LEECHERS = {
  label: 'Total Leechers',
  id: 24,
};
export const UI_COLUMN_TOTAL_SEEDERS = {
  label: 'Total Seeders',
  id: 25,
};

export const UI_COLUMN = {
  ADDED: UI_COLUMN_ADDED,
  BASE_PATH: UI_COLUMN_BASE_PATH,
  COMMENT: UI_COLUMN_COMMENT,
  CREATION_DATE: UI_COLUMN_CREATION_DATE,
  DONE: UI_COLUMN_DONE,
  DOWNLOAD_SPEED: UI_COLUMN_DOWNLOAD_SPEED,
  DOWNLOADED: UI_COLUMN_DOWNLOADED,
  ERROR: UI_COLUMN_ERROR,
  ETA: UI_COLUMN_ETA,
  FILE_SIZE: UI_COLUMN_FILE_SIZE,
  HASH: UI_COLUMN_HASH,
  LABELS: UI_COLUMN_LABELS,
  NAME: UI_COLUMN_NAME,
  PEERS: UI_COLUMN_PEERS,
  PERCENT_COMPLETE: UI_COLUMN_PERCENT_COMPLETE,
  PRIVATE: UI_COLUMN_PRIVATE,
  QUEUE_POSITION: UI_COLUMN_QUEUE_POSITION,
  RATIO: UI_COLUMN_RATIO,
  SEEDS: UI_COLUMN_SEEDS,
  STATUS: UI_COLUMN_STATUS,
  TRACKERS: UI_COLUMN_TRACKERS,
  UPLOAD_SPEED: UI_COLUMN_UPLOAD_SPEED,
  UPLOADED: UI_COLUMN_UPLOADED,
  TOTAL_LEECHERS: UI_COLUMN_TOTAL_LEECHERS,
  TOTAL_SEEDERS: UI_COLUMN_TOTAL_SEEDERS,
};

export const DEFAULT_COLUMNS = [
  {
    id: UI_COLUMN.NAME.id,
    enabled: true,
    width: 600,
  },
  {
    id: UI_COLUMN.PERCENT_COMPLETE.id,
    enabled: true,
    width: 300,
  },
  {
    id: UI_COLUMN.ETA.id,
    enabled: true,
    width: 100,
  },
  {
    id: UI_COLUMN.DOWNLOAD_SPEED.id,
    enabled: true,
    width: 100,
  },
  {
    id: UI_COLUMN.UPLOAD_SPEED.id,
    enabled: true,
    width: 100,
  },
  {
    id: UI_COLUMN.FILE_SIZE.id,
    enabled: true,
    width: 100,
  },
  {
    id: UI_COLUMN.DOWNLOADED.id,
    enabled: true,
    width: 100,
  },
  {
    id: UI_COLUMN.UPLOADED.id,
    enabled: true,
    width: 100,
  },
  {
    id: UI_COLUMN.PEERS.id,
    enabled: true,
    width: 100,
  },
  {
    id: UI_COLUMN.SEEDS.id,
    enabled: true,
    width: 100,
  },
  {
    id: UI_COLUMN.ADDED.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.BASE_PATH.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.COMMENT.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.CREATION_DATE.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.HASH.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.PRIVATE.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.LABELS.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.ERROR.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.TRACKERS.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.RATIO.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.DONE.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.STATUS.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.QUEUE_POSITION.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.TOTAL_LEECHERS.id,
    enabled: false,
    width: 100,
  },
  {
    id: UI_COLUMN.TOTAL_SEEDERS.id,
    enabled: false,
    width: 100,
  },
];
export const TRANSMISSION_BASE_COLUMNS = [
  TRANSMISSION_COLUMN.DOWNLOAD_PROGRESS,
  TRANSMISSION_COLUMN.DOWNLOAD_RATE,
  TRANSMISSION_COLUMN.ERROR,
  TRANSMISSION_COLUMN.ID,
  TRANSMISSION_COLUMN.LABELS,
  TRANSMISSION_COLUMN.METADATA_PROGRESS,
  TRANSMISSION_COLUMN.NAME,
  TRANSMISSION_COLUMN.PRIORITY,
  TRANSMISSION_COLUMN.STATUS,
  TRANSMISSION_COLUMN.TRACKERS,
  TRANSMISSION_COLUMN.UPLOAD_RATE,
  TRANSMISSION_COLUMN.MAGNET_LINK,
];

// Order in value is important for sorting order, first item will be considered more important when sorting on the related UI column
export const COLUMN_MAP = {
  [UI_COLUMN.ADDED.id]: [TRANSMISSION_COLUMN.ADDED],
  [UI_COLUMN.BASE_PATH.id]: [TRANSMISSION_COLUMN.DOWNLOAD_DIR],
  [UI_COLUMN.COMMENT.id]: [TRANSMISSION_COLUMN.COMMENT],
  [UI_COLUMN.CREATION_DATE.id]: [TRANSMISSION_COLUMN.CREATED],
  [UI_COLUMN.DONE.id]: [TRANSMISSION_COLUMN.DONE],
  [UI_COLUMN.DOWNLOAD_SPEED.id]: [TRANSMISSION_COLUMN.DOWNLOAD_RATE],
  [UI_COLUMN.DOWNLOADED.id]: [TRANSMISSION_COLUMN.DOWNLOADED],
  [UI_COLUMN.ETA.id]: [TRANSMISSION_COLUMN.ETA],
  [UI_COLUMN.FILE_SIZE.id]: [TRANSMISSION_COLUMN.SIZE],
  [UI_COLUMN.HASH.id]: [TRANSMISSION_COLUMN.HASH],
  [UI_COLUMN.NAME.id]: [TRANSMISSION_COLUMN.NAME],
  [UI_COLUMN.PEERS.id]: [
    TRANSMISSION_COLUMN.DOWNLOADING_FROM,
    TRANSMISSION_COLUMN.PEERS_CONNECTED,
  ],
  [UI_COLUMN.PERCENT_COMPLETE.id]: [
    TRANSMISSION_COLUMN.DOWNLOAD_PROGRESS,
    TRANSMISSION_COLUMN.METADATA_PROGRESS,
    TRANSMISSION_COLUMN.RECHECK_PROGRESS,
    TRANSMISSION_COLUMN.STATUS,
  ],
  [UI_COLUMN.PRIVATE.id]: [TRANSMISSION_COLUMN.PRIVATE],
  [UI_COLUMN.QUEUE_POSITION.id]: [TRANSMISSION_COLUMN.QUEUE_POSITION],
  [UI_COLUMN.RATIO.id]: [TRANSMISSION_COLUMN.RATIO],
  [UI_COLUMN.SEEDS.id]: [
    TRANSMISSION_COLUMN.SEEDING_TO,
    TRANSMISSION_COLUMN.PEERS_CONNECTED,
  ],
  [UI_COLUMN.STATUS.id]: [TRANSMISSION_COLUMN.STATUS],
  [UI_COLUMN.LABELS.id]: [TRANSMISSION_COLUMN.LABELS],
  [UI_COLUMN.ERROR.id]: [TRANSMISSION_COLUMN.ERROR_STRING],
  [UI_COLUMN.TRACKERS.id]: [TRANSMISSION_COLUMN.TRACKERS],
  [UI_COLUMN.UPLOAD_SPEED.id]: [TRANSMISSION_COLUMN.UPLOAD_RATE],
  [UI_COLUMN.UPLOADED.id]: [TRANSMISSION_COLUMN.UPLOADED],
  [UI_COLUMN.TOTAL_LEECHERS.id]: [TRANSMISSION_COLUMN.TRACKER_STATS],
  [UI_COLUMN.TOTAL_SEEDERS.id]: [TRANSMISSION_COLUMN.TRACKER_STATS],
};
