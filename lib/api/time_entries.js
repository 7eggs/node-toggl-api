'use strict';

const TogglClient = require('../client');
const utils = require('../utils');
const path = utils.path;


/**
 * GET TimeEntries: time entries of the current user. Without filters the
 * API returns the entries of the last 9 days.
 *
 * For backwards compatibility it can also be called as
 * <code>getTimeEntries(startDate, endDate, callback)</code>.
 *
 * @see https://engineering.toggl.com/docs/track/api/time_entries#get-timeentries
 * @public
 * @param {Object} [options] Filters: <code>start_date</code>, <code>end_date</code>
 *   (YYYY-MM-DD or RFC 3339), <code>since</code>, <code>before</code>,
 *   <code>meta</code>, <code>include_sharing</code>
 * @param {Function} [callback] <code>(err, timeEntries)</code>
 */
TogglClient.prototype.getTimeEntries = function getTimeEntries(options,
  endDate, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  else if (typeof endDate === 'function') {
    callback = endDate;
    endDate = undefined;
  }

  let qs;
  if (isDateLike(options) || isDateLike(endDate)) {
    qs = { start_date: toDate(options), end_date: toDate(endDate) };
  }
  else {
    qs = options || {};
  }

  return this.apiRequest('me/time_entries', { qs: qs }, callback);
};


/**
 * GET Get current time entry. Resolves with <code>null</code> when no time
 * entry is running.
 *
 * @see https://engineering.toggl.com/docs/track/api/time_entries#get-get-current-time-entry
 * @public
 * @param {Function} [callback] <code>(err, timeEntry)</code>
 */
TogglClient.prototype.getCurrentTimeEntry = function getCurrentTimeEntry(
  callback) {
  return this.apiRequest('me/time_entries/current', {}, callback);
};


/**
 * GET Get a time entry by ID.
 *
 * @see https://engineering.toggl.com/docs/track/api/time_entries#get-get-a-time-entry-by-id
 * @public
 * @param {Number|String} teId Time entry ID
 * @param {Object} [options] <code>meta</code>, <code>include_sharing</code>
 * @param {Function} [callback] <code>(err, timeEntry)</code>
 */
TogglClient.prototype.getTimeEntryData = function getTimeEntryData(teId,
  options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest(path`me/time_entries/${teId}`, { qs: options },
    callback);
};


/**
 * POST TimeEntries: starts a new running time entry in
 * <code>data.workspace_id</code> (or <code>data.wid</code>).
 *
 * <code>start</code> defaults to now and <code>created_with</code> to this
 * library. The duration is always -1, which is how v9 marks running entries.
 *
 * @see https://engineering.toggl.com/docs/track/api/time_entries#post-timeentries
 * @public
 * @param {Object} data Time entry data
 * @param {Function} [callback] <code>(err, timeEntry)</code>
 */
TogglClient.prototype.startTimeEntry = function startTimeEntry(data,
  callback) {
  const body = Object.assign({
    created_with: TogglClient.USER_AGENT,
    start: new Date().toISOString()
  }, data, { duration: -1 });

  return postTimeEntry(this, body, callback);
};


/**
 * POST TimeEntries: creates a finished time entry in
 * <code>data.workspace_id</code> (or <code>data.wid</code>).
 * Give <code>start</code> and either <code>duration</code> (seconds) or
 * <code>stop</code>. <code>created_with</code> defaults to this library.
 *
 * @see https://engineering.toggl.com/docs/track/api/time_entries#post-timeentries
 * @public
 * @param {Object} data Time entry data
 * @param {Function} [callback] <code>(err, timeEntry)</code>
 */
TogglClient.prototype.createTimeEntry = function createTimeEntry(data,
  callback) {
  const body = Object.assign({ created_with: TogglClient.USER_AGENT }, data);

  return postTimeEntry(this, body, callback);
};


function postTimeEntry(client, body, callback) {
  const workspaceId = body.workspace_id || body.wid;
  body.workspace_id = workspaceId;

  const req = {
    method: 'POST',
    body: body
  };

  return client.apiRequest(path`workspaces/${workspaceId}/time_entries`, req,
    callback);
}


/**
 * PUT TimeEntries
 *
 * @see https://engineering.toggl.com/docs/track/api/time_entries#put-timeentries
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} teId Time entry ID
 * @param {Object} data Update data
 * @param {Function} [callback] <code>(err, timeEntry)</code>
 */
TogglClient.prototype.updateTimeEntry = function updateTimeEntry(workspaceId,
  teId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(path`workspaces/${workspaceId}/time_entries/${teId}`,
    req, callback);
};


/**
 * PATCH Bulk editing time entries, with JSON Patch operations such as
 * <code>{op: 'replace', path: '/description', value: 'New'}</code>.
 * Resolves with <code>{success: [ids], failure: [...]}</code>.
 *
 * @see https://engineering.toggl.com/docs/track/api/time_entries#patch-bulk-editing-time-entries
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number[]|String[]} teIds Time entry IDs
 * @param {Object[]} operations JSON Patch operations
 * @param {Function} [callback] <code>(err, result)</code>
 */
TogglClient.prototype.updateTimeEntries = function updateTimeEntries(
  workspaceId, teIds, operations, callback) {
  const req = {
    method: 'PATCH',
    body: operations
  };

  return this.apiRequest(path`workspaces/${workspaceId}/time_entries/${teIds}`,
    req, callback);
};


/**
 * DELETE TimeEntries
 *
 * @see https://engineering.toggl.com/docs/track/api/time_entries#delete-timeentries
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} teId Time entry ID
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.deleteTimeEntry = function deleteTimeEntry(workspaceId,
  teId, callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(path`workspaces/${workspaceId}/time_entries/${teId}`,
    req, callback);
};


/**
 * PATCH Stop TimeEntry
 *
 * @see https://engineering.toggl.com/docs/track/api/time_entries#patch-stop-timeentry
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} teId Time entry ID
 * @param {Function} [callback] <code>(err, timeEntry)</code>
 */
TogglClient.prototype.stopTimeEntry = function stopTimeEntry(workspaceId, teId,
  callback) {
  const req = {
    method: 'PATCH'
  };

  return this.apiRequest(
    path`workspaces/${workspaceId}/time_entries/${teId}/stop`, req, callback);
};


function isDateLike(value) {
  return typeof value === 'string' || typeof value === 'number' ||
    value instanceof Date;
}


function toDate(value) {
  return typeof value === 'number' ? new Date(value) : value;
}
