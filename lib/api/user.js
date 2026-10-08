'use strict';

const TogglClient = require('../client');
const utils = require('../utils');


/**
 * Signs up a new Toggl account (accounts.toggl.com API).
 *
 * Called as <code>createUser(email, password, [timezone], callback)</code>
 * or <code>createUser(data, callback)</code>, where data can also hold
 * <code>display_name</code>, <code>tos_accepted_for</code>, ...
 *
 * @see https://engineering.toggl.com/docs/track/authentication#sign-up-for-an-account
 * @public
 * @static
 * @param {String|Object} email User e-mail address, or the whole sign up data
 * @param {String} [password] User password
 * @param {String} [timezone] Timezone. UTC by default.
 * @param {Function} [callback] <code>(err, userData)</code>
 */
TogglClient.createUser = function createUser(email, password, timezone,
  callback) {
  let data;
  if (typeof email === 'object') {
    data = Object.assign({ timezone: 'UTC' }, email);
    callback = password;
  }
  else {
    [timezone, callback] = utils.optional(timezone, callback, 'UTC');
    data = { email: email, password: password, timezone: timezone };
  }

  const client = TogglClient.defaultClient();
  const url = utils.joinUrl(client.options.accountsUrl, 'signup');
  const req = {
    method: 'POST',
    noauth: true,
    body: data
  };

  return utils.callbackify(client.request(url, req, TogglClient.APIError),
    callback);
};


/**
 * GET Me: the current user.
 *
 * @see https://engineering.toggl.com/docs/track/api/me#get-me
 * @public
 * @param {Object} [options] <code>with_related_data</code>
 * @param {Function} [callback] <code>(err, userData)</code>
 */
TogglClient.prototype.getUserData = function getUserData(options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest('me', { qs: options }, callback);
};


/**
 * PUT Me: updates the current user.
 *
 * @see https://engineering.toggl.com/docs/track/api/me#put-me
 * @public
 * @param {Object} data <code>fullname</code>, <code>email</code>, <code>timezone</code>,
 *   <code>beginning_of_week</code>, <code>default_workspace_id</code>, ...
 * @param {Function} [callback] <code>(err, userData)</code>
 */
TogglClient.prototype.updateUserData = function updateUserData(data,
  callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest('me', req, callback);
};


/**
 * PUT Me: changes the password of the current user. The current password
 * may be omitted when the client was created with it.
 *
 * @see https://engineering.toggl.com/docs/track/api/me#put-me
 * @public
 * @param {String} [currentPassword] Current password
 * @param {String} password New password
 * @param {Function} [callback] <code>(err, userData)</code>
 */
TogglClient.prototype.changeUserPassword = function changeUserPassword(
  currentPassword, password, callback) {
  if (password === undefined || typeof password === 'function') {
    callback = password;
    password = currentPassword;
    currentPassword = this.options.password;
  }

  if (!currentPassword) {
    const error = new Error('Current password is unknown.');
    return utils.callbackify(Promise.reject(error), callback);
  }

  const req = {
    method: 'PUT',
    body: {
      current_password: currentPassword,
      password: password
    }
  };

  return this.apiRequest('me', req, callback);
};


/**
 * POST ResetToken: resets the API token of the current user and resolves
 * with the new one. A client authenticated with the old token switches to
 * the new one.
 *
 * @see https://engineering.toggl.com/docs/track/api/authentication#post-resettoken
 * @public
 * @param {Function} [callback] <code>(err, apiToken)</code>
 */
TogglClient.prototype.resetApiToken = function resetApiToken(callback) {
  const req = {
    method: 'POST'
  };

  const promise = this.apiRequest('me/reset_token', req).then(token => {
    if (this.options.apiToken) {
      this.options.apiToken = token;
    }
    return token;
  });

  return utils.callbackify(promise, callback);
};


/**
 * GET Organizations that the current user is part of.
 *
 * @see https://engineering.toggl.com/docs/track/api/me#get-organizations-that-a-user-is-part-of
 * @public
 * @param {Function} [callback] <code>(err, organizations)</code>
 */
TogglClient.prototype.getUserOrganizations = function getUserOrganizations(
  callback) {
  return this.apiRequest('me/organizations', {}, callback);
};


/**
 * GET Tags of the current user, across workspaces.
 *
 * @see https://engineering.toggl.com/docs/track/api/me#get-tags
 * @public
 * @param {Object} [options] <code>since</code> (UNIX timestamp)
 * @param {Function} [callback] <code>(err, tags)</code>
 */
TogglClient.prototype.getUserTags = function getUserTags(options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest('me/tags', { qs: options }, callback);
};


/**
 * GET Features enabled in each workspace of the current user.
 *
 * @see https://engineering.toggl.com/docs/track/api/me#get-features
 * @public
 * @param {Function} [callback] <code>(err, features)</code>
 */
TogglClient.prototype.getUserFeatures = function getUserFeatures(callback) {
  return this.apiRequest('me/features', {}, callback);
};


/**
 * GET API quota of the current user, per organization.
 *
 * @see https://engineering.toggl.com/docs/track/api/me#get-api-quota-for-the-current-user
 * @public
 * @param {Function} [callback] <code>(err, quota)</code>
 */
TogglClient.prototype.getUserQuota = function getUserQuota(callback) {
  return this.apiRequest('me/quota', {}, callback);
};


/**
 * GET Preferences for the current user
 *
 * @see https://engineering.toggl.com/docs/track/api/preferences#get-preferences-for-the-current-user
 * @public
 * @param {Function} [callback] <code>(err, preferences)</code>
 */
TogglClient.prototype.getUserPreferences = function getUserPreferences(
  callback) {
  return this.apiRequest('me/preferences', {}, callback);
};


/**
 * POST Update the preferences for the current user
 *
 * @see https://engineering.toggl.com/docs/track/api/preferences#post-update-the-preferences-for-the-current-user
 * @public
 * @param {Object} data Preferences to change
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.updateUserPreferences = function updateUserPreferences(
  data, callback) {
  const req = {
    method: 'POST',
    body: data
  };

  return this.apiRequest('me/preferences', req, callback);
};
