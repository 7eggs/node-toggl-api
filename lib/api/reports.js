'use strict';

var TogglClient = require('../client');
var util = require('util');
var ValidateError = require('../errors').ValidateError;
var SUBGROUPING = {
  projects: ['time_entries', 'tasks', 'users'],
  clients: ['time_entries', 'tasks', 'projects', 'users'],
  users: ['time_entries', 'tasks', 'projects', 'clients']
};


/**
 * @param {Object} opts Request options
 * @param {Function} callback Request callback
 * @returns {boolean}
 */
function checkSummaryGrouping(opts, callback) {
  var grouping = opts.grouping || 'projects';
  var sub = opts.subgrouping || 'time_entries';
  var validValues = SUBGROUPING[grouping];

  if (!~validValues.indexOf(sub)) {
    var msg = util.format(
      'Subgrouping value %s does not match any of allowed: %s', sub,
      validValues.join(', '));
    callback(new ValidateError(msg, validValues, sub));

    return false;
  }

  return true;
}


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/reports/detailed.md
 * @public
 * @param {Object} opts Request options
 * @param {Function} callback <code>(err, report)</code>
 */
TogglClient.prototype.detailedReport = function detailedReport(opts, callback) {
  if (!this.validateOptions('report-detailed', opts, callback)) {
    return;
  }

  this.reportsRequest('/api/v2/details', { qs: opts }, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/reports/summary.md
 * @public
 * @param {Object} opts Request options
 * @param {Function} callback <code>(err, report)</code>
 */
TogglClient.prototype.summaryReport = function summaryReport(opts, callback) {
  if (!this.validateOptions('report-summary', opts, callback)) {
    return;
  }

  if (!checkSummaryGrouping(opts, callback)) {
    return;
  }

  this.reportsRequest('/api/v2/summary', { qs: opts }, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/reports/weekly.md
 * @public
 * @param {Object} opts Request options
 * @param {Function} callback <code>(err, report)</code>
 */
TogglClient.prototype.weeklyReport = function weeklyReport(opts, callback) {
  if (!this.validateOptions('report-weekly', opts, callback)) {
    return;
  }

  this.reportsRequest('/api/v2/weekly', { qs: opts }, callback);
};
