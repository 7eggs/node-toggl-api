'use strict'

var assign = require('object-assign')
  , errors = require('./errors')
  , EventEmitter = require('events').EventEmitter
  , request = require('request')
  , validate = require('./validator')
  , VERSION = require('../package.json').version
  , APIError = errors.APIError
  , ReportError = errors.ReportError
  , defaultClient = null

var defaults = {
  reauth:        false,
  sessionCookie: 'toggl_api_session',
  apiUrl:        'https://www.toggl.com',
  reportsUrl:    'https://toggl.com/reports'
}




function noop() {
}




/**
 * Validate client options
 */
function validateOptions(options) {
  if (!options.apiToken && !(options.username && options.password)) {
    throw new Error('You should either specify apiToken or username and password')
  }

  // if we use apiToken we do not need a session cookie
  if (options.apiToken) {
    options.reauth = true
  }

  if (!options.apiUrl) {
    throw new Error('Toggl API base URL is not specified')
  }
}




/**
 * Expose client
 */
module.exports = TogglClient




/**
 * Toggl API client
 *
 * @constructor
 * @param [options] Client options
 */
function TogglClient(options) {
  /**
   * @private
   */
  this.options = {}
  assign(this.options, defaults)

  if (options !== undefined) {
    assign(this.options, options)
    validateOptions(this.options)
  }


  /**
   * For internal needs
   *
   * @private
   * @type {EventEmitter}
   */
  this.emitter = new EventEmitter()
  this.emitter.setMaxListeners(0)


  /**
   * Used to store and set cookies for API requests
   *
   * @private
   * @type {CookieJar}
   */
  this.cookieJar = request.jar()


  /**
   * Result of authentication call
   *
   * @public
   */
  this.authData = null


  /**
   * Re-authentication timeout ID
   *
   * @private
   */
  this.authTimeout = null


  /**
   * If we're authenticating
   *
   * @private
   */
  this.authenticating = false
}




/**
 * User agent string
 *
 * @public
 * @static
 */
TogglClient.USER_AGENT = 'node-toggl v' + VERSION




/**
 * Return default API client
 *
 * @public
 * @static
 * @returns {TogglClient}
 */
TogglClient.defaultClient = function() {
  if (!defaultClient) {
    defaultClient = new TogglClient()
  }

  return defaultClient
}




/**
 * Set default settings for client
 *
 * @public
 * @static
 * @param {object} newDefaults
 */
TogglClient.setDefaults = function(newDefaults) {
  assign(defaults, newDefaults)
}




/**
 * Request to Toggl API v8
 *
 * @private
 * @param {string} path API path
 * @param {object} opts Request options
 * @param {function} callback Accepts arguments: (err, data)
 */
TogglClient.prototype.apiRequest = function(path, opts, callback) {
  var self = this
    , options = this.options

  if (this.authenticating) {
    this.emitter.once('authenticate', function(err) {
      if (err) {
        return callback(err)
      }

      self.apiRequest(path, opts, callback)
    })

    return
  }
  else if (!opts.noauth && !options.apiToken && !this.authData) {
    return callback(new Error('Authenticate first'))
  }

  if (!opts.noauth) {
    if (options.apiToken) {
      opts.auth = {
        user: options.apiToken,
        pass: 'api_token'
      }
    }
    else {
      opts.jar = this.cookieJar
    }
  }

  opts.url = options.apiUrl + path
  opts.json = true

  request(opts, onresponse)

  function onresponse(err, response, data) {
    var statusCode = response.statusCode

    if (err) {
      callback(err)
    }
    else if (statusCode >= 200 && statusCode < 300) {
      callback(null, data)
    }
    else {
      return callback(new APIError(statusCode, data))
    }
  }
}




/**
 * Make authentication call only if you use username & password
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/authentication.md
 * @public
 * @param {function} [callback] Accepts arguments: (err, userData)
 */
TogglClient.prototype.authenticate = function(callback) {
  var self = this
    , options = this.options
    , auth
    , req = {}

  callback = callback || noop

  if (options.username && options.password) {
    auth = {
      user: options.username,
      pass: options.password
    }
  }
  else {
    return callback(new Error('No need to authenticate thus you use apiToken'))
  }

  req.auth = auth
  req.method = 'GET'

  this.apiRequest('/api/v8/me', req, done)
  this.authenticating = true

  function done(err, data) {
    self.emitter.emit('authenticate', err, data)

    if (err) {
      return error(err)
    }

    self.authData = data

    if (options.reauth) {
      self.cookieJar._jar.getCookies(options.apiUrl, oncookies)
    }
    else {
      success()
    }
  }

  function oncookies(err, cookies) {
    if (err) {
      error(err)
    }

    var sessionCookie = findCookieByKey(cookies, options.sessionCookie)
      , ttl = sessionCookie.ttl()

    if (ttl) {
      self.setAuthTimer(ttl)
    }

    success()
  }

  function success() {
    self.authenticating = false
    self.emitter.emit('authenticate', null, self.authData)

    callback(null, self.authData)
  }

  function error(err) {
    self.authenticating = false
    self.emitter.emit('authenticate', err)

    callback(err)
  }
}




/**
 * Call when client is no longer needed
 *
 * @public
 */
TogglClient.prototype.destroy = function() {
  if (this.authTimeout) {
    clearTimeout(this.authTimeout)
  }
}




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




/**
 * Request to Toggl API v8
 *
 * @private
 * @param {string} path API path
 * @param {object} opts Request options
 * @param {function} callback Accepts arguments: (err, data)
 */
TogglClient.prototype.reportsRequest = function(path, opts, callback) {
  var options = this.options

  if (!options.apiToken) {
    return callback(new Error('API token is not specified. Reports API can\'t be used.'))
  }

  opts.auth = {
    user: options.apiToken,
    pass: 'api_token'
  }
  opts.url = options.reportsUrl + path
  opts.json = true
  opts.qs = opts.qs || {}
  opts.qs.user_agent = TogglClient.USER_AGENT

  request(opts, onresponse)

  function onresponse(err, response, data) {
    var statusCode = response.statusCode

    if (err) {
      callback(err)
    }
    else if (statusCode >= 200 && statusCode < 300) {
      callback(null, data)
    }
    else if (data.error) {
      return callback(new ReportError(data.error))
    }
    else {
      return callback(new ReportError('Unknown Reports API error', statusCode, data))
    }
  }
}




/**
 * Set timer for re-authentication
 *
 * @private
 * @param {number} duration
 */
TogglClient.prototype.setAuthTimer = function(duration) {
  var self = this

  // run re-auth before current session actually expires
  duration -= 5000

  this.authTimeout = setTimeout(reauth, duration)

  function reauth() {
    self.authTimeout = null
    self.authenticate()
  }
}




/**
 * Validate request options
 *
 * @private
 * @param {object|string} schema Validation schema
 * @param {object} options Request options
 * @param {function} callback Request callback. If validation error is raised it will be called with error.
 * @returns {boolean}
 */
TogglClient.prototype.validateOptions = function(schema, options, callback) {
  var error = validate(schema, options)

  if (error) {
    callback(error)
    return false
  }

  return true
}




/**
 * Extend TogglClient prototype
 */
require('./api/reports')
require('./api/user')
require('./api/clients')
require('./api/dashboard')
require('./api/projects')
require('./api/project_users')
require('./api/tags')
require('./api/tasks')
require('./api/time_entries')
require('./api/workspaces')
require('./api/workspace_users')
