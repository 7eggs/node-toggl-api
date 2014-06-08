'use strict'

var TogglClient = require('../client')
  , utils = require('../utils')




/**
 * Create task
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md
 * @public
 * @param {string} name Task name
 * @param {number|string} projectId ID of project for what task is created
 * @param {object} data Task options
 * @param {function} callback Accepts arguments: (err, task)
 */
TogglClient.prototype.createTask = function(name, projectId, data, callback) {
  data.name = name
  data.pid = projectId

  var req = {
    method: 'POST',
    body:   {
      task: data
    }
  }

  this.apiRequest('/api/v8/tasks', req, utils.wrapDataCallback(callback))
}




/**
 * Delete task
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md
 * @public
 * @param {number|string} taskId Task ID
 * @param {function} callback Accepts arguments: (err)
 */
TogglClient.prototype.deleteTask = function(taskId, callback) {
  var req = {
    method: 'DELETE'
  }

  this.apiRequest('/api/v8/tasks/' + taskId, req, callback)
}




/**
 * Delete several tasks
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md
 * @public
 * @param {number[]|string[]} taskIds Task IDs
 * @param {function} callback Accepts arguments: (err)
 */
TogglClient.prototype.deleteTasks = function(taskIds, callback) {
  this.deleteTask(taskIds.join(), callback)
}




/**
 * Get task details
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md
 * @public
 * @param {number|string} taskId Task ID
 * @param {function} callback Accepts arguments: (err, task)
 */
TogglClient.prototype.getTaskData = function(taskId, callback) {
  this.apiRequest('/api/v8/tasks/' + taskId, {}, utils.wrapDataCallback(callback))
}




/**
 * Update task
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md
 * @public
 * @param {number|string} taskId Task ID
 * @param {object} data Update data
 * @param {string[]} [fields] Fields to include into output
 * @param {function} callback Accepts arguments: (err, task)
 */
TogglClient.prototype.updateTask = function(taskId, data, fields, callback) {
  if (arguments.length === 3) {
    callback = fields
    fields = null
  }

  if (fields) {
    data.fields = fields.join()
  }

  var req = {
    method: 'PUT',
    body:   {
      task: data
    }
  }

  this.apiRequest('/api/v8/tasks/' + taskId, req, utils.wrapDataCallback(callback))
}




/**
 * Update tasks
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md
 * @public
 * @param {number[]|string[]} taskIds Task IDs
 * @param {object} data Update data
 * @param {string[]} [fields] Fields to include into output
 * @param {function} callback Accepts arguments: (err, task)
 */
TogglClient.prototype.updateTasks = function(taskIds, data, fields, callback) {
  var args = utils.args(arguments)
  args[0] = (taskIds||[]).join()
  this.updateTask.apply(this, args)
}