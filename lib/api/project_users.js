'use strict';

var TogglClient = require('../client');
var utils = require('../utils');


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/project_users.md#create-a-project-user
 * @public
 * @param {Number|String} projectId Project ID
 * @param {Number|String} userId User ID
 * @param {Object} [options] Project user options
 * @param {String[]} [fields] List of User fields to populate
 * @param {Function} callback <code>(err, projectUser)</code>
 */
TogglClient.prototype.addProjectUser = function addProjectUser(projectId,
  userId, options,
  fields, callback) {
  if (arguments.length === 3) {
    callback = options;
    options = {};
    fields = null;
  }
  else if (arguments.length === 4) {
    if (!Array.isArray(options)) {
      callback = fields;
      fields = null;
    }
    else {
      callback = fields;
      fields = options;
      options = {};
    }
  }

  options.pid = projectId;
  options.uid = userId;

  if (fields) {
    options.fields = fields.join();
  }

  if (!this.validateOptions('project-user-add', options, callback)) {
    return;
  }

  var req = {
    method: 'POST',
    body: {
      project_user: options
    }
  };

  this.apiRequest('/api/v8/project_users', req,
    utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/project_users.md#create-multiple-project-users-for-single-project
 * @public
 * @param {Number|String} projectId Project ID
 * @param {Number[]|String[]} userIds User IDs
 * @param {Object} [options] Project user options
 * @param {String[]} [fields] List of User fields to populate
 * @param {Function} callback <code>(err, projectUsers)</code>
 */
TogglClient.prototype.addProjectUsers = function addProjectUsers(projectId,
  userIds, options,
  fields, callback) {
  var args = utils.args(arguments);
  args[1] = userIds.join();
  callback = args.pop();
  args.push(utils.wrapDataCallback(callback));
  this.addProjectUser.apply(this, args);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/project_users.md#delete-a-project-user
 * @public
 * @param {Number|String} puID Project user ID
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteProjectUser = function deleteProjectUser(puID,
  callback) {
  var req = {
    method: 'DELETE'
  };

  this.apiRequest('/api/v8/project_users/' + puID, req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/project_users.md#delete-multiple-project-users
 * @public
 * @param {Number[]|String[]} puIDs Project user IDs
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteProjectUsers = function deleteProjectUsers(puIDs,
  callback) {
  this.deleteProjectUser(puIDs.join(), callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/project_users.md#update-a-project-user
 * @public
 * @param {Number|String} puID Project user ID
 * @param {Object} options Project user options
 * @param {string[]} [fields] List of User fields to populate
 * @param {Function} callback <code>(err, projectUser)</code>
 */
TogglClient.prototype.updateProjectUser = function updateProjectUser(puID,
  options, fields, callback) {
  if (arguments.length === 3) {
    callback = fields;
    fields = null;
  }

  if (fields) {
    options.fields = fields.join();
  }

  var req = {
    method: 'PUT',
    body: {
      project_user: options
    }
  };

  this.apiRequest('/api/v8/project_users/' + puID, req,
    utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/project_users.md#mass-update-for-project-users
 * @public
 * @param {Number[]|String[]} puIDs Project user IDs
 * @param {Object} options Project user options
 * @param {String[]} [fields] List of User fields to populate
 * @param {Function} callback <code>(err, projectUsers)</code>
 */
TogglClient.prototype.updateProjectUsers = function updateProjectUsers(puIDs,
  options, fields,
  callback) {
  var args = utils.args(arguments);
  args[0] = puIDs.join();
  callback = args.pop();
  args.push(utils.wrapDataCallback(callback));
  this.updateProjectUser.apply(this, args);
};
