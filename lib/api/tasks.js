'use strict';

var TogglClient = require('../client');
var utils = require('../utils');


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md#create-a-task
 * @public
 * @param {String} name Task name
 * @param {Number|String} projectId ID of project for what task is created
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} data Task options
 * @param {Function} callback <code>(err, task)</code>
 */
TogglClient.prototype.createTask = function createTask(name, projectId, workspaceId, data,
  callback) {
  data.name = name;
  data.pid = projectId;

  var req = {
    method: 'POST',
    body: {
      task: data
    }
  };

  this.apiRequest(`/api/v9/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    req, utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md#delete-a-task
 * @public
 * @param {Number|String} taskId Task ID
 * @param {Number|String} projectId Project ID
 * @param {Number|String} workspaceId Workspace ID
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteTask = function deleteTask(taskId, projectId, workspaceId, callback) {
  var req = {
    method: 'DELETE'
  };

  this.apiRequest(`/api/v9/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md#delete-multiple-tasks
 * @public
 * @param {Number[]|String[]} taskIds Task IDs
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteTasks = function deleteTasks(taskIds, callback) {
  this.deleteTask(taskIds.join(), callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md#get-task-details
 * @public
 * @param {Number|String} taskId Task ID
 * @param {Function} callback <code>(err, task)</code>
 */
TogglClient.prototype.getTaskData = function getTaskData(taskId, callback) {
  this.apiRequest('/api/v9/me/tasks' + taskId, {},
    utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md#update-a-task
 * @public
 * @param {Number|String} taskId Task ID
 * @param {Number|String} projectId Project ID
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} data Update data
 * @param {String[]} [fields] Fields to include into output
 * @param {Function} callback <code>(err, task)</code>
 */
TogglClient.prototype.updateTask = function updateTask(taskId, projectId, workspaceId, data, fields,
  callback) {
  if (arguments.length === 3) {
    callback = fields;
    fields = null;
  }

  if (fields) {
    data.fields = fields.join();
  }

  var req = {
    method: 'PUT',
    body: {
      task: data
    }
  };

  this.apiRequest(`/api/v9/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, req,
    utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md#update-multiple-tasks
 * @public
 * @param {Number[]|String[]} taskIds Task IDs
 * @param {Object} data Update data
 * @param {String[]} [fields] Fields to include into output
 * @param {Function} callback <code>(err, task)</code>
 */
TogglClient.prototype.updateTasks = function updateTasks(taskIds, data, fields,
  callback) {
  var args = utils.args(arguments);
  args[0] = (taskIds || []).join();
  this.updateTask.apply(this, args);
};
