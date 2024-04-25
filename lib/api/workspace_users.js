'use strict';

var TogglClient = require('../client');
var utils = require('../utils');


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspace_users.md#delete-workspace-user
 * @public
 * @param {Number|String} wuId Workspace user Id
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteWorkspaceUser = function deleteWorkspaceUser(wuId, workspaceId,
  callback) {
  var req = {
    method: 'DELETE'
  };

  return this.apiRequest(`workspaces/${workspaceId}/workspace_users/${wuId}`
    , req, callback);
};

/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspace_users.md#invite-users-to-workspace
 * @public
 * @param {Number|String} organizationId Organization Id
 * @param {String[]} emails E-mail addresses
 * @param {Function} callback <code>(err, users, notifications)</code>
 */
TogglClient.prototype.inviteUsers = function inviteUsers(organizationId, emails,
  callback) {
  var req = {
    method: 'POST',
    body: {
      emails: emails
    }
  };

  return this.apiRequest(`organizations/${organizationId}/invitations`, req,
    onresponse);

  function onresponse(err, data) {
    if (err) {
      callback(err);
    }
    else {
      callback(null, data.data, data.notifications);
    }
  }
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspace_users.md#update-workspace-user
 * @public
 * @param {Number|String} wuId Workspace user Id
 * @param {Number|String} workspaceId Workspace Id
 * @param {Object} options Update data
 * @param {Function} callback <code>(err, workspaceUser)</code>
 */
TogglClient.prototype.updateWorkspaceUser = function updateWorkspaceUser(wuId,
  options, callback) {
  var req = {
    method: 'PUT',
    body: {
      workspace_user: options
    }
  };

  return this.apiRequest(`workspaces/${workspaceId}/workspace_users/${wuId}`, req,
    utils.wrapDataCallback(callback));
};
