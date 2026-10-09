'use strict';

const TogglClient = require('../client');
const utils = require('../utils');
const path = utils.path;


/**
 * GET Get workspace projects users
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#get-get-workspace-projects-users
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} [options] <code>project_ids</code>, <code>user_id</code>, <code>with_group_members</code>
 * @param {Function} [callback] <code>(err, projectUsers)</code>
 */
TogglClient.prototype.getWorkspaceProjectUsers =
  function getWorkspaceProjectUsers(workspaceId, options, callback) {
    [options, callback] = utils.optional(options, callback, {});

    return this.apiRequest(path`workspaces/${workspaceId}/project_users`,
      { qs: options }, callback);
  };


/**
 * GET Users of a project, through the workspace project users endpoint.
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#get-get-workspace-projects-users
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Object} [options] <code>user_id</code>, <code>with_group_members</code>
 * @param {Function} [callback] <code>(err, projectUsers)</code>
 */
TogglClient.prototype.getProjectUsers = function getProjectUsers(workspaceId,
  projectId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  const qs = Object.assign({}, options, { project_ids: projectId });
  return this.getWorkspaceProjectUsers(workspaceId, qs, callback);
};


/**
 * POST Add an user into workspace projects users
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#post-add-an-user-into-workspace-projects-users
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Number|String} userId User ID
 * @param {Object} [options] <code>manager</code>, <code>rate</code>, <code>labor_cost</code>, ...
 * @param {Function} [callback] <code>(err, projectUser)</code>
 */
TogglClient.prototype.addProjectUser = function addProjectUser(workspaceId,
  projectId, userId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  const req = {
    method: 'POST',
    body: Object.assign({}, options, { project_id: projectId, user_id: userId })
  };

  return this.apiRequest(path`workspaces/${workspaceId}/project_users`, req,
    callback);
};


/**
 * Adds several users to a project, one request at a time (v9 has no bulk
 * create).
 *
 * @see {@link TogglClient#addProjectUser}
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Number[]|String[]} userIds User IDs
 * @param {Object} [options] See {@link TogglClient#addProjectUser}
 * @param {Function} [callback] <code>(err, projectUsers)</code>
 */
TogglClient.prototype.addProjectUsers = function addProjectUsers(workspaceId,
  projectId, userIds, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  const promise = utils.sequence(userIds,
    id => this.addProjectUser(workspaceId, projectId, id, options));
  return utils.callbackify(promise, callback);
};


/**
 * PUT Update an user into workspace projects users
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#put-update-an-user-into-workspace-projects-users
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} puId Project user ID
 * @param {Object} data <code>manager</code>, <code>rate</code>, <code>labor_cost</code>, ...
 * @param {Function} [callback] <code>(err, projectUser)</code>
 */
TogglClient.prototype.updateProjectUser = function updateProjectUser(
  workspaceId, puId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(path`workspaces/${workspaceId}/project_users/${puId}`,
    req, callback);
};


/**
 * PATCH Patch project users from workspace, with JSON Patch operations
 * such as <code>{op: 'replace', path: '/manager', value: true}</code>.
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#patch-patch-project-users-from-workspace
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number[]|String[]} puIds Project user IDs
 * @param {Object[]} operations JSON Patch operations
 * @param {Function} [callback] <code>(err, result)</code>
 */
TogglClient.prototype.updateProjectUsers = function updateProjectUsers(
  workspaceId, puIds, operations, callback) {
  const req = {
    method: 'PATCH',
    body: operations
  };

  return this.apiRequest(path`workspaces/${workspaceId}/project_users/${puIds}`,
    req, callback);
};


/**
 * DELETE Delete a project user from workspace projects users
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#delete-delete-a-project-user-from-workspace-projects-users
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} puId Project user ID
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.deleteProjectUser = function deleteProjectUser(
  workspaceId, puId, callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(path`workspaces/${workspaceId}/project_users/${puId}`,
    req, callback);
};


/**
 * Deletes several project users, one request at a time (v9 has no bulk
 * delete).
 *
 * @see {@link TogglClient#deleteProjectUser}
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number[]|String[]} puIds Project user IDs
 * @param {Function} [callback] <code>(err, results)</code>
 */
TogglClient.prototype.deleteProjectUsers = function deleteProjectUsers(
  workspaceId, puIds, callback) {
  const promise = utils.sequence(puIds,
    id => this.deleteProjectUser(workspaceId, id));
  return utils.callbackify(promise, callback);
};
