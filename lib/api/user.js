'use strict';


const TogglClient = require('../client');


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#sign-up-new-user
 * @public
 * @static
 * @param {String} email User e-mail address
 * @param {String} password User password
 * @param {String} [timezone] Timezone. UTC by default.
 * @param {Function} callback <code>(err, userData)</code>
 */
TogglClient.createUser = function (email, password, timezone, callback) {
  if (arguments.length === 3) {
    callback = timezone;
    timezone = 'UTC';
  }

  var req = {
    method: 'POST',
    noauth: true,
    body: {
      user: {
        email: email,
        password: password,
        timezone: timezone,
        created_with: TogglClient.USER_AGENT
      }
    }
  };

  TogglClient.defaultClient().apiRequest('signup', req,
    callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#update-user-data
 * @public
 * @param {String} [currentPassword] Current password
 * @param {String} password New password
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.changeUserPassword = function (currentPassword, password, callback) {
  if (arguments.length === 2) {
    callback = password;
    password = currentPassword;
    currentPassword = this.options.password;
  }

  if (!currentPassword) {
    return callback(new Error('Current password is unknown.'));
  }

  var req = {
    method: 'PUT',
    body: {
      user: {
        current_password: currentPassword,
        password: password
      }
    }
  };

  return this.apiRequest('me', req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#get-current-user-data
 * @public
 * @param {Object} options Request options
 * @param {Function} callback <code>(err, userData)</code>
 */
TogglClient.prototype.getUserData = function (options, callback) {

  return this.apiRequest('me', { qs: options },
    callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#reset-api-token
 * @public
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.resetApiToken = function (callback) {
  var req = {
    method: 'POST'
  };

  if (this.options.apiToken) {
    var self = this;
    var original = callback;

    callback = function cb(err, token) {
      if (err) {
        original(err);
      }
      else {
        self.options.apiToken = token;
        original(null, token);
      }
    };
  }

  return this.apiRequest('me/reset_token', req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#update-user-data
 * @public
 * @param {Object} data Update data
 * @param {Function} callback
 */
TogglClient.prototype.updateUserData = function (data, callback) {
  var req = {
    method: 'PUT',
    body: {
      user: data
    }
  };

  return this.apiRequest('me', req, callback);
};
