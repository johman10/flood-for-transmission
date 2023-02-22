// DEFAULT configuration, can be (selectively) overwritten in /flood-for-transmission/public/config.json
// Check /flood-for-transmission/public/config.json.defaults to get started
const defaults = {
    DARK_MODE: 'auto',          // String (enabled, disabled, auto)
    SWITCH_COLORS: false,       // Boolean
    NOTATION_24H: true,         // Boolean
    WRAP_HEADER: false,         // Boolean
    COMMON_PATH: [],            // Array of Strings
    COLUMNS: [                  // Array of Strings in the order they should appear
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
    SORT_COLUMN: 'Progress',    // String
    SORT_DIRECTION: 'desc'      // String (asc, desc)
};

export default await fetch('./config.json')
    .then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            console.info('No config.json found, using default values:\nSee https://github.com/johman10/flood-for-transmission#beta-customization');
        }
    })
    .then((config) => {
        return {...defaults, ...config};
    })
    .catch((e) => {
        console.error('Something went wrong while fetching config.json', e);
        return defaults;
    });
