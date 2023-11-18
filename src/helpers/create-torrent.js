(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CreateTorrent = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = exports.decode = void 0;
/*
 * base64-arraybuffer 1.0.2 <https://github.com/niklasvh/base64-arraybuffer>
 * Copyright (c) 2022 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 */
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Use a lookup table to find the index.
var lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
for (var i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}
var encode = function (arraybuffer) {
  var bytes = new Uint8Array(arraybuffer),
    i,
    len = bytes.length,
    base64 = '';
  for (i = 0; i < len; i += 3) {
    base64 += chars[bytes[i] >> 2];
    base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
    base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
    base64 += chars[bytes[i + 2] & 63];
  }
  if (len % 3 === 2) {
    base64 = base64.substring(0, base64.length - 1) + '=';
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + '==';
  }
  return base64;
};
exports.encode = encode;
var decode = function (base64) {
  var bufferLength = base64.length * 0.75,
    len = base64.length,
    i,
    p = 0,
    encoded1,
    encoded2,
    encoded3,
    encoded4;
  if (base64[base64.length - 1] === '=') {
    bufferLength--;
    if (base64[base64.length - 2] === '=') {
      bufferLength--;
    }
  }
  var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);
  for (i = 0; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)];
    encoded2 = lookup[base64.charCodeAt(i + 1)];
    encoded3 = lookup[base64.charCodeAt(i + 2)];
    encoded4 = lookup[base64.charCodeAt(i + 3)];
    bytes[p++] = encoded1 << 2 | encoded2 >> 4;
    bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
    bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
  }
  return arraybuffer;
};
exports.decode = decode;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _encode = _interopRequireDefault(require("./lib/encode.js"));
var _decode = _interopRequireDefault(require("./lib/decode.js"));
var _encodingLength = _interopRequireDefault(require("./lib/encoding-length.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Determines the amount of bytes
 * needed to encode the given value
 * @param  {Object|Array|Uint8Array|String|Number|Boolean} value
 * @return {Number} byteCount
 */
const encodingLength = _encodingLength.default;
var _default = exports.default = {
  encode: _encode.default,
  decode: _decode.default,
  byteLength: _encodingLength.default,
  encodingLength
};

},{"./lib/decode.js":3,"./lib/encode.js":4,"./lib/encoding-length.js":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _uint8Util = require("uint8-util");
const INTEGER_START = 0x69; // 'i'
const STRING_DELIM = 0x3A; // ':'
const DICTIONARY_START = 0x64; // 'd'
const LIST_START = 0x6C; // 'l'
const END_OF_TYPE = 0x65; // 'e'

/**
 * replaces parseInt(buffer.toString('ascii', start, end)).
 * For strings with less then ~30 charachters, this is actually a lot faster.
 *
 * @param {Uint8Array} data
 * @param {Number} start
 * @param {Number} end
 * @return {Number} calculated number
 */
function getIntFromBuffer(buffer, start, end) {
  let sum = 0;
  let sign = 1;
  for (let i = start; i < end; i++) {
    const num = buffer[i];
    if (num < 58 && num >= 48) {
      sum = sum * 10 + (num - 48);
      continue;
    }
    if (i === start && num === 43) {
      // +
      continue;
    }
    if (i === start && num === 45) {
      // -
      sign = -1;
      continue;
    }
    if (num === 46) {
      // .
      // its a float. break here.
      break;
    }
    throw new Error('not a number: buffer[' + i + '] = ' + num);
  }
  return sum * sign;
}

/**
 * Decodes bencoded data.
 *
 * @param  {Uint8Array} data
 * @param  {Number} start (optional)
 * @param  {Number} end (optional)
 * @param  {String} encoding (optional)
 * @return {Object|Array|Uint8Array|String|Number}
 */
function decode(data, start, end, encoding) {
  if (data == null || data.length === 0) {
    return null;
  }
  if (typeof start !== 'number' && encoding == null) {
    encoding = start;
    start = undefined;
  }
  if (typeof end !== 'number' && encoding == null) {
    encoding = end;
    end = undefined;
  }
  decode.position = 0;
  decode.encoding = encoding || null;
  decode.data = !ArrayBuffer.isView(data) ? (0, _uint8Util.text2arr)(data) : new Uint8Array(data.slice(start, end));
  decode.bytes = decode.data.length;
  return decode.next();
}
decode.bytes = 0;
decode.position = 0;
decode.data = null;
decode.encoding = null;
decode.next = function () {
  switch (decode.data[decode.position]) {
    case DICTIONARY_START:
      return decode.dictionary();
    case LIST_START:
      return decode.list();
    case INTEGER_START:
      return decode.integer();
    default:
      return decode.buffer();
  }
};
decode.find = function (chr) {
  let i = decode.position;
  const c = decode.data.length;
  const d = decode.data;
  while (i < c) {
    if (d[i] === chr) return i;
    i++;
  }
  throw new Error('Invalid data: Missing delimiter "' + String.fromCharCode(chr) + '" [0x' + chr.toString(16) + ']');
};
decode.dictionary = function () {
  decode.position++;
  const dict = {};
  while (decode.data[decode.position] !== END_OF_TYPE) {
    const buffer = decode.buffer();
    let key = (0, _uint8Util.arr2text)(buffer);
    if (key.includes('\uFFFD')) key = (0, _uint8Util.arr2hex)(buffer);
    dict[key] = decode.next();
  }
  decode.position++;
  return dict;
};
decode.list = function () {
  decode.position++;
  const lst = [];
  while (decode.data[decode.position] !== END_OF_TYPE) {
    lst.push(decode.next());
  }
  decode.position++;
  return lst;
};
decode.integer = function () {
  const end = decode.find(END_OF_TYPE);
  const number = getIntFromBuffer(decode.data, decode.position + 1, end);
  decode.position += end + 1 - decode.position;
  return number;
};
decode.buffer = function () {
  let sep = decode.find(STRING_DELIM);
  const length = getIntFromBuffer(decode.data, decode.position, sep);
  const end = ++sep + length;
  decode.position = end;
  return decode.encoding ? (0, _uint8Util.arr2text)(decode.data.slice(sep, end)) : decode.data.slice(sep, end);
};
var _default = exports.default = decode;

},{"uint8-util":17}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _uint8Util = require("uint8-util");
var _util = require("./util.js");
/**
 * Encodes data in bencode.
 *
 * @param  {Uint8Array|Array|String|Object|Number|Boolean} data
 * @return {Uint8Array}
 */
function encode(data, buffer, offset) {
  const buffers = [];
  let result = null;
  encode._encode(buffers, data);
  result = (0, _uint8Util.concat)(buffers);
  encode.bytes = result.length;
  if (ArrayBuffer.isView(buffer)) {
    buffer.set(result, offset);
    return buffer;
  }
  return result;
}
encode.bytes = -1;
encode._floatConversionDetected = false;
encode._encode = function (buffers, data) {
  if (data == null) {
    return;
  }
  switch ((0, _util.getType)(data)) {
    case 'object':
      encode.dict(buffers, data);
      break;
    case 'map':
      encode.dictMap(buffers, data);
      break;
    case 'array':
      encode.list(buffers, data);
      break;
    case 'set':
      encode.listSet(buffers, data);
      break;
    case 'string':
      encode.string(buffers, data);
      break;
    case 'number':
      encode.number(buffers, data);
      break;
    case 'boolean':
      encode.number(buffers, data);
      break;
    case 'arraybufferview':
      encode.buffer(buffers, new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
      break;
    case 'arraybuffer':
      encode.buffer(buffers, new Uint8Array(data));
      break;
  }
};
const buffE = new Uint8Array([0x65]);
const buffD = new Uint8Array([0x64]);
const buffL = new Uint8Array([0x6C]);
encode.buffer = function (buffers, data) {
  buffers.push((0, _uint8Util.text2arr)(data.length + ':'), data);
};
encode.string = function (buffers, data) {
  buffers.push((0, _uint8Util.text2arr)((0, _uint8Util.text2arr)(data).byteLength + ':' + data));
};
encode.number = function (buffers, data) {
  if (Number.isInteger(data)) return buffers.push((0, _uint8Util.text2arr)('i' + BigInt(data) + 'e'));
  const maxLo = 0x80000000;
  const hi = data / maxLo << 0;
  const lo = data % maxLo << 0;
  const val = hi * maxLo + lo;
  buffers.push((0, _uint8Util.text2arr)('i' + val + 'e'));
  if (val !== data && !encode._floatConversionDetected) {
    encode._floatConversionDetected = true;
    console.warn('WARNING: Possible data corruption detected with value "' + data + '":', 'Bencoding only defines support for integers, value was converted to "' + val + '"');
    console.trace();
  }
};
encode.dict = function (buffers, data) {
  buffers.push(buffD);
  let j = 0;
  let k;
  // fix for issue #13 - sorted dicts
  const keys = Object.keys(data).sort();
  const kl = keys.length;
  for (; j < kl; j++) {
    k = keys[j];
    if (data[k] == null) continue;
    encode.string(buffers, k);
    encode._encode(buffers, data[k]);
  }
  buffers.push(buffE);
};
encode.dictMap = function (buffers, data) {
  buffers.push(buffD);
  const keys = Array.from(data.keys()).sort();
  for (const key of keys) {
    if (data.get(key) == null) continue;
    ArrayBuffer.isView(key) ? encode._encode(buffers, key) : encode.string(buffers, String(key));
    encode._encode(buffers, data.get(key));
  }
  buffers.push(buffE);
};
encode.list = function (buffers, data) {
  let i = 0;
  const c = data.length;
  buffers.push(buffL);
  for (; i < c; i++) {
    if (data[i] == null) continue;
    encode._encode(buffers, data[i]);
  }
  buffers.push(buffE);
};
encode.listSet = function (buffers, data) {
  buffers.push(buffL);
  for (const item of data) {
    if (item == null) continue;
    encode._encode(buffers, item);
  }
  buffers.push(buffE);
};
var _default = exports.default = encode;

},{"./util.js":6,"uint8-util":17}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _uint8Util = require("uint8-util");
var _util = require("./util.js");
function listLength(list) {
  let length = 1 + 1; // type marker + end-of-type marker

  for (const value of list) {
    length += encodingLength(value);
  }
  return length;
}
function mapLength(map) {
  let length = 1 + 1; // type marker + end-of-type marker

  for (const [key, value] of map) {
    const keyLength = (0, _uint8Util.text2arr)(key).byteLength;
    length += (0, _util.digitCount)(keyLength) + 1 + keyLength;
    length += encodingLength(value);
  }
  return length;
}
function objectLength(value) {
  let length = 1 + 1; // type marker + end-of-type marker
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i++) {
    const keyLength = (0, _uint8Util.text2arr)(keys[i]).byteLength;
    length += (0, _util.digitCount)(keyLength) + 1 + keyLength;
    length += encodingLength(value[keys[i]]);
  }
  return length;
}
function stringLength(value) {
  const length = (0, _uint8Util.text2arr)(value).byteLength;
  return (0, _util.digitCount)(length) + 1 + length;
}
function arrayBufferLength(value) {
  const length = value.byteLength - value.byteOffset;
  return (0, _util.digitCount)(length) + 1 + length;
}
function encodingLength(value) {
  const length = 0;
  if (value == null) return length;
  const type = (0, _util.getType)(value);
  switch (type) {
    case 'arraybufferview':
      return arrayBufferLength(value);
    case 'string':
      return stringLength(value);
    case 'array':
    case 'set':
      return listLength(value);
    case 'number':
      return 1 + (0, _util.digitCount)(Math.floor(value)) + 1;
    case 'bigint':
      return 1 + value.toString().length + 1;
    case 'object':
      return objectLength(value);
    case 'map':
      return mapLength(value);
    default:
      throw new TypeError(`Unsupported value of type "${type}"`);
  }
}
var _default = exports.default = encodingLength;

},{"./util.js":6,"uint8-util":17}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.digitCount = digitCount;
exports.getType = getType;
function digitCount(value) {
  // Add a digit for negative numbers, as the sign will be prefixed
  const sign = value < 0 ? 1 : 0;
  // Guard against negative numbers & zero going into log10(),
  // as that would return -Infinity
  value = Math.abs(Number(value || 1));
  return Math.floor(Math.log10(value)) + 1 + sign;
}
function getType(value) {
  if (ArrayBuffer.isView(value)) return 'arraybufferview';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Number) return 'number';
  if (value instanceof Boolean) return 'boolean';
  if (value instanceof Set) return 'set';
  if (value instanceof Map) return 'map';
  if (value instanceof String) return 'string';
  if (value instanceof ArrayBuffer) return 'arraybuffer';
  return typeof value;
}

},{}],7:[function(require,module,exports){
function concat (chunks, size) {
  if (typeof chunks[0] === 'string') return chunks.join('')
  if (typeof chunks[0] === 'number') return new Uint8Array(chunks)
  const b = new Uint8Array(size)
  let offset = 0
  for (let i = 0, l = chunks.length; i < l; i++) {
    const chunk = chunks[i]
    b.set(chunk, offset)
    offset += chunk.byteLength || chunk.length
  }

  return b
}

module.exports = async function * (iterator, size = 512, opts = {}) {
  if (typeof size === 'object') {
    opts = size
    size = opts.size
  }
  let { nopad, zeroPadding = true } = opts

  if (nopad) zeroPadding = false

  let buffered = []
  let bufferedBytes = 0

  for await (const value of iterator) {
    bufferedBytes += value.byteLength || value.length || 1
    buffered.push(value)

    if (bufferedBytes >= size) {
      const b = concat(buffered, bufferedBytes)
      let offset = 0

      while (bufferedBytes >= size) {
        yield b.slice(offset, offset + size)
        bufferedBytes -= size
        offset += size
      }

      buffered = [b.slice(offset, b.length)]
    }
  }
  if (bufferedBytes) yield concat(buffered, zeroPadding ? size : bufferedBytes)
}

},{}],8:[function(require,module,exports){

},{}],9:[function(require,module,exports){
if (typeof ReadableStream !== 'undefined' && !ReadableStream.prototype[Symbol.asyncIterator]) {
  ReadableStream.prototype[Symbol.asyncIterator] = function () {
    const reader = this.getReader()
    let last = reader.read()
    return {
      next () {
        const temp = last
        last = reader.read()
        return temp
      },
      return () {
        last.then(() => reader.releaseLock())
      },
      throw (err) {
        this.return()
        throw err
      },
      [Symbol.asyncIterator] () {
        return this
      }
    }
  }
}

},{}],10:[function(require,module,exports){
module.exports = async function * (iterators) {
  for (let iterator of iterators) {
    // can be lazy functions returning streams
    if (typeof iterator === 'function') iterator = iterator()
    yield * iterator
  }
}

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isJunk = isJunk;
exports.isNotJunk = isNotJunk;
exports.junkRegex = void 0;
const ignoreList = [
// # All
'^npm-debug\\.log$',
// Error log for npm
'^\\..*\\.swp$',
// Swap file for vim state

// # macOS
'^\\.DS_Store$',
// Stores custom folder attributes
'^\\.AppleDouble$',
// Stores additional file resources
'^\\.LSOverride$',
// Contains the absolute path to the app to be used
'^Icon\\r$',
// Custom Finder icon: http://superuser.com/questions/298785/icon-file-on-os-x-desktop
'^\\._.*',
// Thumbnail
'^\\.Spotlight-V100(?:$|\\/)',
// Directory that might appear on external disk
'\\.Trashes',
// File that might appear on external disk
'^__MACOSX$',
// Resource fork

// # Linux
'~$',
// Backup file

// # Windows
'^Thumbs\\.db$',
// Image file cache
'^ehthumbs\\.db$',
// Folder config file
'^[Dd]esktop\\.ini$',
// Stores custom folder attributes
'@eaDir$' // Synology Diskstation "hidden" folder where the server stores thumbnails
];

const junkRegex = exports.junkRegex = new RegExp(ignoreList.join('|'));
function isJunk(filename) {
  return junkRegex.test(filename);
}
function isNotJunk(filename) {
  return !isJunk(filename);
}

},{}],12:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":14}],13:[function(require,module,exports){
module.exports = length

function length (bytes) {
  return Math.max(16384, 1 << Math.log2(bytes < 1024 ? 1 : bytes / 1024) + 0.5 | 0)
}

},{}],14:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],15:[function(require,module,exports){
(function (global){(function (){
/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
let promise

module.exports = typeof queueMicrotask === 'function'
  ? queueMicrotask.bind(typeof window !== 'undefined' ? window : global)
  // reuse resolved promise, and allocate it lazily
  : cb => (promise || (promise = Promise.resolve()))
    .then(cb)
    .catch(err => setTimeout(() => { throw err }, 0))

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
/*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
module.exports = runParallel

const queueMicrotask = require('queue-microtask')

function runParallel (tasks, cb) {
  let results, pending, keys
  let isSync = true

  if (Array.isArray(tasks)) {
    results = []
    pending = tasks.length
  } else {
    keys = Object.keys(tasks)
    results = {}
    pending = keys.length
  }

  function done (err) {
    function end () {
      if (cb) cb(err, results)
      cb = null
    }
    if (isSync) queueMicrotask(end)
    else end()
  }

  function each (i, err, result) {
    results[i] = result
    if (--pending === 0 || err) {
      done(err)
    }
  }

  if (!pending) {
    // empty
    done(null)
  } else if (keys) {
    // object
    keys.forEach(function (key) {
      tasks[key](function (err, result) { each(key, err, result) })
    })
  } else {
    // array
    tasks.forEach(function (task, i) {
      task(function (err, result) { each(i, err, result) })
    })
  }

  isSync = false
}

},{"queue-microtask":15}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  arr2text: true,
  text2arr: true,
  arr2base: true,
  base2arr: true,
  bin2hex: true,
  hex2bin: true,
  hash: true,
  randomBytes: true
};
exports.text2arr = exports.randomBytes = exports.hex2bin = exports.hash = exports.bin2hex = exports.base2arr = exports.arr2text = exports.arr2base = void 0;
var _util = require("./util.js");
Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _util[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _util[key];
    }
  });
});
var _base64Arraybuffer = require("base64-arraybuffer");
const decoder = new TextDecoder();
// 50% slower at < 48 chars, but little impact at 4M OPS/s vs 8M OPS/s
const arr2text = (data, enc) => {
  if (!enc) return decoder.decode(data);
  const dec = new TextDecoder(enc);
  return dec.decode(data);
};

// sacrifice ~20% speed for bundle size
exports.arr2text = arr2text;
const encoder = new TextEncoder();
const text2arr = str => encoder.encode(str);
exports.text2arr = text2arr;
const arr2base = data => (0, _base64Arraybuffer.encode)(data);
exports.arr2base = arr2base;
const base2arr = str => new Uint8Array((0, _base64Arraybuffer.decode)(str));
exports.base2arr = base2arr;
const bin2hex = str => {
  let res = '';
  let c;
  let i = 0;
  const len = str.length;
  while (i < len) {
    c = str.charCodeAt(i++);
    res += _util.alphabet[c >> 4] + _util.alphabet[c & 0xF];
  }
  return res;
};
exports.bin2hex = bin2hex;
const MAX_ARGUMENTS_LENGTH = 0x10000;
const hex2bin = hex => {
  const points = (0, _util.hex2arr)(hex);
  if (points.length <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode(...points);
  let res = '';
  let i = 0;
  while (i < points.length) {
    res += String.fromCharCode(...points.subarray(i, i += MAX_ARGUMENTS_LENGTH));
  }
  return res;
};
exports.hex2bin = hex2bin;
const scope = typeof window !== 'undefined' ? window : self;
const crypto = scope.crypto || scope.msCrypto || {};
const subtle = crypto.subtle || crypto.webkitSubtle;
const formatMap = {
  hex: _util.arr2hex,
  base64: arr2base
};
const hash = async (data, format, algo = 'sha-1') => {
  if (!subtle) throw new Error('no web crypto support');
  if (typeof data === 'string') data = text2arr(data);
  const out = new Uint8Array(await subtle.digest(algo, data));
  return format ? formatMap[format](out) : out;
};
exports.hash = hash;
const randomBytes = size => {
  const view = new Uint8Array(size);
  return crypto.getRandomValues(view);
};
exports.randomBytes = randomBytes;

},{"./util.js":18,"base64-arraybuffer":1}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hex2arr = exports.equal = exports.concat = exports.arr2hex = exports.alphabet = void 0;
/* Common package for dealing with hex/string/uint8 conversions (and sha1 hashing)
*
* @author   Jimmy Wärting <jimmy@warting.se> (https://jimmy.warting.se/opensource)
* @license  MIT
*/
const alphabet = exports.alphabet = '0123456789abcdef';
const encodeLookup = [];
const decodeLookup = [];
for (let i = 0; i < 256; i++) {
  encodeLookup[i] = alphabet[i >> 4 & 0xf] + alphabet[i & 0xf];
  if (i < 16) {
    if (i < 10) {
      decodeLookup[0x30 + i] = i;
    } else {
      decodeLookup[0x61 - 10 + i] = i;
    }
  }
}
const arr2hex = data => {
  const length = data.length;
  let string = '';
  let i = 0;
  while (i < length) {
    string += encodeLookup[data[i++]];
  }
  return string;
};
exports.arr2hex = arr2hex;
const hex2arr = str => {
  const sizeof = str.length >> 1;
  const length = sizeof << 1;
  const array = new Uint8Array(sizeof);
  let n = 0;
  let i = 0;
  while (i < length) {
    array[n++] = decodeLookup[str.charCodeAt(i++)] << 4 | decodeLookup[str.charCodeAt(i++)];
  }
  return array;
};
exports.hex2arr = hex2arr;
const concat = (chunks, size = 0) => {
  const length = chunks.length || 0;
  if (!size) {
    let i = length;
    while (i--) size += chunks[i].length;
  }
  const b = new Uint8Array(size);
  let offset = size;
  let i = length;
  while (i--) {
    offset -= chunks[i].length;
    b.set(chunks[i], offset);
  }
  return b;
};
exports.concat = concat;
const equal = (a, b) => {
  if (a.length !== b.length) return false;
  for (let i = a.length; i > -1; i -= 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};
exports.equal = equal;

},{}],"create-torrent":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.announceList = void 0;
exports.isJunkPath = isJunkPath;
exports.parseInput = parseInput;
var _bencode = _interopRequireDefault(require("bencode"));
var _blockIterator = _interopRequireDefault(require("block-iterator"));
var _pieceLength = _interopRequireDefault(require("piece-length"));
var _isFile = _interopRequireDefault(require("is-file"));
var _junk = require("junk");
var _joinAsyncIterator = _interopRequireDefault(require("join-async-iterator"));
var _runParallel = _interopRequireDefault(require("run-parallel"));
var _queueMicrotask = _interopRequireDefault(require("queue-microtask"));
var _uint8Util = require("uint8-util");
require("fast-readable-async-iterator");
var _getFiles = _interopRequireDefault(require("./get-files.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*! create-torrent. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */
const corePath = require("path");
// browser exclude

const announceList = exports.announceList = [['udp://tracker.leechers-paradise.org:6969'], ['udp://tracker.coppersurfer.tk:6969'], ['udp://tracker.opentrackr.org:1337'], ['udp://explodie.org:6969'], ['udp://tracker.empire-js.us:1337'], ['wss://tracker.btorrent.xyz'], ['wss://tracker.openwebtorrent.com'], ['wss://tracker.webtorrent.dev']];

/**
 * Create a torrent.
 * @param  {string|File|FileList|Buffer|Stream|Array.<string|File|Buffer|Stream>} input
 * @param  {Object} opts
 * @param  {string=} opts.name
 * @param  {Date=} opts.creationDate
 * @param  {string=} opts.comment
 * @param  {string=} opts.createdBy
 * @param  {boolean|number=} opts.private
 * @param  {number=} opts.pieceLength
 * @param  {Array.<Array.<string>>=} opts.announceList
 * @param  {Array.<string>=} opts.urlList
 * @param  {Object=} opts.info
 * @param  {Function} opts.onProgress
 * @param  {function} cb
 * @return {Buffer} buffer of .torrent file data
 */
function createTorrent(input, opts, cb) {
  if (typeof opts === 'function') [opts, cb] = [cb, opts];
  opts = opts ? Object.assign({}, opts) : {};
  _parseInput(input, opts, (err, files, singleFileTorrent) => {
    if (err) return cb(err);
    opts.singleFileTorrent = singleFileTorrent;
    onFiles(files, opts, cb);
  });
}
function parseInput(input, opts, cb) {
  if (typeof opts === 'function') [opts, cb] = [cb, opts];
  opts = opts ? Object.assign({}, opts) : {};
  _parseInput(input, opts, cb);
}
const pathSymbol = Symbol('itemPath');

/**
 * Parse input file and return file information.
 */
function _parseInput(input, opts, cb) {
  if (isFileList(input)) input = Array.from(input);
  if (!Array.isArray(input)) input = [input];
  if (input.length === 0) throw new Error('invalid input type');
  input.forEach(item => {
    if (item == null) throw new Error(`invalid input type: ${item}`);
  });

  // In Electron, use the true file path
  input = input.map(item => {
    if (isBlob(item) && typeof item.path === 'string' && typeof _getFiles.default === 'function') return item.path;
    return item;
  });

  // If there's just one file, allow the name to be set by `opts.name`
  if (input.length === 1 && typeof input[0] !== 'string' && !input[0].name) input[0].name = opts.name;
  let commonPrefix = null;
  input.forEach((item, i) => {
    if (typeof item === 'string') {
      return;
    }
    let path = item.fullPath || item.name;
    if (!path) {
      path = `Unknown File ${i + 1}`;
      item.unknownName = true;
    }
    item[pathSymbol] = path.split('/');

    // Remove initial slash
    if (!item[pathSymbol][0]) {
      item[pathSymbol].shift();
    }
    if (item[pathSymbol].length < 2) {
      // No real prefix
      commonPrefix = null;
    } else if (i === 0 && input.length > 1) {
      // The first file has a prefix
      commonPrefix = item[pathSymbol][0];
    } else if (item[pathSymbol][0] !== commonPrefix) {
      // The prefix doesn't match
      commonPrefix = null;
    }
  });
  const filterJunkFiles = opts.filterJunkFiles === undefined ? true : opts.filterJunkFiles;
  if (filterJunkFiles) {
    // Remove junk files
    input = input.filter(item => {
      if (typeof item === 'string') {
        return true;
      }
      return !isJunkPath(item[pathSymbol]);
    });
  }
  if (commonPrefix) {
    input.forEach(item => {
      const pathless = (ArrayBuffer.isView(item) || isReadable(item)) && !item[pathSymbol];
      if (typeof item === 'string' || pathless) return;
      item[pathSymbol].shift();
    });
  }
  if (!opts.name && commonPrefix) {
    opts.name = commonPrefix;
  }
  if (!opts.name) {
    // use first user-set file name
    input.some(item => {
      if (typeof item === 'string') {
        opts.name = corePath.basename(item);
        return true;
      } else if (!item.unknownName) {
        opts.name = item[pathSymbol][item[pathSymbol].length - 1];
        return true;
      }
      return false;
    });
  }
  if (!opts.name) {
    opts.name = `Unnamed Torrent ${Date.now()}`;
  }
  const numPaths = input.reduce((sum, item) => sum + Number(typeof item === 'string'), 0);
  let isSingleFileTorrent = input.length === 1;
  if (input.length === 1 && typeof input[0] === 'string') {
    if (typeof _getFiles.default !== 'function') {
      throw new Error('filesystem paths do not work in the browser');
    }
    // If there's a single path, verify it's a file before deciding this is a single
    // file torrent
    (0, _isFile.default)(input[0], (err, pathIsFile) => {
      if (err) return cb(err);
      isSingleFileTorrent = pathIsFile;
      processInput();
    });
  } else {
    (0, _queueMicrotask.default)(processInput);
  }
  function processInput() {
    (0, _runParallel.default)(input.map(item => cb => {
      const file = {};
      if (isBlob(item)) {
        file.getStream = item.stream();
        file.length = item.size;
      } else if (ArrayBuffer.isView(item)) {
        file.getStream = [item]; // wrap in iterable to write entire buffer at once instead of unwrapping all bytes
        file.length = item.length;
      } else if (isReadable(item)) {
        file.getStream = getStreamStream(item, file);
        file.length = 0;
      } else if (typeof item === 'string') {
        if (typeof _getFiles.default !== 'function') {
          throw new Error('filesystem paths do not work in the browser');
        }
        const keepRoot = numPaths > 1 || isSingleFileTorrent;
        (0, _getFiles.default)(item, keepRoot, cb);
        return; // early return!
      } else {
        throw new Error('invalid input type');
      }
      file.path = item[pathSymbol];
      cb(null, file);
    }), (err, files) => {
      if (err) return cb(err);
      files = files.flat();
      cb(null, files, isSingleFileTorrent);
    });
  }
}
const MAX_OUTSTANDING_HASHES = 5;
async function getPieceList(files, pieceLength, estimatedTorrentLength, opts, cb) {
  const pieces = [];
  let length = 0;
  let hashedLength = 0;
  const streams = files.map(file => file.getStream);
  const onProgress = opts.onProgress;
  let remainingHashes = 0;
  let pieceNum = 0;
  let ended = false;
  const iterator = (0, _blockIterator.default)((0, _joinAsyncIterator.default)(streams), pieceLength, {
    zeroPadding: false
  });
  try {
    for await (const chunk of iterator) {
      await new Promise(resolve => {
        length += chunk.length;
        const i = pieceNum;
        ++pieceNum;
        if (++remainingHashes < MAX_OUTSTANDING_HASHES) resolve();
        (0, _uint8Util.hash)(chunk, 'hex').then(hash => {
          pieces[i] = hash;
          --remainingHashes;
          hashedLength += chunk.length;
          if (onProgress) onProgress(hashedLength, estimatedTorrentLength);
          resolve();
          if (ended && remainingHashes === 0) cb(null, (0, _uint8Util.hex2arr)(pieces.join('')), length);
        });
      });
    }
    if (remainingHashes === 0) return cb(null, (0, _uint8Util.hex2arr)(pieces.join('')), length);
    ended = true;
  } catch (err) {
    cb(err);
  }
}
function onFiles(files, opts, cb) {
  let _announceList = opts.announceList;
  if (!_announceList) {
    if (typeof opts.announce === 'string') _announceList = [[opts.announce]];else if (Array.isArray(opts.announce)) {
      _announceList = opts.announce.map(u => [u]);
    }
  }
  if (!_announceList) _announceList = [];
  if (globalThis.WEBTORRENT_ANNOUNCE) {
    if (typeof globalThis.WEBTORRENT_ANNOUNCE === 'string') {
      _announceList.push([[globalThis.WEBTORRENT_ANNOUNCE]]);
    } else if (Array.isArray(globalThis.WEBTORRENT_ANNOUNCE)) {
      _announceList = _announceList.concat(globalThis.WEBTORRENT_ANNOUNCE.map(u => [u]));
    }
  }

  // When no trackers specified, use some reasonable defaults
  if (opts.announce === undefined && opts.announceList === undefined) {
    _announceList = _announceList.concat(announceList);
  }
  if (typeof opts.urlList === 'string') opts.urlList = [opts.urlList];
  const torrent = {
    info: {
      name: opts.name
    },
    'creation date': Math.ceil((Number(opts.creationDate) || Date.now()) / 1000),
    encoding: 'UTF-8'
  };
  if (_announceList.length !== 0) {
    torrent.announce = _announceList[0][0];
    torrent['announce-list'] = _announceList;
  }
  if (opts.comment !== undefined) torrent.comment = opts.comment;
  if (opts.createdBy !== undefined) torrent['created by'] = opts.createdBy;
  if (opts.private !== undefined) torrent.info.private = Number(opts.private);
  if (opts.info !== undefined) Object.assign(torrent.info, opts.info);

  // "ssl-cert" key is for SSL torrents, see:
  //   - http://blog.libtorrent.org/2012/01/bittorrent-over-ssl/
  //   - http://www.libtorrent.org/manual-ref.html#ssl-torrents
  //   - http://www.libtorrent.org/reference-Create_Torrents.html
  if (opts.sslCert !== undefined) torrent.info['ssl-cert'] = opts.sslCert;
  if (opts.urlList !== undefined) torrent['url-list'] = opts.urlList;
  const estimatedTorrentLength = files.reduce(sumLength, 0);
  const pieceLength = opts.pieceLength || (0, _pieceLength.default)(estimatedTorrentLength);
  torrent.info['piece length'] = pieceLength;
  getPieceList(files, pieceLength, estimatedTorrentLength, opts, (err, pieces, torrentLength) => {
    if (err) return cb(err);
    torrent.info.pieces = pieces;
    files.forEach(file => {
      delete file.getStream;
    });
    if (opts.singleFileTorrent) {
      torrent.info.length = torrentLength;
    } else {
      torrent.info.files = files;
    }
    cb(null, _bencode.default.encode(torrent));
  });
}

/**
 * Determine if a a file is junk based on its path
 * (defined as hidden OR recognized by the `junk` package)
 *
 * @param  {string} path
 * @return {boolean}
 */
function isJunkPath(path) {
  const filename = path[path.length - 1];
  return filename[0] === '.' && (0, _junk.isJunk)(filename);
}

/**
 * Accumulator to sum file lengths
 * @param  {number} sum
 * @param  {Object} file
 * @return {number}
 */
function sumLength(sum, file) {
  return sum + file.length;
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
  return typeof Blob !== 'undefined' && obj instanceof Blob;
}

/**
 * Check if `obj` is a W3C `FileList` object
 * @param  {*} obj
 * @return {boolean}
 */
function isFileList(obj) {
  return typeof FileList !== 'undefined' && obj instanceof FileList;
}

/**
 * Check if `obj` is a node Readable stream
 * @param  {*} obj
 * @return {boolean}
 */
function isReadable(obj) {
  return typeof obj === 'object' && obj != null && typeof obj.pipe === 'function';
}

/**
 * Convert a readable stream to a lazy async iterator. Adds instrumentation to track
 * the number of bytes in the stream and set `file.length`.
 *
 * @generator
 * @param  {Stream} readable
 * @param  {Object} file
 * @return {Uint8Array} stream data/chunk
 */
async function* getStreamStream(readable, file) {
  for await (const chunk of readable) {
    file.length += chunk.length;
    yield chunk;
  }
}
var _default = exports.default = createTorrent;

},{"./get-files.js":8,"bencode":2,"block-iterator":7,"fast-readable-async-iterator":9,"is-file":8,"join-async-iterator":10,"junk":11,"path":12,"piece-length":13,"queue-microtask":15,"run-parallel":16,"uint8-util":17}]},{},[])("create-torrent")
});
