'use strict';

const TogglClient = require('../client')

/**
 * POST Create a new workspace.
 * @see https://engineering.toggl.com/docs/api/workspaces#post-create-a-new-workspace
 * @public
 * @param {Number} organizationId Organization Id
 * @param {Object} data Creation data
 * @param {Function} callback <code>(err, workspace)</code>
 */
TogglClient.prototype.createWorkspace = function (organizationId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(`https://api.track.toggl.com/api/v9/organizations/${organizationId}/workspaces`, req,
    callback);
};

/** 
 * GET List of users who belong to the given workspace.
 * @see https://engineering.toggl.com/docs/api/workspaces#get-list-of-users-who-belong-to-the-given-workspace
 * @public
 * @param {Number} organizationId Organization Id
 * @param {Number} workspaceId Workspace Id
 */
TogglClient.prototype.getWorkspaceUsers = function (organizationId, workspaceId, callback) {

  return this.apiRequest(`organizations/${organizationId}/workspaces/${workspaceId}/workspace_users`, {}, callback);
};

/** 
 * PATCH Changes the users in a workspace. (currently deletion only)
 * @see https://engineering.toggl.com/docs/api/workspaces#patch-changes-the-users-in-a-workspace
 * @public
 * @param {Number} organizationId Organization Id
 * @param {Number} workspaceId Workspace Id
 * @param {number[]} deleteArray Workspace user IDs to be deleted
 */
TogglClient.prototype.updateWorkspaceUsers = function (organizationId, workspaceId, deleteArray, callback) {
  const req = {
    method: 'PATCH',
    body: deleteArray
  }

  return this.apiRequest(`organizations/${organizationId}/workspaces/${workspaceId}/workspace_users`, req, callback);
};

/**
 * GET Get single workspace
 * @see https://engineering.toggl.com/docs/api/workspaces#get-get-single-workspace
 * @public
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err, workspace)</code>
 */
TogglClient.prototype.getWorkspaceData = function (workspaceId, callback) {
  return this.apiRequest(`workspaces/${workspaceId}`, {}, callback);
};

/**
 * PUT Update workspace
 * @see https://engineering.toggl.com/docs/api/workspaces#put-update-workspace
 * @public
 * @param {Number} workspaceId Workspace Id
 * @param {Object} data Update data
 * @param {Function} callback <code>(err, workspace)</code>
 */
TogglClient.prototype.updateWorkspace = function (workspaceId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(`workspaces/${workspaceId}`, req, callback);
};

/**
 * POST Alerts
 * @see https://engineering.toggl.com/docs/api/workspaces#post-alerts
 * @public
 * @param {Number} workspaceId Workspace Id
 * @param {Function} callback <code>(err, workspace)</code>
 */
TogglClient.prototype.postAlerts = function (workspaceId, callback) {
  const req = {
    method: 'POST',
  };
  return this.apiRequest(`workspaces/${workspaceId}/alerts`, req, callback);
};

/**
 * DELETE Alerts
 * @see https://engineering.toggl.com/docs/api/workspaces#delete-alerts
 * @public
 * @param {Number} workspaceId Workspace Id
 * @param {Number} alertId Alert Id
 * @param {Function} callback <code>(err, workspace)</code>
 */
TogglClient.prototype.postAlerts = function (workspaceId, alertId, callback) {
  const req = {
    method: 'DELETE',
  };
  return this.apiRequest(`workspaces/${workspaceId}/alerts/${alertId}`, req, callback);
};


/**
 * Todo:
 * GET Workspace statistics
 * GET Get workspace time entry constraints
 * GET TrackReminders
 * POST TrackReminders
 * PUT TrackReminder
 * DELETE TrackReminder
 * GET Get workspace users
 * PUT Update workspace user
 * POST Change a lost password
 */

/** 
 * PUT Update workspace-user
 * @see https://engineering.toggl.com/docs/api/workspaces#put-update-workspace-user-1
 * @public
 * @param {Number} workspaceId Workspace Id
 * @param {Number} userId User Id
 * @param {Object} data Update data
 */
TogglClient.prototype.updateWorkspaceUser = function (workspaceId, userId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  }

  return this.apiRequest(`workspaces/${workspaceId}/workspace_users/${userId}`, req, callback);
};



/**
 * Todo:
 * DELETE Delete workspace user
 */


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-clients
 * @public
 * @param {Number|String} wId Workspace Id
 * @param {Function} callback <code>(err, clients)</code>
 */
TogglClient.prototype.getWorkspaceClients = function (wId, callback) {
  return this.apiRequest('workspaces/' + wId + '/clients', {}, callback);
};







/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-projects
 * @public
 * @param {Number|String} wId Workspace Id
 * @param {Object} [options] Request options
 * @param {Function} callback <code>(err, projects)</code>
 */
TogglClient.prototype.getWorkspaceProjects = function (wId, options, callback) {
  if (arguments.length === 2) {
    callback = options;
    options = {};
  }

  var req = {
    qs: options
  };

  return this.apiRequest('workspaces/' + wId + '/projects', req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-tags
 * @public
 * @param {Number|String} wId Workspace Id
 * @param {Function} callback <code>(err, tags)</code>
 */
TogglClient.prototype.getWorkspaceTags = function (wId, callback) {
  return this.apiRequest('workspaces/' + wId + '/tags', {}, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-tasks
 * @public
 * @param {Number|String} wId Workspace Id
 * @param {Object} [options] Request options
 * @param {Function} callback <code>(err, tasks)</code>
 */
TogglClient.prototype.getWorkspaceTasks = function (wId, options, callback) {
  if (arguments.length === 2) {
    callback = options;
    options = {};
  }

  var req = {
    qs: options
  };

  return this.apiRequest('workspaces/' + wId + '/tasks', req, callback);
};




/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspaces
 * @public
 * @param {Function} callback <code>(err, workspaces)</code>
 */
TogglClient.prototype.getWorkspaces = function (callback) {
  return this.apiRequest('workspaces', {}, callback);
};


