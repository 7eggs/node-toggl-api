'use strict'

var TogglClient = require('../client')
  , utils = require('../utils')




/**
 * Get workspace users
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-clients
 * @public
 * @param {number|string} wId Workspace Id
 * @param {function} callback Accepts arguments: (err, clients)
 */
TogglClient.prototype.getWorkspaceClients = function(wId, callback) {
  this.apiRequest('/api/v8/workspaces/' + wId + '/clients', {}, callback)
}




/**
 * Get workspace data
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-single-workspace
 * @public
 * @param {number|string} wId Workspace Id
 * @param {function} callback Accepts arguments: (err, workspace)
 */
TogglClient.prototype.getWorkspaceData = function(wId, callback) {
  this.apiRequest('/api/v8/workspaces/' + wId, {}, utils.wrapDataCallback(callback))
}




/**
 * Get workspace projects
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-projects
 * @public
 * @param {number|string} wId Workspace Id
 * @param {object} [options] Request options
 * @param {function} callback Accepts arguments: (err, projects)
 */
TogglClient.prototype.getWorkspaceProjects = function(wId, options, callback) {
  if (arguments.length === 2) {
    callback = options
    options = {}
  }

  if (!this.validateOptions('workspace-projects', options, callback)) {
    return
  }

  var req = {
    qs: options
  }

  this.apiRequest('/api/v8/workspaces/' + wId + '/projects', req, callback)
}




/**
 * Get workspace tags
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-tags
 * @public
 * @param {number|string} wId Workspace Id
 * @param {function} callback Accepts arguments: (err, tags)
 */
TogglClient.prototype.getWorkspaceTags = function(wId, callback) {
  this.apiRequest('/api/v8/workspaces/' + wId + '/tags', {}, callback)
}




/**
 * Get workspace tasks
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-tasks
 * @public
 * @param {number|string} wId Workspace Id
 * @param {object} [options] Request options
 * @param {function} callback Accepts arguments: (err, tasks)
 */
TogglClient.prototype.getWorkspaceTasks = function(wId, options, callback) {
  if (arguments.length === 2) {
    callback = options
    options = {}
  }

  if (!this.validateOptions('workspace-tasks', options, callback)) {
    return
  }

  var req = {
    qs: options
  }

  this.apiRequest('/api/v8/workspaces/' + wId + '/tasks', req, callback)
}




/**
 * Get workspace users
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-users
 * @see @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspace_users.md#get-workspace-users
 * @public
 * @param {number|string} wId Workspace Id
 * @param {boolean} [actualUsers=true] Return actual users or 'workspace user' objects
 * @param {function} callback Accepts arguments: (err, users)
 */
TogglClient.prototype.getWorkspaceUsers = function(wId, actualUsers, callback) {
  if (arguments.length === 2) {
    callback = actualUsers
    actualUsers = true
  }

  var url = '/api/v8/workspaces/' + wId

  if (actualUsers) {
    url += '/users'
  }
  else {
    url += '/workspace_users'
  }

  this.apiRequest(url, {}, callback)
}




/**
 * Get data about all workspaces
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspaces
 * @public
 */
TogglClient.prototype.getWorkspaces = function(callback) {
  this.apiRequest('/api/v8/workspaces', {}, callback)
}




/**
 * Update workspace data
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#update-workspace
 * @public
 * @param {number|string} wId Workspace Id
 * @param {object} data Update data
 * @param {function} callback Accepts arguments: (err, workspace)
 */
TogglClient.prototype.updateWorkspace = function(wId, data, callback) {
  var req = {
    method: 'PUT',
    body:   {
      workspace: data
    }
  }

  this.apiRequest('/api/v8/workspaces/' + wId, req, utils.wrapDataCallback(callback))
}