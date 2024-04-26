'use strict';

const TogglClient = require('../client');

/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#create-project
 * @public
 * @param {Object} data New project data
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err, projectData)</code>
 */
TogglClient.prototype.createProject = function (data, workspaceId, callback) {
  var req = {
    method: 'POST',
    body: {
      project: data
    }
  };

  return this.apiRequest(`workspaces/${workspaceId}/projects`, req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#delete-a-project
 * @public
 * @param {Number|String} projectId Project ID
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteProject = function (projectId, workspaceId, callback) {
  var req = {
    method: 'DELETE'
  };

  return this.apiRequest(`workspaces/${workspaceId}/projects/${projectId}`, req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#delete-multiple-projects
 * @public
 * @param {Number[]|String[]} projectIds Project IDs
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteProjects = function deleteProjects(projectIds, callback) {
  if (arguments.length > 2 || !Array.isArray(projectIds)) {
    projectIds = [].slice.call(arguments, 0);
    callback = projectIds.pop();
  }

  this.deleteProject(projectIds.join(), callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#get-project-data
 * @public
 * @param {Number|String} projectId Project ID
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err, projectData)</code>
 */
TogglClient.prototype.getProjectData = function (projectId, workspaceId, callback) {
  return this.apiRequest(`workspaces/${workspaceId}/projects/${projectId}`, {}, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#get-project-tasks
 * @public
 * @param {Number|String} projectId Project ID
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err, tasks)</code>
 */
TogglClient.prototype.getProjectTasks = function (projectId, workspaceId, callback) {
  return this.apiRequest('projects/' + projectId + '/tasks', {}, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#get-project-users
 * @public
 * @param {Number|String} projectId Project ID
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err, users)</code>
 */
TogglClient.prototype.getProjectUsers = function (projectId, workspaceId, callback) {
  // This looks wrong in their migration guide, I'll have to check it later
  // GET	/projects/{project_id}/project_users	/workspaces/{workspace_id}/project_users
  return this.apiRequest(`workspaces/${workspaceId}/project_users`, {}, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#update-project-data
 * @public
 * @param {Number|String} projectId project ID
 * @param {Number|String} workspaceId Workspace Id
 * @param {Object} data Project data
 * @param {Function} callback <code>(err, projectData)</code>
 */
TogglClient.prototype.updateProject = function (projectId, workspaceId, data, callback) {
  var req = {
    method: 'PUT',
    body: {
      project: data
    }
  };

  return this.apiRequest(`workspaces/${workspaceId}/projects/${projectId}` + projectId, req, callback);
};
