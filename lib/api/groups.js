'use strict';

const TogglClient = require('../client');
const utils = require('../utils');
const path = utils.path;


/**
 * GET List of groups in organization with user and workspace assignments
 *
 * @see https://engineering.toggl.com/docs/track/api/groups#get-list-of-groups-in-organization-with-user-and-workspace-assignments
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Object} [options] <code>name</code>, <code>workspace</code>
 * @param {Function} [callback] <code>(err, groups)</code>
 */
TogglClient.prototype.getGroups = function getGroups(organizationId, options,
  callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest(path`organizations/${organizationId}/groups`,
    { qs: options }, callback);
};


/**
 * POST Create group
 *
 * @see https://engineering.toggl.com/docs/track/api/groups#post-create-group
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Object} data <code>name</code>, <code>users</code> (user IDs),
 *   <code>workspaces</code> (workspace IDs)
 * @param {Function} [callback] <code>(err, group)</code>
 */
TogglClient.prototype.createGroup = function createGroup(organizationId, data,
  callback) {
  const req = {
    method: 'POST',
    body: data
  };

  return this.apiRequest(path`organizations/${organizationId}/groups`, req,
    callback);
};


/**
 * PUT Edit group
 *
 * @see https://engineering.toggl.com/docs/track/api/groups#put-edit-group
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Number|String} groupId Group ID
 * @param {Object} data <code>name</code>, <code>users</code>, <code>workspaces</code>
 * @param {Function} [callback] <code>(err, group)</code>
 */
TogglClient.prototype.updateGroup = function updateGroup(organizationId,
  groupId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(
    path`organizations/${organizationId}/groups/${groupId}`, req, callback);
};


/**
 * DELETE Deletes group
 *
 * @see https://engineering.toggl.com/docs/track/api/groups#delete-deletes-group
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Number|String} groupId Group ID
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.deleteGroup = function deleteGroup(organizationId,
  groupId, callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(
    path`organizations/${organizationId}/groups/${groupId}`, req, callback);
};


/**
 * GET Get workspace project groups: the groups assigned to projects.
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#get-get-workspace-project-groups
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number[]|String[]} projectIds Project IDs
 * @param {Function} [callback] <code>(err, projectGroups)</code>
 */
TogglClient.prototype.getProjectGroups = function getProjectGroups(
  workspaceId, projectIds, callback) {
  return this.apiRequest(path`workspaces/${workspaceId}/project_groups`,
    { qs: { project_ids: projectIds } }, callback);
};


/**
 * POST Adds group to project.
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#post-adds-group-to-project
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Number|String} groupId Group ID
 * @param {Function} [callback] <code>(err, projectGroup)</code>
 */
TogglClient.prototype.addProjectGroup = function addProjectGroup(workspaceId,
  projectId, groupId, callback) {
  const req = {
    method: 'POST',
    body: { project_id: projectId, group_id: groupId }
  };

  return this.apiRequest(path`workspaces/${workspaceId}/project_groups`, req,
    callback);
};


/**
 * DELETE Remove project group.
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#delete-remove-project-group
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectGroupId Project group ID
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.deleteProjectGroup = function deleteProjectGroup(
  workspaceId, projectGroupId, callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(
    path`workspaces/${workspaceId}/project_groups/${projectGroupId}`, req,
    callback);
};
