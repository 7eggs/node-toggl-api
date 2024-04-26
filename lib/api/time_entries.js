'use strict';

const TogglClient = require('../client');

/**
 * GET TimeEntries
 * @see https://engineering.toggl.com/docs/api/time_entries#get-timeentries
 * @public
 * @param {String|Number|Date|moment} [startDate] Date range start
 * @param {String|Number|Date|moment} [endDate] Date range end
 * @param {Function} callback <code>(err, timeEntries)</code>
 */
TogglClient.prototype.getTimeEntries = function getTimeEntries(startDate, endDate, callback) {
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
 * GET Get current time entry
 * @see https://engineering.toggl.com/docs/api/time_entries#get-get-current-time-entry
 * @public
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.getCurrentTimeEntry = function getCurrentTimeEntry(callback) {
  return this.apiRequest('me/time_entries/current', {}, callback);
};

/**
 * GET Get a time entry by ID.
 * @see https://engineering.toggl.com/docs/api/time_entries#get-get-a-time-entry-by-id
 * @public
 * @param {Number|String} teId Time entry Id
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.getTimeEntryData = function getTimeEntryData(teId, callback) {
  return this.apiRequest('me/time_entries/' + teId, {}, callback);
};

/**
 * POST TimeEntries
 * Create time entry and start it
 * @see https://engineering.toggl.com/docs/api/time_entries#post-timeentries
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

  return this.apiRequest(`workspaces/${data.workspace_id}/time_entries`, req, callback)
};

/**
 * Replaces the old Create time endpoint from V8
 * by using the same POST endpoint with duration = -1
 * @see {@link TogglClient#startTimeEntry}
 * @public
 * @param {Object} data Time entry data
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.createTimeEntry = function createTimeEntry(data, callback) {
  data.created_with = TogglClient.USER_AGENT;
  data.duration = -1;

  const req = {
    method: 'POST',
    body: data
  };

  return this.apiRequest(`workspaces/${data.workspace_id}/time_entries`,
    req,
    callback)
};

/**
 * PATCH Bulk editing time entries
 * @see https://engineering.toggl.com/docs/api/time_entries#patch-bulk-editing-time-entries
 * @param {Number} workspaceId Workspace Id
 * @param {Number[]} teIds Time entries Ids
 * @param {Object[]} array Update data
 */
TogglClient.prototype.updateTimeEntries = function updateTimeEntries(workspaceId, teIds, array, callback) {
  const req = {
    method: 'PATCH',
    body: array
  };
  return this.apiRequest(`workspaces/${workspaceId}/time_entries/${teIds.join()}`, req, callback);
};


/**
 * PUT TimeEntries
 * @see https://engineering.toggl.com/docs/api/time_entries#put-timeentries
 * @public
 * @param {Number|String} workspaceId Workspace Id
 * @param {Number|String} teId Time entry Id
 * @param {Object} data Update data
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.updateTimeEntry = function updateTimeEntry(workspaceId, teId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(`workspaces/${workspaceId}/time_entries/${teId}`, req, callback);
};

/**
 * DELETE TimeEntries
 * @see https://engineering.toggl.com/docs/api/time_entries#delete-timeentries
 * @public
 * @param {Number|String} workspaceId Workspace Id
 * @param {Number|String} teId Time entry Id
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteTimeEntry = function deleteTimeEntry(workspaceId, teId, callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(`workspaces/${workspaceId}/time_entries/${teId}`, req, callback);
};

/**
 * PATCH Stop TimeEntry
 * @see https://engineering.toggl.com/docs/api/time_entries#patch-stop-timeentry
 * @public
 * @param {Number|String} workspaceId Workspace Id
 * @param {Number|String} teId Time entry Id
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.stopTimeEntry = function stopTimeEntry(workspaceId, teId, callback) {
  const req = {
    method: 'PATCH'
  };
  return this.apiRequest(`workspaces/${workspaceId}/time_entries/${teId}/stop`, req, callback);
};