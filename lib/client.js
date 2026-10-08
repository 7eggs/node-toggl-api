'use strict';

const errors = require('./errors');
const utils = require('./utils');
const APIError = errors.APIError;
const ReportError = errors.ReportError;

const VERSION = require('../package.json').version;
let DEFAULT_INSTANCE = null;
const DEFAULTS = {
  apiUrl: 'https://api.track.toggl.com/api/v9/',
  reportsUrl: 'https://api.track.toggl.com/reports/api/v3/',
  accountsUrl: 'https://accounts.toggl.com/api/'
};


module.exports = TogglClient;


/**
 * @constructor
 * @param {Object} [options] Client options
 * @param {String} [options.apiToken] API token (preferred way to authenticate)
 * @param {String} [options.username] E-mail, used with <code>password</code> when there is no API token
 * @param {String} [options.password] Password
 * @param {String} [options.apiUrl] Track API v9 base URL
 * @param {String} [options.reportsUrl] Reports API v3 base URL
 * @param {String} [options.accountsUrl] Accounts API base URL, used to sign up
 * @param {Number} [options.timeout] Request timeout in milliseconds
 * @param {Function} [options.fetch] Custom <code>fetch</code> implementation (defaults to the global one)
 */
function TogglClient(options) {
  /** @private */
  this.options = Object.assign({}, DEFAULTS, options);

  /** @public */
  this.authData = null;
}


/**
 * @public
 * @static
 */
TogglClient.USER_AGENT = 'node-toggl-api v' + VERSION;


/**
 * @public
 * @static
 * @returns {TogglClient}
 */
TogglClient.defaultClient = function defaultClient() {
  if (!DEFAULT_INSTANCE) {
    DEFAULT_INSTANCE = new TogglClient();
  }

  return DEFAULT_INSTANCE;
};


/**
 * @public
 * @static
 * @param {Object} newDefaults
 */
TogglClient.setDefaults = function setDefaults(newDefaults) {
  Object.assign(DEFAULTS, newDefaults);
};


TogglClient.APIError = APIError;
TogglClient.ReportError = ReportError;


/**
 * Sends a request to the Track API v9.
 *
 * @public
 * @param {String} path API path, relative to <code>apiUrl</code>
 * @param {Object} [opts] Request options
 * @param {String} [opts.method] HTTP method, GET by default
 * @param {Object} [opts.qs] Query string parameters
 * @param {*} [opts.body] JSON body
 * @param {Boolean} [opts.noauth] Do not send credentials
 * @param {Function} [callback] <code>(err, data)</code>
 * @returns {Promise|undefined} Promise when no callback is given
 */
TogglClient.prototype.apiRequest = function apiRequest(path, opts, callback) {
  [opts, callback] = utils.optional(opts, callback, {});

  const url = utils.joinUrl(this.options.apiUrl, path);
  return utils.callbackify(this.request(url, opts, APIError), callback);
};


/**
 * Sends a request to the Reports API v3.
 *
 * @public
 * @param {String} path API path, relative to <code>reportsUrl</code>
 * @param {Object} [opts] Request options, same as {@link TogglClient#apiRequest}
 * @param {Function} [callback] <code>(err, data)</code>
 * @returns {Promise|undefined} Promise when no callback is given
 */
TogglClient.prototype.reportsRequest = function reportsRequest(path, opts,
  callback) {
  [opts, callback] = utils.optional(opts, callback, {});

  const url = utils.joinUrl(this.options.reportsUrl, path);
  return utils.callbackify(this.request(url, opts, ReportError), callback);
};


/**
 * @private
 * @param {String} url Absolute URL, without query string
 * @param {Object} opts Request options, see {@link TogglClient#apiRequest}
 * @param {Boolean} [opts.raw] Resolve with <code>{data, headers, status}</code> instead of the data
 * @param {Boolean} [opts.binary] Resolve with a Buffer instead of parsed JSON
 * @param {Function} ErrorClass Error to reject with on non 2xx responses
 * @returns {Promise}
 */
TogglClient.prototype.request = async function request(url, opts, ErrorClass) {
  const options = this.options;
  const headers = {
    'User-Agent': TogglClient.USER_AGENT,
    Accept: opts.binary ? '*/*' : 'application/json'
  };

  if (!opts.noauth) {
    const authorization = this.authorizationHeader();
    if (!authorization) {
      throw new Error('No credentials: create the client with an apiToken, ' +
        'or a username and password');
    }
    headers.Authorization = authorization;
  }

  const init = {
    method: opts.method || 'GET',
    headers: headers
  };

  if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(opts.body);
  }

  if (options.timeout) {
    init.signal = AbortSignal.timeout(options.timeout);
  }

  const fetchFn = options.fetch || fetch;
  const response = await fetchFn(url + utils.queryString(opts.qs), init);

  let data;
  if (opts.binary && response.ok) {
    data = Buffer.from(await response.arrayBuffer());
  }
  else {
    data = utils.parseBody(await response.text());
  }

  if (!response.ok) {
    throw new ErrorClass(response.status, data);
  }

  if (opts.raw) {
    return { data: data, headers: response.headers, status: response.status };
  }

  return data;
};


/**
 * @private
 * @returns {String|null} Value of the Authorization header
 */
TogglClient.prototype.authorizationHeader = function authorizationHeader() {
  const options = this.options;
  let credentials;

  if (options.apiToken) {
    credentials = options.apiToken + ':api_token';
  }
  else if (options.username && options.password) {
    credentials = options.username + ':' + options.password;
  }
  else {
    return null;
  }

  return 'Basic ' + Buffer.from(credentials).toString('base64');
};


/**
 * Checks the credentials by loading the current user. The user data is kept
 * in <code>authData</code>.
 *
 * Calling it is optional: every request sends the credentials (HTTP Basic auth).
 *
 * @see https://engineering.toggl.com/docs/track/authentication
 * @public
 * @param {Function} [callback] <code>(err, userData)</code>
 * @returns {Promise|undefined} Promise when no callback is given
 */
TogglClient.prototype.authenticate = function authenticate(callback) {
  const url = utils.joinUrl(this.options.apiUrl, 'me');
  const promise = this.request(url, {}, APIError).then(data => {
    this.authData = data;
    return data;
  });

  return utils.callbackify(promise, callback);
};


/**
 * Kept for backwards compatibility: the client holds no timers or sockets
 * anymore, so there is nothing to clean up.
 *
 * @public
 */
TogglClient.prototype.destroy = function destroy() {
};


require('./api/reports');
require('./api/user');
require('./api/clients');
require('./api/dashboard');
require('./api/projects');
require('./api/project_users');
require('./api/tags');
require('./api/tasks');
require('./api/time_entries');
require('./api/invitations');
require('./api/workspaces');
require('./api/workspace_users');
