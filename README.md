# Flood for Transmission

![Flood logo](flood.png)

Flood for Transmission is an alternative Web UI for [Transmission](https://transmissionbt.com/). It's a frontend web app that doesn't require any extra service running to communicate with Transmission. Even though it's a work-in-progress, it's definitely good enough to use.

Flood for Transmission is a clone of [Flood](https://github.com/Flood-UI/flood), which is originally build for rTorrent. All design and feature credit goes out to the creators of that. The code however is not a copy at all, it's been build from the ground up to make it work with Transmission.

Curious what it looks like? Do check out the [screenshots](screenshots#readme)

#### Feedback

If you have a specific issue or bug, please file a [Github issue](https://github.com/johman10/flood-for-transmission/issues/new). Also feel free to bring up feature requests that way.

# Getting started

### Pre-Requisites

1. [Transmission](https://transmissionbt.com/) needs to be installed and running. When on Linux the transmission-daemon is enough to get this to work.
    * As of now it's not possible to run Flood for Transmission on a separate machine, and frankly there would be little need for it since this project doesn't require it's own process to be running.
1. Install NodeJS (you might want to manage different Node versions with [nodenv](https://github.com/nodenv/nodenv) or [nvm](https://github.com/creationix/nvm) or [n](https://github.com/tj/n)).
1. Usage of an evergreen browser such as [Chrome](https://www.google.com/chrome/), [Firefox](https://www.mozilla.org/en-US/firefox/new/) or [Edge](https://www.microsoft.com/en-us/edge). This project does not aim to support older browsers.

### Installation

1. Figure out where you want to keep the files, and clone this repo with `git clone git@github.com:johman10/flood-for-transmission.git`.
1. change to the project folder by running `cd flood-for-transmission`.
1. Run `npm install`.
1. Run `npm run build`.
1. Now tell Transmission where you put the new UI, on all environments this can by done by using an environment variable.
    * On **Linux** you can set the environment for systemd by running: `systemctl edit transmission-daemon.service`. In the opened file ensure it contains at least:
        ```
        [Service]
        Environment=TRANSMISSION_WEB_HOME=/path/to/flood-for-transmission/public
        ```
        Any other configuration can be added as you wish.
    * On **Windows** (untested) you have to set an environment variable to do this, open the start menu and type "environment". Click on "Edit this system environment variables". In the newly opened window choose "new" and fill in the "Variable name" `TRANSMISSION_WEB_HOME` and the "Variable value" to `C:\path\to\flood-for-transmission/public`.
    * On **Mac** (untested) open the file `~/.zprofile` in your favorite text editor and add `export TRANSMISSION_WEB_HOME=/path/to/flood-for-transmission/public`.
    * **In all cases** ensure that the configured path always ends with `/public`. It has to point to the folder where Transmission can find the `index.html` file.
1. Restart Transmission
1. Access transmission as you usually do, By default this would be by opening `http://localhost:9091`.

_Note:_ If you run Flood for Transmission behind SSL and in Chrome you can also run this interface like any other app by installing it as a PWA. For more instructions on that see the [Chrome docs](https://support.google.com/chrome/answer/9658361).

### Updating

I won't be maintaining versions for this project. So to update follow the following steps (feel free to write a cron job script for this):

1. Run `git pull` in this repository's directory.
1. Run `npm install` to update dependencies.
1. Run `npm run build` to transpile and bundle static assets.
1. Restart Transmission.

### Local Development

1. Run `npm install`.
1. Copy `.env.template` to `.env` and edit the values to represent your Transmission configuration.
1. Run `npm run dev`.
1. Access the UI in your browser. Defaults to `localhost:5000`.
