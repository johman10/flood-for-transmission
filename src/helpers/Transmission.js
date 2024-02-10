const SESSION_TOKEN_HEADER = 'X-Transmission-Session-Id';

let transmission;

export default class Transmission {
  _authorizationHeader = null;
  _sessionToken = null;
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
      this._authorizationHeader = `Basic ${window.btoa(
        __TRANSMISSION_USERNAME__ +
          (__TRANSMISSION_PASSWORD__ ? `:${__TRANSMISSION_PASSWORD__}` : '')
      )}`;
    }

    transmission = this;
  }

  request(method, args) {
    const body = {
      method,
      arguments: args,
    };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (this._sessionToken) {
      headers.append(SESSION_TOKEN_HEADER, this._sessionToken);
    }
    if (this._authorizationHeader) {
      headers.append('Authorization', this._authorizationHeader);
    }

    return fetch(this._url, {
      method: 'POST',
      body: JSON.stringify(body),
      credentials: this._authorizationHeader ? undefined : 'include',
      headers,
    });
  }

  readToken(response) {
    if (!response.headers.has(SESSION_TOKEN_HEADER)) return;

    this._sessionToken = response.headers.get(SESSION_TOKEN_HEADER);
  }

  async rpcCall(method, args) {
    if (!this._sessionToken) {
      const response = await this.request('');
      this.readToken(response);
    }

    const response = await this.request(method, args);

    // Invalid token
    if (response.status === 409) {
      this.readToken(response);
      return;
    }

    if (!response.ok) {
      throw Error(response.statusText);
    }

    const output = await response.json();
    if (output?.result !== 'success') {
      throw Error(output);
    }

    return output;
  }

  getSession(fields) {
    return this.rpcCall('session-get', { fields }).then(
      (response) => response?.arguments
    );
  }

  setSession(data) {
    return this.rpcCall('session-set', data);
  }

  getSessionStats() {
    return this.rpcCall('session-stats').then(
      (response) => response?.arguments
    );
  }

  updateBlocklist(data) {
    return this.rpcCall('blocklist-update', data).then(
      (response) => response?.arguments?.['blocklist-size']
    );
  }

  getPortTest() {
    return this.rpcCall('port-test').then(
      (response) => response?.arguments?.['port-is-open']
    );
  }

  getTorrents(ids, fields) {
    return this.rpcCall('torrent-get', {
      ids,
      fields,
    }).then((response) => {
      if (ids === 'recently-active') {
        return response?.arguments;
      }
      return response?.arguments?.torrents;
    });
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

  startNowTorrents(ids = []) {
    return this.rpcCall('torrent-start-now', { ids });
  }

  stopTorrents(ids) {
    return this.rpcCall('torrent-stop', { ids });
  }

  renamePath(ids, path, name) {
    return this.rpcCall('torrent-rename-path', { ids, path, name });
  }

  verifyTorrents(ids) {
    return this.rpcCall('torrent-verify', { ids });
  }

  reannounceTorrents(ids) {
    return this.rpcCall('torrent-reannounce', { ids });
  }

  getStats() {
    return this.rpcCall('session-stats').then(
      (response) => response?.arguments
    );
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

  getFreeSpace(path) {
    if (!path) {
      throw new Error('Path is required.');
    }

    return this.rpcCall('free-space', { path });
  }
}
