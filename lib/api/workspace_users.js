'use strict'

var TogglClient = require('../client')
  , utils = require('../utils')




/**
 * Delete workspace user
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspace_users.md#delete-workspace-user
 * @public
 * @param {number|string} wuId Workspace user Id
 * @param {function} callback Accepts arguments: (err)
 */
TogglClient.prototype.deleteWorkspaceUser = function(wuId, callback) {
  var req = {
    method: 'DELETE'
  }

  this.apiRequest('/api/v8/workspace_users/' + wuId, req, callback)
}




/**
 * Invite users to workspace
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspace_users.md#invite-users-to-workspace
 * @public
 * @param {number|string} workspaceId Workspace Id
 * @param {string[]} emails E-mail addresses
 * @param {function} callback Accepts arguments: (err, users, notifications)
 */
TogglClient.prototype.inviteUsers = function(workspaceId, emails, callback) {
  var req = {
    method: 'POST',
    body:   {
      emails: emails
    }
  }

  this.apiRequest('/api/v8/workspaces/' + workspaceId + '/invite', req, onresponse)

  function onresponse(err, data) {
    if (err) {
      callback(err)
    }
    else {
      callback(null, data.data, data.notifications)
    }
  }
}




/**
 * Update workspace user
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspace_users.md#update-workspace-user
 * @public
 * @param {number|string} wuId Workspace user Id
 * @param {object} options Update data
 * @param {function} callback Accepts arguments: (err, workspaceUser)
 */
TogglClient.prototype.updateWorkspaceUser = function(wuId, options, callback) {
  var req = {
    method: 'PUT',
    body:   {
      workspace_user: options
    }
  }

  this.apiRequest('/api/v8/workspace_users/' + wuId, req, utils.wrapDataCallback(callback))
}