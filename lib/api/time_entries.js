'use strict'

var TogglClient = require('../client')
  , utils = require('../utils')




/**
 * Add time entries tags
 *
 * @see {@link TogglClient#updateTimeEntriesTags}
 * @public
 */
TogglClient.prototype.addTimeEntriesTags = function(teIds, tags, callback) {
  this.updateTimeEntriesTags(teIds, tags, 'add', callback)
}




/**
 * Create time entry
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#create-a-time-entry
 * @public
 * @param {object} data Time entry data
 * @param {function} callback Accepts arguments: (err, timeEntry)
 */
TogglClient.prototype.createTimeEntry = function(data, callback) {
  data.created_with = TogglClient.USER_AGENT

  if (!this.validateOptions('time-entry-create', data, callback)) {
    return
  }

  var req = {
    method: 'POST',
    body:   {
      time_entry: data
    }
  }

  this.apiRequest('/api/v8/time_entries', req, utils.wrapDataCallback(callback))
}




/**
 * Delete time entry
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#delete-a-time-entry
 * @public
 * @param {number|string} teId Time entry Id
 * @param {function} callback Accepts arguments: (err)
 */
TogglClient.prototype.deleteTimeEntry = function(teId, callback) {
  var req = {
    method: 'DELETE'
  }

  this.apiRequest('/api/v8/time_entries/' + teId, req, callback)
}




/**
 * Get time entry details
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#get-time-entry-details
 * @public
 * @param {number|string} teId Time entry Id
 * @param {function} callback Accepts arguments: (err, timeEntry)
 */
TogglClient.prototype.getTimeEntryData = function(teId, callback) {
  this.apiRequest('/api/v8/time_entries/' + teId, {}, utils.wrapDataCallback(callback))
}




/**
 * Get time entries started in a specific time range
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#get-time-entries-started-in-a-specific-time-range
 * @public
 * @param {string|number|Date|moment} [startDate] Date range start
 * @param {string|number|Date|moment} [endDate] Date range end
 * @param {function} callback Accepts arguments(err, timeEntries)
 */
TogglClient.prototype.getTimeEntries = function(startDate, endDate, callback) {
  if (arguments.length === 1) {
    callback = startDate
    startDate = null
    endDate = null
  }

  var qs = {}

  if (startDate) {
    qs.start_date = startDate
  }
  if (endDate) {
    qs.end_date = endDate
  }

  if (!this.validateOptions('time-entry-get-timerange', qs, callback)) {
    return
  }

  var req = {
    qs: qs
  }

  this.apiRequest('/api/v8/time_entries', req, callback)
}




/**
 * Get current running time entry
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#get-running-time-entry
 * @public
 * @param {function} callback Accepts arguments: (err, timeEntry)
 */
TogglClient.prototype.getCurrentTimeEntry = function(callback) {
  this.apiRequest('/api/v8/time_entries/current', {}, utils.wrapDataCallback(callback))
}




/**
 * Remove time entries tags
 *
 * @see {@link TogglClient#updateTimeEntriesTags}
 * @public
 */
TogglClient.prototype.removeTimeEntriesTags = function(teIds, tags, callback) {
  this.updateTimeEntriesTags(teIds, tags, 'remove', callback)
}




/**
 * Create time entry and start it
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#start-a-time-entry
 * @public
 * @param {object} data Time entry data
 * @param {function} callback Accepts arguments: (err, timeEntry)
 */
TogglClient.prototype.startTimeEntry = function(data, callback) {
  data.created_with = TogglClient.USER_AGENT

  var req = {
    method: 'POST',
    body:   {
      time_entry: data
    }
  }

  this.apiRequest('/api/v8/time_entries/start', req, utils.wrapDataCallback(callback))
}




/**
 * Stop time entry
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#stop-a-time-entry
 * @public
 * @param {number|string} teId Time entry Id
 * @param {function} callback Accepts arguments: (err, timeEntry)
 */
TogglClient.prototype.stopTimeEntry = function(teId, callback) {
  var req = {
    method: 'PUT'
  }

  this.apiRequest('/api/v8/time_entries/' + teId + '/stop', req, utils.wrapDataCallback(callback))
}




/**
 * Update time entry
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#update-a-time-entry
 * @public
 * @param {number|string} teId Time entry Id
 * @param {object} data Update data
 * @param {function} callback Accepts arguments: (err, timeEntry)
 */
TogglClient.prototype.updateTimeEntry = function(teId, data, callback) {
  var req = {
    method: 'PUT',
    body:   {
      time_entry: data
    }
  }

  this.apiRequest('/api/v8/time_entries/' + teId, req, utils.wrapDataCallback(callback))
}




/**
 * Update time entries tags
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#bulk-update-time-entries-tags
 * @public
 * @param {number[]|string[]} teIds Time entries Ids
 * @param {string[]} tags Tags to add/remove
 * @param {string} action 'add' or 'remove'
 * @param {function} callback Accepts arguments: (err, timeEntries)
 */
TogglClient.prototype.updateTimeEntriesTags = function(teIds, tags, action, callback) {
  var body = {
    tag_action: action,
    tags:       tags
  }

  if (!this.validateOptions('time-entry-update-tags', body, callback)) {
    return
  }

  var req = {
    method: 'PUT',
    body:   {
      time_entry: body
    }
  }

  this.apiRequest('/api/v8/time_entries/' + teIds.join(), req, utils.wrapDataCallback(callback))
}