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
}

export default await fetch('./config.json')
    .then((res) => {
        return res.json();
    })
    .then((config) => {
        return {...defaults, ...config};
    })
    .catch((e) => {
        console.error('Something went wrong while fetching config.json', e);
        return defaults;
    });