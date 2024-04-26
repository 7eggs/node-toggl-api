'use strict';

const TogglClient = require('../client');


/**
 * @see https://engineering.toggl.com/docs/api/workspaces#get-list-of-users-who-belong-to-the-given-workspace
 * @public
 * @param {Number|String} organizationId Organization Id
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.getWorkspaceUsers = function deleteWorkspaceUser(organizationId, workspaceId,
  callback) {

  return this.apiRequest(`organizations/${organizationId}/workspaces/${workspaceId}/workspace_users`
    , {}, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspace_users.md#delete-workspace-user
 * @public
 * @param {Number|String} wuId Workspace user Id
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteWorkspaceUser = function deleteWorkspaceUser(wuId, workspaceId,
  callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(`workspaces/${workspaceId}/workspace_users/${wuId}`, req, callback);
};

/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspace_users.md#update-workspace-user
 * @public
 * @param {Number|String} workspaceId Workspace Id
 * @param {Number|String} wuId Workspace user Id
 * @param {Object} options Update data
 * @param {Function} callback <code>(err, workspaceUser)</code>
 */
TogglClient.prototype.updateWorkspaceUser = function updateWorkspaceUser(workspaceId, wuId, options, callback) {
  const req = {
    method: 'PUT',
    body: {
      workspace_user: options
    }
  };

  return this.apiRequest(`workspaces/${workspaceId}/workspace_users/${wuId}`, req, callback);
};
