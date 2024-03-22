import {
  DEFAULT_COLUMN_WIDTH_EXCEPTIONS,
  DEFAULT_COLUMN_WIDTH,
  UI_COLUMN,
  DEFAULT_SORT_COLUMN_ID,
} from './constants/columns';

// DEFAULT configuration, can be (selectively) overwritten in /flood-for-transmission/public/config.json
// Check /flood-for-transmission/public/config.json.defaults to get started
const defaults = {
  DARK_MODE: 'auto', // String (enabled, disabled, auto)
  SWITCH_COLORS: false, // Boolean
  NOTATION_24H: true, // Boolean
  WRAP_HEADER: false, // Boolean
  COMMON_PATH: [], // Array of Strings
  COLUMNS: [
    // Array OR Object of Strings (key) and integers (value) pairs in the order they should appear and their respective width (0 = Default width)
    'Name',
    'Progress',
    'ETA',
    'Download Speed',
    'Upload Speed',
    'File Size',
    'Downloaded',
    'Uploaded',
    'Downloading from',
    'Seeding to'
  ],
  SORT_COLUMN: 'Progress', // String
  SORT_DIRECTION: 'desc', // String (asc, desc)
  SHOW_DISK_USAGE: true // Boolean
};

export default await fetch('./config.json')
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      console.info(
        'No config.json found, using default values:\nSee https://github.com/johman10/flood-for-transmission#beta-customization'
      );
    }
  })
  .then((config) => {
    return { ...defaults, ...config };
  })
  .catch((e) => {
    console.error('Something went wrong while fetching config.json', e);
    return defaults;
  })
  .then((configWithDefaults) => {
    const completeConfig = { ...configWithDefaults };
    const columns = Array.isArray(configWithDefaults.COLUMNS) ? configWithDefaults.COLUMNS : Object.keys(configWithDefaults.COLUMNS)
    completeConfig.COLUMNS = Object.values(UI_COLUMN)
      .map((column) => {
        return {
          ...column,
          width: completeConfig.COLUMNS[column.label] || (DEFAULT_COLUMN_WIDTH_EXCEPTIONS.find((dc) => dc.id === column.id) ?.width ?? DEFAULT_COLUMN_WIDTH), // Throws: Nullish coalescing operator(??) requires parens when mixing with logical operators - w/o the parentes
          enabled: columns.includes(column.label),
        };
      })
      .sort((a, b) => {
        const aIndex = columns.indexOf(a.label);
        const bIndex = columns.indexOf(b.label);
        // Sort by enabled items first, then by the index of the column from the config
        return b.enabled - a.enabled || aIndex - bIndex;
      });

    completeConfig.SORT_COLUMN =
      Object.values(UI_COLUMN).find(
        (column) => column.label === completeConfig.SORT_COLUMN
      )?.id || DEFAULT_SORT_COLUMN_ID;
    return completeConfig;
  });
