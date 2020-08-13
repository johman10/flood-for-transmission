# Flood for Transmission

![Flood logo](flood.png)

Flood for Transmission is an alternative UI for [Transmission](https://transmissionbt.com/). It's a frontend web app that doesn't require any extra service running to communicate with Transmission. Even though it's a work-in-progress, it's definitely good enough to use.

Flood for Transmission is a copy of [Flood](https://github.com/Flood-UI/flood), which is originally build for rTorrent. All design and feature credit goes out to the creators of that. The code however is not a copy at all, it's been build from the ground up to make it work with Transmission.

# Getting started

### Pre-Requisites

1. [Transmission](https://transmissionbt.com/) needs to be installed and running. When on Linux the transmission-daemon is enough to get this to work. Flood for Transmission should be added to the same machine as where Transmission is running. As of now it's not possible to run Flood for Transmission on a seperate machine, and frankly there would be little need for it since this project doesn't require it's own service.

### Compiling assets

Figure out where you want to keep the files, and clone this repo with: 
From the root of the Flood for Transmission directory...
1. Clone this repository
1. Run `npm install` if you haven't already or if you've pulled changes.
1. Run `npm run build`.
1. Run `npm start`.

Access the UI in your browser. With default settings, go to `http://localhost:3000`. You can configure the port in `config.js`.

### Updating

I've been bad about cutting actual releases, so check this repo for recent commits.

1. To update, run `git pull` in this repository's directory.
1. Check `config.template.js` for configuration changes that you may wish to incoporate in your `config.js`.
1. Kill the currently running Flood server.
1. Run `npm install` to update dependencies.
1. Run `npm run build` to transpile and bundle static assets.
1. Start the Flood server with `npm start`.

### Troubleshooting

* Ubuntu users may need to install `nodejs-legacy` (`sudo apt-get install nodejs-legacy`) for dependencies to install successfully. You can read more on [this Stack Overflow post](http://stackoverflow.com/questions/21168141/cannot-install-packages-using-node-package-manager-in-ubuntu).
* Ask for help in the [Flood Discord server](https://discord.gg/Z7yR5Uf).

### Local Development

1. Run `npm install`.
2. Run `npm run start:development:server` and `npm run start:development:client` in separate terminal instances.
    * `npm run start:development:server` uses [nodemon](https://github.com/remy/nodemon) to watch for changes to the server-side JavaScript.
    * `npm run start:development:client` watches for changes in the client-side source.
3. Access the UI in your browser. Defaults to `localhost:4200`.

### Environment Variables

1. `DEV_SERVER_PORT`: webpackDevServer's port, used when developing Flood. Defaults to `4200`.
1. `DEV_SERVER_HOST`: webpackDevServer's host, used when developing Flood. Defaults to `0.0.0.0`.
1. `DEV_SERVER_HTTPS`: webpackDevServer's protocol, used when developing Flood. Defaults to `http`.

### Running with Docker

1. `docker build -t rtorrent-flood .`
2. `docker run --name rtorrent-flood -e RTORRENT_SCGI_HOST=w.x.y.z -p 3000:3000 rtorrent-flood`
3. Other supported environment variables:
    * `FLOOD_BASE_URI`
    * `FLOOD_SECRET`
    * `FLOOD_ENABLE_SSL`

The docker container includes a volume at `/data`, which is where the database will be located.  Additionally, you can place your SSL files there, `/data/flood_ssl.key` and `/data/flood_ssl.cert`. Set `FLOOD_ENABLE_SSL` to `true` to enable their use if present. Additionally, a local rtorrent socket file located at `/data/rtorrent.sock` can be used if `RTORRENT_SOCK` is set to `true`. The location of the socket file can be overrided by setting `RTORRENT_SOCK_PATH` to the path of the socket.

Check out the [Wiki](https://github.com/Flood-UI/flood/wiki/Docker) for more information.
