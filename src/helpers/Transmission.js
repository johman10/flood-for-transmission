const TOKEN_HEADER = 'X-Transmission-Session-Id';

export const STATUS_STOPPED = 'Stopped';
export const STATUS_CHECK_WAITING = 'Check waiting';
export const STATUS_CHECKING = 'Checking';
export const STATUS_DOWNLOAD_WAITING = 'Download waiting';
export const STATUS_DOWNLOADING = 'Downloading';
export const STATUS_SEED_WAITING = 'Seed waiting';
export const STATUS_SEEDING = 'Seeding';
export const STATUSES = [
  STATUS_STOPPED,
  STATUS_CHECK_WAITING,
  STATUS_CHECKING,
  STATUS_DOWNLOAD_WAITING,
  STATUS_DOWNLOADING,
  STATUS_SEED_WAITING,
  STATUS_SEEDING,
];

let transmission;

export default class Transmission {
  _authHeader = null;

  _tokenHeader = null;

  _url = '../rpc';

  constructor() {
    if (transmission) {
      return transmission;
    }

    if (__TRANSMISSION_HOST__) {
      const protocol = __TRANSMISSION_SSL__ ? 'https:' : 'http:';
      this._url = `${protocol}//${__TRANSMISSION_HOST__}:${__TRANSMISSION_PORT__}${__TRANSMISSION_PATH__}`;
    }

    if (__TRANSMISSION_USERNAME__) {
      this._authHeader = `Basic ${window.btoa(
        __TRANSMISSION_USERNAME__ +
          (__TRANSMISSION_PASSWORD__ ? `:${__TRANSMISSION_PASSWORD__}` : '')
      )}`;
    }

    transmission = this;
  }

  async setToken() {
    if (this._tokenHeader) return;
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    if (this._authHeader) {
      headers.append('authorization', this._authHeader);
    }

    const response = await fetch(this._url, {
      method: 'post',
      headers,
    });
    this._tokenHeader = response.headers.get('X-Transmission-Session-Id');
  }

  async rpcCall(method, args = {}) {
    const body = {
      arguments: args,
      method,
    };
    await this.setToken();
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append(TOKEN_HEADER, this._tokenHeader);
    if (this._authHeader) {
      headers.append('authorization', this._authHeader);
    }

    try {
      const response = await fetch(this._url, {
        method: 'post',
        body: JSON.stringify(body),
        credentials: this._authHeader ? undefined : 'include',
        headers,
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    } catch (e) {
      this._tokenHeader = null;
      throw new Error(`[Transmission] ${e.message}`);
    }
  }

  getSession(fields) {
    return this.rpcCall('session-get', { fields }).then(
      (response) => response.arguments
    );
  }

  setSession(data) {
    return this.rpcCall('session-set', data);
  }

  updateBlocklist(data) {
    return this.rpcCall('blocklist-update', data).then(
      (response) => response.arguments['blocklist-size']
    );
  }

  getPortTest() {
    return this.rpcCall('port-test').then(
      (response) => response.arguments['port-is-open']
    );
  }

  getTorrents(ids, fields) {
    return this.rpcCall('torrent-get', {
      ids,
      fields,
    }).then((response) => response.arguments.torrents);
  }

  setTorrents(ids, data) {
    return this.rpcCall('torrent-set', { ...data, ids });
  }

  setTorrentsLocation(ids, location, move) {
    return this.rpcCall('torrent-set-location', { ids, location, move });
  }

  startTorrents(ids = []) {
    return this.rpcCall('torrent-start', { ids });
  }

  stopTorrents(ids) {
    return this.rpcCall('torrent-stop', { ids });
  }

  verifyTorrents(ids) {
    return this.rpcCall('torrent-verify', { ids });
  }

  reannounceTorrents(ids) {
    return this.rpcCall('torrent-reannounce', { ids });
  }

  getStats() {
    return this.rpcCall('session-stats').then((response) => response.arguments);
  }

  addTorrent({ filename, metainfo, ...other }) {
    if (!filename && !metainfo) {
      throw new Error('Filename or metainfo is required.');
    }
    return this.rpcCall('torrent-add', { filename, metainfo, ...other });
  }

  removeTorrents({ ids, deleteLocalData = false }) {
    if (!ids || !ids.length) {
      throw new Error('At least one id is required.');
    }
    return this.rpcCall('torrent-remove', {
      ids,
      'delete-local-data': deleteLocalData,
    });
  }
}
