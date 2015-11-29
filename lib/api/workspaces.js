'use strict';

var TogglClient = require('../client');
var utils = require('../utils');


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-clients
 * @public
 * @param {Number|String} wId Workspace Id
 * @param {Function} callback <code>(err, clients)</code>
 */
TogglClient.prototype.getWorkspaceClients = function getWorkspaceClients(wId,
  callback) {
  this.apiRequest('/api/v8/workspaces/' + wId + '/clients', {}, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-single-workspace
 * @public
 * @param {Number|String} wId Workspace Id
 * @param {Function} callback <code>(err, workspace)</code>
 */
TogglClient.prototype.getWorkspaceData = function getWorkspaceData(wId,
  callback) {
  this.apiRequest('/api/v8/workspaces/' + wId, {},
    utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-projects
 * @public
 * @param {Number|String} wId Workspace Id
 * @param {Object} [options] Request options
 * @param {Function} callback <code>(err, projects)</code>
 */
TogglClient.prototype.getWorkspaceProjects = function getWorkspaceProjects(wId,
  options, callback) {
  if (arguments.length === 2) {
    callback = options;
    options = {};
  }

  if (!this.validateOptions('workspace-projects', options, callback)) {
    return;
  }

  var req = {
    qs: options
  };

  this.apiRequest('/api/v8/workspaces/' + wId + '/projects', req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-tags
 * @public
 * @param {Number|String} wId Workspace Id
 * @param {Function} callback <code>(err, tags)</code>
 */
TogglClient.prototype.getWorkspaceTags = function getWorkspaceTags(wId,
  callback) {
  this.apiRequest('/api/v8/workspaces/' + wId + '/tags', {}, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-tasks
 * @public
 * @param {Number|String} wId Workspace Id
 * @param {Object} [options] Request options
 * @param {Function} callback <code>(err, tasks)</code>
 */
TogglClient.prototype.getWorkspaceTasks = function getWorkspaceTasks(wId,
  options, callback) {
  if (arguments.length === 2) {
    callback = options;
    options = {};
  }

  if (!this.validateOptions('workspace-tasks', options, callback)) {
    return;
  }

  var req = {
    qs: options
  };

  this.apiRequest('/api/v8/workspaces/' + wId + '/tasks', req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-users
 * @see @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspace_users.md#get-workspace-users
 * @public
 * @param {Number|String} wId Workspace Id
 * @param {Boolean} [actualUsers=true] Return actual users or 'workspace user' objects
 * @param {Function} callback <code>(err, users)</code>
 */
TogglClient.prototype.getWorkspaceUsers = function getWorkspaceUsers(wId,
  actualUsers, callback) {
  if (arguments.length === 2) {
    callback = actualUsers;
    actualUsers = true;
  }

  var url = '/api/v8/workspaces/' + wId;

  if (actualUsers) {
    url += '/users';
  }
  else {
    url += '/workspace_users';
  }

  this.apiRequest(url, {}, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspaces
 * @public
 * @param {Function} callback <code>(err, workspaces)</code>
 */
TogglClient.prototype.getWorkspaces = function getWorkspaces(callback) {
  this.apiRequest('/api/v8/workspaces', {}, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#update-workspace
 * @public
 * @param {Number|String} wId Workspace Id
 * @param {Object} data Update data
 * @param {Function} callback <code>(err, workspace)</code>
 */
TogglClient.prototype.updateWorkspace = function updateWorkspace(wId, data,
  callback) {
  var req = {
    method: 'PUT',
    body: {
      workspace: data
    }
  };

  this.apiRequest('/api/v8/workspaces/' + wId, req,
    utils.wrapDataCallback(callback));
};
