'use strict'


var TogglClient = require('../client')
  , utils = require('../utils')




/**
 * Create new user
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#sign-up-new-user
 * @public
 * @static
 * @param {string} email User e-mail address
 * @param {string} password User password
 * @param {string} [timezone] Timezone. UTC by default.
 * @param {function} callback Accepts arguments: (err, userData)
 */
TogglClient.createUser = function(email, password, timezone, callback) {
  if (arguments.length === 3) {
    callback = timezone
    timezone = 'UTC'
  }

  var req = {
    method: 'POST',
    noauth: true,
    body:   {
      user: {
        email:        email,
        password:     password,
        timezone:     timezone,
        created_with: TogglClient.USER_AGENT
      }
    }
  }

  TogglClient.defaultClient().apiRequest('/api/v8/signups', req, utils.wrapDataCallback(callback))
}




/**
 * Change user password
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#update-user-data
 * @public
 * @param {string} [currentPassword] Current password
 * @param {string} password New password
 * @param {function} callback Accepts arguments: (err)
 */
TogglClient.prototype.changeUserPassword = function(currentPassword, password, callback) {
  if (arguments.length === 2) {
    callback = password
    password = currentPassword
    currentPassword = this.options.password
  }

  if (!currentPassword) {
    return callback(new Error('Current password is unknown.'))
  }

  var req = {
    method: 'PUT',
    body:   {
      user: {
        current_password: currentPassword,
        password:         password
      }
    }
  }

  this.apiRequest('/api/v8/me', req, utils.wrapDataCallback(callback))
}




/**
 * Get user data
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#get-current-user-data
 * @public
 * @param {object} options Request options
 * @param {function} callback Accepts arguments: (err, userData)
 */
TogglClient.prototype.getUserData = function(options, callback) {
  if (!this.validateOptions('user-data-get', options, callback)) {
    return
  }

  this.apiRequest('/api/v8/me', {qs: options}, utils.wrapDataCallback(callback))
}




/**
 * Reset API token
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#reset-api-token
 * @public
 * @param {function} callback Accepts arguments: (err)
 */
TogglClient.prototype.resetApiToken = function(callback) {
  var req = {
    method: 'POST'
  }

  if (this.options.apiToken) {
    var self = this
      , original = callback

    callback = function(err, token) {
      if (err) {
        original(err)
      }
      else {
        self.options.apiToken = token
        original(null, token)
      }
    }
  }

  this.apiRequest('/api/v8/reset_token', req, callback)
}




/**
 * Update user data
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#update-user-data
 * @public
 * @param {object} data Update data
 * @param {function} callback
 */
TogglClient.prototype.updateUserData = function(data, callback) {
  if (!this.validateOptions('user-data-set', data, callback)) {
    return
  }

  var req = {
    method: 'PUT',
    body:   {
      user: data
    }
  }

  this.apiRequest('/api/v8/me', req, utils.wrapDataCallback(callback))
}