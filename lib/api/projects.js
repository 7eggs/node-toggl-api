'use strict';

const TogglClient = require('../client');
const utils = require('../utils');
const path = utils.path;


/**
 * GET Projects of the current user, across workspaces.
 *
 * @see https://engineering.toggl.com/docs/track/api/me#get-projects
 * @public
 * @param {Object} [options] <code>include_archived</code>, <code>since</code>
 * @param {Function} [callback] <code>(err, projects)</code>
 */
TogglClient.prototype.getUserProjects = function getUserProjects(options,
  callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest('me/projects', { qs: options }, callback);
};


/**
 * GET WorkspaceProjects
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#get-workspaceprojects
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} [options] Filters and paging: <code>active</code>, <code>billable</code>,
 *   <code>client_ids</code>, <code>user_ids</code>, <code>name</code>, <code>page</code>,
 *   <code>per_page</code>, <code>sort_field</code>, <code>sort_order</code>, ...
 * @param {Function} [callback] <code>(err, projects)</code>
 */
TogglClient.prototype.getWorkspaceProjects = function getWorkspaceProjects(
  workspaceId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest(path`workspaces/${workspaceId}/projects`,
    { qs: options }, callback);
};


/**
 * POST WorkspaceProjects: creates a project.
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#post-workspaceprojects
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} data Project data, <code>name</code> is required
 * @param {Function} [callback] <code>(err, project)</code>
 */
TogglClient.prototype.createProject = function createProject(workspaceId, data,
  callback) {
  const req = {
    method: 'POST',
    body: data
  };

  return this.apiRequest(path`workspaces/${workspaceId}/projects`, req,
    callback);
};


/**
 * GET WorkspaceProject
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#get-workspaceproject
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Function} [callback] <code>(err, project)</code>
 */
TogglClient.prototype.getProjectData = function getProjectData(workspaceId,
  projectId, callback) {
  return this.apiRequest(path`workspaces/${workspaceId}/projects/${projectId}`,
    {}, callback);
};


/**
 * PUT WorkspaceProject. Archive a project with <code>{active: false}</code>.
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#put-workspaceproject
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Object} data Project data
 * @param {Function} [callback] <code>(err, project)</code>
 */
TogglClient.prototype.updateProject = function updateProject(workspaceId,
  projectId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(path`workspaces/${workspaceId}/projects/${projectId}`,
    req, callback);
};


/**
 * PATCH WorkspaceProjects: bulk edits projects with JSON Patch operations
 * such as <code>{op: 'replace', path: '/active', value: false}</code>.
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#patch-workspaceprojects
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number[]|String[]} projectIds Project IDs
 * @param {Object[]} operations JSON Patch operations
 * @param {Function} [callback] <code>(err, result)</code>
 */
TogglClient.prototype.updateProjects = function updateProjects(workspaceId,
  projectIds, operations, callback) {
  const req = {
    method: 'PATCH',
    body: operations
  };

  return this.apiRequest(path`workspaces/${workspaceId}/projects/${projectIds}`,
    req, callback);
};


/**
 * DELETE WorkspaceProject
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#delete-workspaceproject
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Object} [options] <code>teDeletionMode</code>: 'delete' or 'unassign' its time entries
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.deleteProject = function deleteProject(workspaceId,
  projectId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  const req = {
    method: 'DELETE',
    qs: options
  };

  return this.apiRequest(path`workspaces/${workspaceId}/projects/${projectId}`,
    req, callback);
};


/**
 * Deletes several projects, one request at a time (v9 has no bulk delete).
 *
 * @see {@link TogglClient#deleteProject}
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number[]|String[]} projectIds Project IDs
 * @param {Object} [options] See {@link TogglClient#deleteProject}
 * @param {Function} [callback] <code>(err, results)</code>
 */
TogglClient.prototype.deleteProjects = function deleteProjects(workspaceId,
  projectIds, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  const promise = utils.sequence(projectIds,
    id => this.deleteProject(workspaceId, id, options));
  return utils.callbackify(promise, callback);
};


/**
 * POST Pins or unpins a project for the current user.
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#post-workspaceprojects-1
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Boolean} [pin] <code>false</code> to unpin, <code>true</code> by default
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.pinProject = function pinProject(workspaceId, projectId,
  pin, callback) {
  [pin, callback] = utils.optional(pin, callback, true);

  const req = {
    method: 'POST',
    body: { pin: pin }
  };

  return this.apiRequest(
    path`workspaces/${workspaceId}/projects/${projectId}/pin`, req, callback);
};
