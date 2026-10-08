'use strict';

const TogglClient = require('../client');
const utils = require('../utils');
const path = utils.path;


/**
 * GET Tags
 *
 * @see https://engineering.toggl.com/docs/track/api/tags#get-tags
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} [options] <code>page</code>, <code>per_page</code>, <code>search</code>
 * @param {Function} [callback] <code>(err, tags)</code>
 */
TogglClient.prototype.getTags = function getTags(workspaceId, options,
  callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest(path`workspaces/${workspaceId}/tags`,
    { qs: options }, callback);
};


/**
 * POST Create tag
 *
 * @see https://engineering.toggl.com/docs/track/api/tags#post-create-tag
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {String} name Tag name
 * @param {Function} [callback] <code>(err, tag)</code>
 */
TogglClient.prototype.createTag = function createTag(workspaceId, name,
  callback) {
  const req = {
    method: 'POST',
    body: { name: name }
  };

  return this.apiRequest(path`workspaces/${workspaceId}/tags`, req, callback);
};


/**
 * PUT Update tag
 *
 * @see https://engineering.toggl.com/docs/track/api/tags#put-update-tag
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} tagId Tag ID
 * @param {String} name New tag name
 * @param {Function} [callback] <code>(err, tag)</code>
 */
TogglClient.prototype.updateTagName = function updateTagName(workspaceId,
  tagId, name, callback) {
  const req = {
    method: 'PUT',
    body: { name: name }
  };

  return this.apiRequest(path`workspaces/${workspaceId}/tags/${tagId}`, req,
    callback);
};


/**
 * DELETE Delete tag
 *
 * @see https://engineering.toggl.com/docs/track/api/tags#delete-delete-tag
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} tagId Tag ID
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.deleteTag = function deleteTag(workspaceId, tagId,
  callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(path`workspaces/${workspaceId}/tags/${tagId}`, req,
    callback);
};


/**
 * Adds or removes tags of a single time entry. Tags that don't exist yet
 * are created.
 *
 * @see https://engineering.toggl.com/docs/track/api/time_entries#put-timeentries
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} teId Time entry ID
 * @param {String[]} tags Tag names
 * @param {String} action <code>'add'</code> or <code>'delete'</code>
 * @param {Function} [callback] <code>(err, timeEntry)</code>
 */
TogglClient.prototype.updateTimeEntryTags = function updateTimeEntryTags(
  workspaceId, teId, tags, action, callback) {
  return this.updateTimeEntry(workspaceId, teId,
    { tags: tags, tag_action: action }, callback);
};


/**
 * @see {@link TogglClient#updateTimeEntryTags}
 * @public
 */
TogglClient.prototype.addTimeEntryTags = function addTimeEntryTags(
  workspaceId, teId, tags, callback) {
  return this.updateTimeEntryTags(workspaceId, teId, tags, 'add', callback);
};


/**
 * @see {@link TogglClient#updateTimeEntryTags}
 * @public
 */
TogglClient.prototype.removeTimeEntryTags = function removeTimeEntryTags(
  workspaceId, teId, tags, callback) {
  return this.updateTimeEntryTags(workspaceId, teId, tags, 'delete', callback);
};


/**
 * Adds, removes or replaces tags of several time entries at once.
 *
 * @see https://engineering.toggl.com/docs/track/api/time_entries#patch-bulk-editing-time-entries
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number[]|String[]} teIds Time entry IDs
 * @param {String[]} tags Tag names
 * @param {String} action <code>'add'</code>, <code>'remove'</code> or <code>'replace'</code>
 * @param {Function} [callback] <code>(err, result)</code>
 */
TogglClient.prototype.updateTimeEntriesTags = function updateTimeEntriesTags(
  workspaceId, teIds, tags, action, callback) {
  const operations = [{
    op: action,
    path: '/tags',
    value: tags
  }];

  return this.updateTimeEntries(workspaceId, teIds, operations, callback);
};


/**
 * @see {@link TogglClient#updateTimeEntriesTags}
 * @public
 */
TogglClient.prototype.addTimeEntriesTags = function addTimeEntriesTags(
  workspaceId, teIds, tags, callback) {
  return this.updateTimeEntriesTags(workspaceId, teIds, tags, 'add', callback);
};


/**
 * @see {@link TogglClient#updateTimeEntriesTags}
 * @public
 */
TogglClient.prototype.removeTimeEntriesTags = function removeTimeEntriesTags(
  workspaceId, teIds, tags, callback) {
  return this.updateTimeEntriesTags(workspaceId, teIds, tags, 'remove',
    callback);
};
