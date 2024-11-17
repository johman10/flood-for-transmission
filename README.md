# Flood for Transmission

![Flood logo](flood.png)

Flood for Transmission is an alternative Web UI for [Transmission](https://transmissionbt.com/). It's a frontend web app that doesn't require any extra service running to communicate with Transmission. Even though it's a work-in-progress, it's definitely good enough to use.

Flood for Transmission is a clone of [Flood](https://github.com/Flood-UI/flood), which is originally build for rTorrent. All design and feature credit goes out to the creators of that. The code however is not a copy at all, it's been build from the ground up to make it work with Transmission.

#### Feedback

If you have a specific issue or bug, please file a [Github issue](https://github.com/johman10/flood-for-transmission/issues/new). Also feel free to bring up feature requests that way.

#### Other P2P clients

This project does not aim to support anything else than Transmission. If you're looking for other P2P client support check out [Flood by jesec](https://github.com/jesec/flood).

How this project is different from jesec's version:

1. This project does not require any running process, which makes it super lightweight.
1. It's dedicated to support Transmission as good as possible.
1. It uses the recommended way from Transmission to load the UI, by setting an environment variable.

#### Screenshots

Curious what it looks like? Do check out the [screenshots folder](screenshots#readme) but here is also a small sneak peak:

![Main](screenshots/Main.png)

# Getting started

### Pre-Requisites

1. [Transmission](https://transmissionbt.com/) needs to be installed and running. When on Linux the transmission-daemon is enough to get this to work.
   - As of now it's not possible to run Flood for Transmission on a separate machine, and frankly there would be little need for it since this project doesn't require it's own process to be running.
1. Usage of an evergreen browser such as [Chrome](https://www.google.com/chrome/), [Firefox](https://www.mozilla.org/en-US/firefox/new/) or [Edge](https://www.microsoft.com/en-us/edge). This project does not aim to support older browsers.

### Installation

1. Download the latest release with: `curl -OL https://github.com/johman10/flood-for-transmission/releases/download/latest/flood-for-transmission.zip`
1. Unpack with: `unzip flood-for-transmission.zip`. This should end up with a folder called `flood-for-transmission` in the current working directory.
1. Remove the now redundant zip file: `rm flood-for-transmission.zip`
1. Now tell Transmission to use Flood for Transmission, on Linux and Windows this can by done by using an environment variable, on Mac you will have to copy the extracted folder to the Tranmission app.
   - On **Linux** you can set the environment for systemd by running: `systemctl edit transmission-daemon.service`. In the opened file ensure it contains at least:
     ```
     [Service]
     Environment=TRANSMISSION_WEB_HOME=/path/to/flood-for-transmission
     ```
     Any other configuration can be added as you wish.
   - On **Windows** (untested) you have to set an environment variable to do this, open the start menu and type "environment". Click on "Edit this system environment variables". In the newly opened window choose "new" and fill in the "Variable name" `TRANSMISSION_WEB_HOME` and the "Variable value" to `C:\path\to\flood-for-transmission`.
   - On **Mac** create a backup of the folder at `/Applications/Transmission.app/Contents/Resources/public_html` with `cp /Applications/Transmission.app/Contents/Resources/public_html /Applications/Transmission.app/Contents/Resources/public_html.default`. Then copy the latest release folder to `/Applications/Transmission.app/Contents/Resources/public_html` like so `cp ~/Download/flood-for-transmission /Applications/Transmission.app/Contents/Resources/public_html`. Whenever you update Tranmission you will have to follow this procedure again. Note: there might be a way to do this with environment variables as well, [but as of now I don't know how to do it](https://github.com/johman10/flood-for-transmission/issues/330). If you know, please open an issue so that this can be updated.
1. Restart Transmission
1. Access transmission as you usually do, By default this would be by opening `http://localhost:9091`.

_Note:_ If you run Flood for Transmission behind SSL and in Chrome you can also run this interface like any other app by installing it as a PWA. For more instructions on that see the [Chrome docs](https://support.google.com/chrome/answer/9658361).

### [BETA] Customization

Flood for Transmission has some customization options which can be changed through the UI, however, since the UI is just running in the browser, the changes you make will only be stored in that specific browser.

If this is not what you want, and rather want your UI to consistently have the same configuration, you can also customize the configuration in two central ways; through the file system and through environment variables.

In order from least to most priority this is how configuration is applied:

1. Default configuration
2. Environment variables
3. File system
4. Browser based configuration (only applies in the specific browser where you apply the changes)

i.e. if you build Flood for Tranmission with the environment variable DARK_MODE set to "disabled" and then setup a file system based configuration with DARK_MODE set to "enabled", dark mode will be enabled as per the file system configuration.

> :memo: Note: If the configuration is not applied correctly check whether the browser has a value stored in localStorage.

#### Through the file system

To get started copy the `config.json.defaults` file to `config.json` in the same folder. Update the config.json file to match the configuration you like, safe the file and open Flood for Transmission. The configuration should be applied.

#### Through environment variables

> :memo: Note: this only work if you build Flood for Transmission from source. The environment variables have to be set before running `npm build`. If you just download the build version the default configuration will be used.

Before building Flood for Transmission apply configuration options by setting environment variables with for example `export FLOOD_DARK_MODE=disabled`. Apply all configuration options you want and ensure you use the same shell to build afterwards and the configuration should be applied on first load.

> :memo: Note: all environment variables are prefixed with `FLOOD_` to prevent collision with operating level environment variables.

#### Configuration options

Below is a list of all options to be applied.

- `"DARK_MODE"`
  - Type: String e.g. `"auto"` or `"enabled"` or `"disabled"`
- `"SWITCH_COLORS"`
  - Type: Boolean e.g `true` or `false`
- `"NOTATION_24H"`
  - Type: Boolean e.g `true` or `false`
- `"WRAP_HEADER"`
  - Type: Boolean e.g. `true` or `false`
- `"COMMON_PATH"`
  - Type: Array of Strings e.g. `["/downloads/expeliarmus", "/downloads/lumos"]`
- `"COLUMNS"`
  - Type: Array of Objects e.g. `[{ label: "Name", width: 400, enabled: true }, { label: "Progress", width: 600 }, { label: "Ratio", width: 0, enabled: false }]`
  - Comments:
    - Omitting a key from a column object will fall back to the default value
    - Omitting `enabled` will assume the value to be `true`, and still show the column
    - Note that you can control the order of the columns by the order of the array
- `"SORT_COLUMN"`
  - Type: String e.g. `"Ratio"`
- `"SORT_DIRECTION"`
  - Type: String `"asc"` or `"desc"`
- `"SHOW_DISK_USAGE"`
  - Type: Boolean `true` or `false`
  - Will only show for Transmission 4 and higher

### Updating

To update follow the following steps (feel free to write a cron job script for this):

1. Remove the last version: `rm -r flood-for-transmission`
1. Download the latest release with: `curl -OL https://github.com/johman10/flood-for-transmission/releases/download/latest/flood-for-transmission.zip`
1. Unpack with: `unzip flood-for-transmission.zip`. This should end up with a folder called `flood-for-transmission` in the current working directory.
1. Remove the now redundant zip file: `rm flood-for-transmission.zip`
1. Restart Transmission.

### Local Development

1. Run `npm install`.
1. Copy `.env.template` to `.env` and edit the values to represent your Transmission configuration.
1. Run `npm start`.
1. Access the UI in your browser. Defaults to `localhost:8080`.

If you're running Transmission on a different machine behind Nginx or similar you may have to allow for CORS request. You can do this by adding the code below to your Transmission location block.

```
if ($request_method = 'OPTIONS') {
    add_header 'Access-Control-Allow-Origin' 'http://localhost:8080';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    #
    # Custom headers and headers various browsers *should* be OK with but aren't
    #
    add_header 'Access-Control-Allow-Headers' 'Authorization,X-Transmission-Session-Id,DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    #
    # Tell client that this pre-flight info is valid for 20 days
    #
    add_header 'Access-Control-Max-Age' 1728000;
    add_header 'Content-Type' 'text/plain; charset=utf-8';
    add_header 'Content-Length' 0;
    return 204;
}
if ($request_method = 'POST') {
    add_header 'Access-Control-Allow-Origin' 'http://localhost:8080' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Authorization,X-Transmission-Session-Id,DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range,X-Transmission-Session-Id' always;
}
```
