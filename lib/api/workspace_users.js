'use strict';

const TogglClient = require('../client');
const utils = require('../utils');
const path = utils.path;


/**
 * GET Get workspace users: the users of a workspace (user objects).
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#get-get-workspace-users
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} [options] <code>exclude_deleted</code>
 * @param {Function} [callback] <code>(err, users)</code>
 */
TogglClient.prototype.getWorkspaceUsers = function getWorkspaceUsers(
  workspaceId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest(path`workspaces/${workspaceId}/users`,
    { qs: options }, callback);
};


/**
 * GET Get workspace workspace-users: the memberships of a workspace
 * (workspace user objects, whose IDs {@link TogglClient#updateWorkspaceUser}
 * and {@link TogglClient#deleteWorkspaceUser} take).
 *
 * @see https://engineering.toggl.com/docs/track/openapi
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} [options] <code>includeIndirect</code>
 * @param {Function} [callback] <code>(err, workspaceUsers)</code>
 */
TogglClient.prototype.getWorkspaceWorkspaceUsers =
  function getWorkspaceWorkspaceUsers(workspaceId, options, callback) {
    [options, callback] = utils.optional(options, callback, {});

    return this.apiRequest(path`workspaces/${workspaceId}/workspace_users`,
      { qs: options }, callback);
  };


/**
 * GET List of users who belong to the given workspace, through the
 * organization.
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#get-list-of-users-who-belong-to-the-given-workspace
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} [options] <code>name</code>, <code>search</code>, <code>active</code>,
 *   <code>page</code>, <code>per_page</code>, <code>custom_rates</code>
 * @param {Function} [callback] <code>(err, workspaceUsers)</code>
 */
TogglClient.prototype.getOrganizationWorkspaceUsers =
  function getOrganizationWorkspaceUsers(organizationId, workspaceId, options,
    callback) {
    [options, callback] = utils.optional(options, callback, {});

    return this.apiRequest(
      path`organizations/${organizationId}/workspaces/${workspaceId}/workspace_users`,
      { qs: options }, callback);
  };


/**
 * PATCH Changes the users in a workspace (currently, removes them).
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#patch-changes-the-users-in-a-workspace
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object|Number[]} changes <code>{delete: [workspaceUserIds]}</code>,
 *   or just the array of workspace user IDs to remove
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.updateWorkspaceUsers = function updateWorkspaceUsers(
  organizationId, workspaceId, changes, callback) {
  const req = {
    method: 'PATCH',
    body: Array.isArray(changes) ? { delete: changes } : changes
  };

  return this.apiRequest(
    path`organizations/${organizationId}/workspaces/${workspaceId}/workspace_users`,
    req, callback);
};


/**
 * PUT Update workspace-user
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#put-update-workspace-user-1
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} wuId Workspace user ID
 * @param {Object} data <code>admin</code>, <code>role_id</code>, <code>rate</code>,
 *   <code>labor_cost</code>, <code>inactive</code>, ...
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.updateWorkspaceUser = function updateWorkspaceUser(
  workspaceId, wuId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(
    path`workspaces/${workspaceId}/workspace_users/${wuId}`, req, callback);
};


/**
 * DELETE Delete workspace user
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#delete-delete-workspace-user
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} wuId Workspace user ID
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.deleteWorkspaceUser = function deleteWorkspaceUser(
  workspaceId, wuId, callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(
    path`workspaces/${workspaceId}/workspace_users/${wuId}`, req, callback);
};
