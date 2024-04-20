'use strict';

var TogglClient = require('../client');
var utils = require('../utils');


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tags.md#create-tag
 * @public
 * @param {String} name Tag name
 * @param {Number|String} workspaceId Workspace ID
 * @param {Function} callback <code>(err, tag)</code>
 */
TogglClient.prototype.createTag = function createTag(name, workspaceId,
  callback) {
  var tag = {
    name: name,
    wid: workspaceId//maybe not needed
  };

  var req = {
    method: 'POST',
    body: {
      tag: tag
    }
  };

  return this.apiRequest(`/api/v9/workspaces/${workspaceId}/tags`, req, utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tags.md#delete-a-tag
 * @public
 * @param {Number|String} tagId Tag Id
 * @param {Number|String} workspaceId Workspace ID
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteTag = function deleteTag(tagId, workspaceId, callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(`/api/v9/workspaces/${workspaceId}/tags/${tagId}`, req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tags.md#update-a-tag
 * @public
 * @param {Number|String} tagId Tag Id
 * @param {Number|String} workspaceId Workspace ID
 * @param {String} name New tag name
 * @param {Function} callback <code>(err, tag)</code>
 */
TogglClient.prototype.updateTagName = function updateTagName(tagId, workspaceId, name,
  callback) {
  var tag = {
    name: name
  };

  var req = {
    method: 'PUT',
    body: {
      tag: tag
    }
  };

  return this.apiRequest(`/api/v9/workspaces/${workspaceId}/tags/${tagId}`, req,
    utils.wrapDataCallback(callback));
};
