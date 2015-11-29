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
    wid: workspaceId
  };

  if (!this.validateOptions('tag-create', tag, callback)) {
    return;
  }

  var req = {
    method: 'POST',
    body: {
      tag: tag
    }
  };

  this.apiRequest('/api/v8/tags', req, utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tags.md#delete-a-tag
 * @public
 * @param {Number|String} tagId Tag Id
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteTag = function deleteTag(tagId, callback) {
  var req = {
    method: 'DELETE'
  };

  this.apiRequest('/api/v8/tags/' + tagId, req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tags.md#update-a-tag
 * @public
 * @param {Number|String} tagId Tag Id
 * @param {String} name New tag name
 * @param {Function} callback <code>(err, tag)</code>
 */
TogglClient.prototype.updateTagName = function updateTagName(tagId, name,
  callback) {
  var tag = {
    name: name
  };

  if (!this.validateOptions('tag-update', tag, callback)) {
    return;
  }

  var req = {
    method: 'PUT',
    body: {
      tag: tag
    }
  };

  this.apiRequest('/api/v8/tags/' + tagId, req,
    utils.wrapDataCallback(callback));
};
