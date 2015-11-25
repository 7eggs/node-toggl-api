'use strict'

var TogglClient = require('../client')
  , util = require('util')
  , ValidateError = require('../errors').ValidateError
  , subgrouping




/**
 * Valid subgrouping values for grouping values
 */
subgrouping = {
  'projects': ['time_entries', 'tasks', 'users'],
  'clients':  ['time_entries', 'tasks', 'projects', 'users'],
  'users':    ['time_entries', 'tasks', 'projects', 'clients']
}




/**
 * Check if subgrouping parameter is valid for grouping parameter
 *
 * @param {object} opts Request options
 * @param {function} callback Request callback
 * @returns {boolean}
 */
function checkSummaryGrouping(opts, callback) {
  var grouping = opts.grouping || 'projects'
    , sub = opts.subgrouping || 'time_entries'
    , validValues = subgrouping[grouping]

  if (!~validValues.indexOf(sub)) {
    var msg = util.format('Subgrouping value %s does not match any of allowed: %s', sub, validValues.join(', '))
    callback(new ValidateError(msg, validValues, sub))

    return false
  }

  return true
}




/**
 * Get detailed report
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/reports/detailed.md
 * @public
 * @param {object} opts Request options
 * @param {function} callback Accepts arguments: (err, report)
 */
TogglClient.prototype.detailedReport = function(opts, callback) {
  if (!this.validateOptions('report-detailed', opts, callback)) {
    return
  }

  this.reportsRequest('/api/v2/details', {qs: opts}, callback)
}




/**
 * Get summary report
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/reports/summary.md
 * @public
 * @param {object} opts Request options
 * @param {function} callback Accepts arguments: (err, report)
 */
TogglClient.prototype.summaryReport = function(opts, callback) {
  if (!this.validateOptions('report-summary', opts, callback)) {
    return
  }

  if (!checkSummaryGrouping(opts, callback)) {
    return
  }

  this.reportsRequest('/api/v2/summary', {qs: opts}, callback)
}




/**
 * Get weekly report
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/reports/weekly.md
 * @public
 * @param {object} opts Request options
 * @param {function} callback Accepts arguments: (err, report)
 */
TogglClient.prototype.weeklyReport = function(opts, callback) {
  if (!this.validateOptions('report-weekly', opts, callback)) {
    return
  }

  this.reportsRequest('/api/v2/weekly', {qs: opts}, callback)
}