'use strict';

var TogglClient = require('../client');
var utils = require('../utils');


/**
 * @see {@link TogglClient#updateTimeEntriesTags}
 * @public
 */
TogglClient.prototype.addTimeEntriesTags = function addTimeEntriesTags(teIds,
  tags, callback) {
  this.updateTimeEntriesTags(teIds, tags, 'add', callback);
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

  if (!this.validateOptions('time-entry-create', data, callback)) {
    return;
  }

  var req = {
    method: 'POST',
    body: {
      time_entry: data
    }
  };

  this.apiRequest('/api/v8/time_entries', req,
    utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#delete-a-time-entry
 * @public
 * @param {Number|String} teId Time entry Id
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteTimeEntry = function deleteTimeEntry(teId,
  callback) {
  var req = {
    method: 'DELETE'
  };

  this.apiRequest('/api/v8/time_entries/' + teId, req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#get-time-entry-details
 * @public
 * @param {Number|String} teId Time entry Id
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.getTimeEntryData = function getTimeEntryData(teId,
  callback) {
  this.apiRequest('/api/v8/time_entries/' + teId, {},
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

  if (!this.validateOptions('time-entry-get-timerange', qs, callback)) {
    return;
  }

  var req = {
    qs: qs
  };

  this.apiRequest('/api/v8/time_entries', req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#get-running-time-entry
 * @public
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.getCurrentTimeEntry = function getCurrentTimeEntry(callback) {
  this.apiRequest('/api/v8/time_entries/current', {},
    utils.wrapDataCallback(callback));
};


/**
 * @see {@link TogglClient#updateTimeEntriesTags}
 * @public
 */
TogglClient.prototype.removeTimeEntriesTags = function removeTimeEntriesTags(teIds,
  tags, callback) {
  this.updateTimeEntriesTags(teIds, tags, 'remove', callback);
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

  var req = {
    method: 'POST',
    body: {
      time_entry: data
    }
  };

  this.apiRequest('/api/v8/time_entries/start', req,
    utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#stop-a-time-entry
 * @public
 * @param {Number|String} teId Time entry Id
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.stopTimeEntry = function stopTimeEntry(teId, callback) {
  var req = {
    method: 'PUT'
  };

  this.apiRequest('/api/v8/time_entries/' + teId + '/stop', req,
    utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#update-a-time-entry
 * @public
 * @param {Number|String} teId Time entry Id
 * @param {Object} data Update data
 * @param {Function} callback <code>(err, timeEntry)</code>
 */
TogglClient.prototype.updateTimeEntry = function updateTimeEntry(teId, data,
  callback) {
  var req = {
    method: 'PUT',
    body: {
      time_entry: data
    }
  };

  this.apiRequest('/api/v8/time_entries/' + teId, req,
    utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#bulk-update-time-entries-tags
 * @public
 * @param {Number[]|String[]} teIds Time entries Ids
 * @param {String[]} tags Tags to add/remove
 * @param {String} action 'add' or 'remove'
 * @param {Function} callback <code>(err, timeEntries)</code>
 */
TogglClient.prototype.updateTimeEntriesTags = function updateTimeEntriesTags(teIds,
  tags, action, callback) {
  var body = {
    tag_action: action,
    tags: tags
  };

  if (!this.validateOptions('time-entry-update-tags', body, callback)) {
    return;
  }

  var req = {
    method: 'PUT',
    body: {
      time_entry: body
    }
  };

  this.apiRequest('/api/v8/time_entries/' + teIds.join(), req,
    utils.wrapDataCallback(callback));
};
