export default await fetch('./config.json')
    .then((res) => {
        return res.json();
    })
    .then((config) => {
        return config;
    })
    .catch((e) => {
        console.error('Something went wrong while fetching config.json', e);
        return {};
    });
