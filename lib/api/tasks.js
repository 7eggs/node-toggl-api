'use strict';

const TogglClient = require('../client');
const utils = require('../utils');
const path = utils.path;


/**
 * GET Tasks of the current user, across workspaces.
 *
 * @see https://engineering.toggl.com/docs/track/api/me#get-tasks
 * @public
 * @param {Object} [options] <code>since</code>, <code>include_not_active</code>,
 *   <code>meta</code>, <code>offset</code>, <code>per_page</code>
 * @param {Function} [callback] <code>(err, tasks)</code>
 */
TogglClient.prototype.getUserTasks = function getUserTasks(options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest('me/tasks', { qs: options }, callback);
};


/**
 * GET Tasks of a workspace. Resolves with a page:
 * <code>{data, page, per_page, total_count, ...}</code>.
 *
 * @see https://engineering.toggl.com/docs/track/api/tasks#get-tasks
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} [options] <code>active</code>, <code>pid</code>, <code>search</code>,
 *   <code>page</code>, <code>per_page</code>, <code>sort_field</code>, <code>sort_order</code>, ...
 * @param {Function} [callback] <code>(err, page)</code>
 */
TogglClient.prototype.getWorkspaceTasks = function getWorkspaceTasks(
  workspaceId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest(path`workspaces/${workspaceId}/tasks`,
    { qs: options }, callback);
};


/**
 * GET WorkspaceProjectTasks
 *
 * @see https://engineering.toggl.com/docs/track/api/tasks#get-workspaceprojecttasks
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Object} [options] <code>active</code>
 * @param {Function} [callback] <code>(err, tasks)</code>
 */
TogglClient.prototype.getProjectTasks = function getProjectTasks(workspaceId,
  projectId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest(
    path`workspaces/${workspaceId}/projects/${projectId}/tasks`,
    { qs: options }, callback);
};


/**
 * POST WorkspaceProjectTasks: creates a task.
 *
 * @see https://engineering.toggl.com/docs/track/api/tasks#post-workspaceprojecttasks
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Object|String} data Task data (<code>name</code> is required), or just the name
 * @param {Function} [callback] <code>(err, task)</code>
 */
TogglClient.prototype.createTask = function createTask(workspaceId, projectId,
  data, callback) {
  const req = {
    method: 'POST',
    body: typeof data === 'string' ? { name: data } : data
  };

  return this.apiRequest(
    path`workspaces/${workspaceId}/projects/${projectId}/tasks`, req, callback);
};


/**
 * GET WorkspaceProjectTask
 *
 * @see https://engineering.toggl.com/docs/track/api/tasks#get-workspaceprojecttask
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Number|String} taskId Task ID
 * @param {Function} [callback] <code>(err, task)</code>
 */
TogglClient.prototype.getTaskData = function getTaskData(workspaceId,
  projectId, taskId, callback) {
  return this.apiRequest(
    path`workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, {},
    callback);
};


/**
 * PUT WorkspaceProjectTask
 *
 * @see https://engineering.toggl.com/docs/track/api/tasks#put-workspaceprojecttask
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Number|String} taskId Task ID
 * @param {Object} data Task data
 * @param {Function} [callback] <code>(err, task)</code>
 */
TogglClient.prototype.updateTask = function updateTask(workspaceId, projectId,
  taskId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(
    path`workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, req,
    callback);
};


/**
 * PATCH WorkspaceProjectTasks: bulk edits tasks with JSON Patch operations
 * such as <code>{op: 'replace', path: '/active', value: false}</code>.
 *
 * @see https://engineering.toggl.com/docs/track/api/tasks#patch-workspaceprojecttasks
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Number[]|String[]} taskIds Task IDs
 * @param {Object[]} operations JSON Patch operations
 * @param {Function} [callback] <code>(err, result)</code>
 */
TogglClient.prototype.updateTasks = function updateTasks(workspaceId,
  projectId, taskIds, operations, callback) {
  const req = {
    method: 'PATCH',
    body: operations
  };

  return this.apiRequest(
    path`workspaces/${workspaceId}/projects/${projectId}/tasks/${taskIds}`, req,
    callback);
};


/**
 * DELETE WorkspaceProjectTask
 *
 * @see https://engineering.toggl.com/docs/track/api/tasks#delete-workspaceprojecttask
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Number|String} taskId Task ID
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.deleteTask = function deleteTask(workspaceId, projectId,
  taskId, callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(
    path`workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, req,
    callback);
};


/**
 * Deletes several tasks of a project, one request at a time (v9 has no
 * bulk delete).
 *
 * @see {@link TogglClient#deleteTask}
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Number[]|String[]} taskIds Task IDs
 * @param {Function} [callback] <code>(err, results)</code>
 */
TogglClient.prototype.deleteTasks = function deleteTasks(workspaceId,
  projectId, taskIds, callback) {
  const promise = utils.sequence(taskIds,
    id => this.deleteTask(workspaceId, projectId, id));
  return utils.callbackify(promise, callback);
};
