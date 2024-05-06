'use strict';

const TogglClient = require('../client');

/**
 * GET Tags
 * @see https://engineering.toggl.com/docs/api/tags#get-tags
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Function} callback <code>(err, tag)</code>
 */
TogglClient.prototype.getTags = function (workspaceId, callback) {
  return this.apiRequest(`workspaces/${workspaceId}/tags`, {}, callback);
};


/**
 * POST Create tag
 * @see https://engineering.toggl.com/docs/api/tags#post-create-tag
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {String} name Tag name
 * @param {Function} callback <code>(err, tag)</code>
 */
TogglClient.prototype.createTag = function (workspaceId, name, callback) {
  const req = {
    method: 'POST',
    body: { name }
  }
  return this.apiRequest(`workspaces/${workspaceId}/tags`, req, callback);
};


/**
 * DELETE Delete tag
 * @see https://engineering.toggl.com/docs/api/tags#delete-delete-tag
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} tagId Tag Id
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteTag = function (workspaceId, tagId, callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(`workspaces/${workspaceId}/tags/${tagId}`, req, callback);
};


/**
 * PUT Update tag
 * @see https://engineering.toggl.com/docs/api/tags#put-update-tag
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} tagId Tag Id
 * @param {String} name New tag name
 * @param {Function} callback <code>(err, tag)</code>
 */
TogglClient.prototype.updateTagName = function (workspaceId, tagId, name,
  callback) {
  const req = {
    method: 'PUT',
    body: { name }
  };

  return this.apiRequest(`workspaces/${workspaceId}/tags/${tagId}`, req, callback);
};

/**
 * @see {@link TogglClient#updateTimeEntriesTags}
 * @public
 */
TogglClient.prototype.addTimeEntryTags = function (workspaceId, teId, tags, callback) {
  this.updateTimeEntryTags(workspaceId, teId, tags, 'add', callback);
};

/**
 * @see {@link TogglClient#updateTimeEntriesTags}
 * @public
 */
TogglClient.prototype.removeTimeEntryTags = function (workspaceId, teId, tags, callback) {
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
TogglClient.prototype.updateTimeEntryTags = function (workspaceId, teId, tags, action, callback) {
  return this.updateTimeEntry(workspaceId, teId, { tags, tag_action: action }, callback);
};
