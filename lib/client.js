'use strict';

var assign = require('object-assign');
var errors = require('./errors');
var EventEmitter = require('events').EventEmitter;
var request = require('request');
var validate = require('./validator');
var APIError = errors.APIError;
var ReportError = errors.ReportError;

var VERSION = require('../package.json').version;
var DEFAULT_INSTANCE = null;
var DEFAULTS = {
  reauth: false,
  sessionCookie: 'toggl_api_session',
  apiUrl: 'https://api.track.toggl.com',
  reportsUrl: 'https://api.track.toggl.com/reports/api/v2'
};


module.exports = TogglClient;


/**
 * @constructor
 * @param {Object} [options] Client options
 */
function TogglClient(options) {
  /** @private */
  this.options = assign({}, DEFAULTS);

  if (options !== undefined) {
    assign(this.options, options);
    validateOptions(this.options);
  }

  this.emitter = new EventEmitter();
  this.emitter.setMaxListeners(0);

  /** @private */
  this.cookieJar = request.jar();

  /** @public */
  this.authData = null;

  /** @private */
  this.authTimeout = null;

  /** @private */
  this.authenticating = false;
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
  assign(DEFAULTS, newDefaults);
};


/**
 * @private
 * @param {String} path API path
 * @param {Object} opts Request options
 * @param {Function} callback <code>(err, data)</code>
 */
TogglClient.prototype.apiRequest = function apiRequest(path, opts, callback) {
  var self = this;
  var options = this.options;

  if (this.authenticating) {
    this.emitter.once('authenticate', function afterAuth(err) {
      if (err) {
        return callback(err);
      }

      self.apiRequest(path, opts, callback);
    });

    return;
  }
  else if (!opts.noauth && !options.apiToken && !this.authData) {
    return callback(new Error('Authenticate first'));
  }

  if (!opts.noauth) {
    if (options.apiToken) {
      opts.auth = {
        user: options.apiToken,
        pass: 'api_token'
      };
    }
    else {
      opts.jar = this.cookieJar;
    }
  }

  opts.url = options.apiUrl + path;
  opts.json = true;

  request(opts, onresponse);

  function onresponse(err, response, data) {
    if (err) {
      return callback(err);
    }

    var statusCode = response.statusCode;

    if (statusCode >= 200 && statusCode < 300) {
      callback(null, data);
    }
    else {
      callback(new APIError(statusCode, data));
    }
  }
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/authentication.md
 * @public
 * @param {Function} [callback] <code>(err, userData)</code>
 */
TogglClient.prototype.authenticate = function authenticate(callback) {
  var self = this;
  var options = this.options;
  var auth;
  var req = {};

  callback = callback || noop;

  if (options.username && options.password) {
    auth = {
      user: options.username,
      pass: options.password
    };
  }
  else {
    return callback(new Error('No need to authenticate thus you use apiToken'));
  }

  req.auth = auth;
  req.method = 'GET';

  this.apiRequest('/api/v8/me', req, done);
  this.authenticating = true;

  function done(err, data) {
    self.emitter.emit('authenticate', err, data);

    if (err) {
      return error(err);
    }

    self.authData = data;

    if (options.reauth) {
      self.cookieJar._jar.getCookies(options.apiUrl, oncookies);
    }
    else {
      success();
    }
  }

  function oncookies(err, cookies) {
    if (err) {
      error(err);
    }

    var sessionCookie = findCookieByKey(cookies, options.sessionCookie);
    var ttl = sessionCookie.ttl();

    if (ttl) {
      self.setAuthTimer(ttl);
    }

    success();
  }

  function success() {
    self.authenticating = false;
    self.emitter.emit('authenticate', null, self.authData);

    callback(null, self.authData);
  }

  function error(err) {
    self.authenticating = false;
    self.emitter.emit('authenticate', err);

    callback(err);
  }
};


/** @public */
TogglClient.prototype.destroy = function destroy() {
  if (this.authTimeout) {
    clearTimeout(this.authTimeout);
  }
};


function findCookieByKey(cookies, key) {
  var length = cookies.length;
  var i = 0;
  while (i < length) {
    if (cookies[i].key === key) {
      return cookies[i];
    }
    i++;
  }
  return null;
}


function noop() {
}


/**
 * @private
 * @param {String} path API path
 * @param {Object} opts Request options
 * @param {Function} callback <code>(err, data)</code>
 */
TogglClient.prototype.reportsRequest = function reportsRequest(path, opts,
  callback) {
  var options = this.options;

  if (!options.apiToken) {
    return callback(
      new Error('API token is not specified. Reports API can\'t be used.'));
  }

  opts.auth = {
    user: options.apiToken,
    pass: 'api_token'
  };
  opts.url = options.reportsUrl + path;
  opts.json = true;
  opts.qs = opts.qs || {};
  opts.qs.user_agent = TogglClient.USER_AGENT;

  request(opts, onresponse);

  function onresponse(err, response, data) {
    if (err) {
      return callback(err);
    }

    var statusCode = response.statusCode;

    if (statusCode >= 200 && statusCode < 300) {
      callback(null, data);
    }
    else if (data.error) {
      callback(new ReportError(data.error));
    }
    else {
      callback(new ReportError('Unknown Reports API error', statusCode, data));
    }
  }
};


/**
 * @private
 * @param {Number} duration
 */
TogglClient.prototype.setAuthTimer = function setAuthTimer(duration) {
  var self = this;

  // run re-auth before current session actually expires
  duration -= 5000;

  this.authTimeout = setTimeout(reauth, duration);

  function reauth() {
    self.authTimeout = null;
    self.authenticate();
  }
};


/**
 * @private
 * @param {Object|String} schema Validation schema
 * @param {Object} options Request options
 * @param {Function} callback Request callback. If validation error is raised it will be called with error.
 * @returns {Boolean}
 */
TogglClient.prototype.validateOptions = function validateOptions(schema,
  options, callback) {
  var error = validate(schema, options);

  if (error) {
    setImmediate(callback, error);
    return false;
  }

  return true;
};


function validateOptions(options) {
  if (!options.apiToken && !(options.username && options.password)) {
    throw new Error('You should either specify apiToken or username and password');
  }

  // if we use apiToken we do not need a session cookie
  if (options.apiToken) {
    options.reauth = true;
  }

  if (!options.apiUrl) {
    throw new Error('Toggl API base URL is not specified');
  }
}


require('./api/reports');
require('./api/user');
require('./api/clients');
require('./api/dashboard');
require('./api/projects');
require('./api/project_users');
require('./api/tags');
require('./api/tasks');
require('./api/time_entries');
require('./api/workspaces');
require('./api/workspace_users');