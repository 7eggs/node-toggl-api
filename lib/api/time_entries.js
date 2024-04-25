'use strict';

var TogglClient = require('../client');
var utils = require('../utils');


/**
 * @see {@link TogglClient#updateTimeEntriesTags}
 * @public
 */
TogglClient.prototype.addTimeEntryTags = function addTimeEntryTags(workspaceId, teId,
  tags, callback) {
  this.updateTimeEntryTags(workspaceId, teId, tags, 'add', callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#create-a-time-entry
 * @public
 * @param {Object} data Time entry data
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.createTimeEntry = function createTimeEntry(data,
  callback) {
  data.created_with = TogglClient.USER_AGENT;
  data.duration = -1;

  const req = {
    method: 'POST',
    body: data
  };

  return this.apiRequest(`workspaces/${data.workspace_id}/time_entries`,
    req,
    utils.wrapDataCallback(callback))
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#delete-a-time-entry
 * @public
 * @param {Number|String} workspaceId Workspace Id
 * @param {Number|String} teId Time entry Id
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteTimeEntry = function deleteTimeEntry(workspaceId, teId,
  callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(`workspaces/${workspaceId}/time_entries/${teId}`, req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#get-time-entry-details
 * @public
 * @param {Number|String} teId Time entry Id
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.getTimeEntryData = function getTimeEntryData(teId,
  callback) {
  return this.apiRequest('me/time_entries/' + teId, {},
    utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#get-time-entries-started-in-a-specific-time-range
 * @public
 * @param {String|Number|Date|moment} [startDate] Date range start
 * @param {String|Number|Date|moment} [endDate] Date range end
 * @param {Function} callback <code>(err, timeEntries)</code>
 */
TogglClient.prototype.getTimeEntries = function getTimeEntries(startDate,
  endDate, callback) {
  if (arguments.length === 1) {
    callback = startDate;
    startDate = null;
    endDate = null;
  }

  var qs = {};

  if (startDate) {
    qs.start_date = startDate;
  }
  if (endDate) {
    qs.end_date = endDate;
  }

  var req = {
    qs: qs
  };

  return this.apiRequest('me/time_entries', req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#get-running-time-entry
 * @public
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.getCurrentTimeEntry = function getCurrentTimeEntry(callback) {
  return this.apiRequest('me/time_entries/current', {},
    utils.wrapDataCallback(callback));
};


/**
 * @see {@link TogglClient#updateTimeEntriesTags}
 * @public
 */
TogglClient.prototype.removeTimeEntryTags = function removeTimeEntryTags(workspaceId, teId,
  tags, callback) {
  this.updateTimeEntryTags(workspaceId, teId, tags, 'remove', callback);
};


/**
 * Create time entry and start it
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#start-a-time-entry
 * @public
 * @param {Object} data Time entry data
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.startTimeEntry = function startTimeEntry(data, callback) {
  data.created_with = TogglClient.USER_AGENT;

  const req = {
    method: 'POST',
    body: data
  };

  return this.apiRequest(`workspaces/${data.workspace_id}/time_entries`,
    req,
    utils.wrapDataCallback(callback))
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#stop-a-time-entry
 * @public
 * @param {Number|String} workspaceId Workspace Id
 * @param {Number|String} teId Time entry Id
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.stopTimeEntry = function stopTimeEntry(workspaceId, teId, callback) {
  const req = {
    method: 'PATCH'
  };
  return this.apiRequest(`workspaces/${workspaceId}/time_entries/${teId}/stop`,
    req, utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#update-a-time-entry
 * @public
 * @param {Number|String} workspaceId Workspace Id
 * @param {Number|String} teId Time entry Id
 * @param {Object} data Update data
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.updateTimeEntry = function updateTimeEntry(workspaceId, teId, data,
  callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(`workspaces/${workspaceId}/time_entries/${teId}`, req,
    utils.wrapDataCallback(callback));
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
TogglClient.prototype.updateTimeEntryTags = function updateTimeEntryTags(workspaceId, teId,
  tags, action, callback) {

  var req = {
    method: 'PUT',
    body: {
      tag_action: action,
      tags: tags
    }
  }
  return this.apiRequest(`workspaces/${workspaceId}/time_entries/${teId}`, req,
    utils.wrapDataCallback(callback));
};
