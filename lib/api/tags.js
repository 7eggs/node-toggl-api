'use strict';

const TogglClient = require('../client');

/**
 * GET Tags
 * @see https://engineering.toggl.com/docs/api/tags#get-tags
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Function} callback <code>(err, tag)</code>
 */
TogglClient.prototype.getTags = function getTags(workspaceId, callback) {
  return this.apiRequest(`workspaces/${workspaceId}/tags`, {}, callback);
};


/**
 * POST Create tag
 * @see https://engineering.toggl.com/docs/api/tags#post-create-tag
 * @public
 * @param {String} name Tag name
 * @param {Number|String} workspaceId Workspace ID
 * @param {Function} callback <code>(err, tag)</code>
 */
TogglClient.prototype.createTag = function createTag(name, workspaceId, callback) {
  const req = {
    method: 'POST',
    body: { name }
  }
  return this.apiRequest(`workspaces/${workspaceId}/tags`, req, callback);
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

  return this.apiRequest(`workspaces/${workspaceId}/tags/${tagId}`, req, callback);
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

  return this.apiRequest(`workspaces/${workspaceId}/tags/${tagId}`, req, callback);
};

/**
 * @see {@link TogglClient#updateTimeEntriesTags}
 * @public
 */
TogglClient.prototype.addTimeEntryTags = function addTimeEntryTags(workspaceId, teId, tags, callback) {
  this.updateTimeEntryTags(workspaceId, teId, tags, 'add', callback);
};

/**
 * @see {@link TogglClient#updateTimeEntriesTags}
 * @public
 */
TogglClient.prototype.removeTimeEntryTags = function removeTimeEntryTags(workspaceId, teId, tags, callback) {
  this.updateTimeEntryTags(workspaceId, teId, tags, 'remove', callback);
};

/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#bulk-update-time-entries-tags
 * @public
 * @param {Number|String} workspaceId Workspace Id
 * @param {Number[]|String[]} teId Time entries Ids
 * @param {String[]} tags Tags to add/remove
 * @param {String} action 'add' or 'remove'
 * @param {Function} callback <code>(err, timeEntries)</code>
 */
TogglClient.prototype.updateTimeEntryTags = function updateTimeEntryTags(workspaceId, teId, tags, action, callback) {

  var req = {
    method: 'PUT',
    body: {
      tag_action: action,
      tags: tags
    }
  }
  return this.apiRequest(`workspaces/${workspaceId}/time_entries/${teId}`, req, callback);
};
