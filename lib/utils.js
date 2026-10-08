'use strict';

/**
 * Settles a promise into a Node-style callback when one is given.
 * Without a callback the promise is returned untouched.
 *
 * The callback runs outside of the promise chain, so an exception thrown
 * inside it is not swallowed as a rejection.
 *
 * @param {Promise} promise
 * @param {Function} [callback] <code>(err, data)</code>
 * @returns {Promise|undefined}
 */
exports.callbackify = function callbackify(promise, callback) {
  if (typeof callback !== 'function') {
    return promise;
  }

  promise.then(
    data => setImmediate(callback, null, data),
    err => setImmediate(callback, err)
  );
};


/**
 * Runs an async function on each item, one at a time (the API is rate
 * limited, so bulk operations without a bulk endpoint are not parallel).
 *
 * @param {Array} items
 * @param {Function} fn <code>item => Promise</code>
 * @returns {Promise<Array>} Results, in order
 */
exports.sequence = async function sequence(items, fn) {
  const results = [];
  for (const item of items) {
    results.push(await fn(item));
  }
  return results;
};


/**
 * Handles an optional argument that comes right before the callback:
 * <code>fn(options, callback)</code> may be called as <code>fn(callback)</code>.
 *
 * @param {*} value Optional argument
 * @param {Function} [callback]
 * @param {*} [fallback] Value used when the argument is omitted
 * @returns {Array} <code>[value, callback]</code>
 */
exports.optional = function optional(value, callback, fallback) {
  if (typeof value === 'function') {
    return [fallback, value];
  }
  return [value === undefined ? fallback : value, callback];
};


/**
 * Tagged template that URL-encodes every interpolated path segment.
 * Arrays become comma separated lists, which is how the API takes bulk IDs.
 *
 * @example path`workspaces/${wid}/time_entries/${[1, 2]}` // workspaces/1/time_entries/1,2
 * @returns {String}
 */
exports.path = function path(strings, ...values) {
  return strings.reduce((result, string, i) => {
    if (i === 0) {
      return string;
    }
    return result + encodeSegment(values[i - 1]) + string;
  }, '');
};


function encodeSegment(value) {
  if (Array.isArray(value)) {
    return value.map(v => encodeURIComponent(String(v))).join(',');
  }
  if (value === undefined || value === null || value === '') {
    throw new TypeError('Missing a required ID in the request path');
  }
  return encodeURIComponent(String(value));
}


/**
 * Builds a query string, skipping undefined and null values.
 * Arrays are comma separated and Dates become ISO 8601 strings.
 *
 * @param {Object} [qs]
 * @returns {String} Query string including the leading <code>?</code>, or an empty string
 */
exports.queryString = function queryString(qs) {
  if (!qs) {
    return '';
  }

  const params = new URLSearchParams();

  Object.keys(qs).forEach(key => {
    const value = qs[key];
    if (value === undefined || value === null) {
      return;
    }
    params.append(key, Array.isArray(value)
      ? value.map(serialize).join(',')
      : serialize(value));
  });

  const result = params.toString();
  return result ? '?' + result : '';
};


function serialize(value) {
  return value instanceof Date ? value.toISOString() : String(value);
}


/**
 * Joins a base URL and a relative path with exactly one slash.
 *
 * @param {String} base
 * @param {String} path
 * @returns {String}
 */
exports.joinUrl = function joinUrl(base, path) {
  return base.replace(/\/+$/, '') + '/' + String(path).replace(/^\/+/, '');
};


/**
 * Parses a response body: JSON when possible, the raw text otherwise,
 * undefined when empty.
 *
 * @param {String} text
 * @returns {*}
 */
exports.parseBody = function parseBody(text) {
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};
