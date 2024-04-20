'use strict';

var TogglClient = require('../client');

/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/reports/detailed.md
 * @public
 * @param {Object} opts Request options
 * @param {Function} callback <code>(err, report)</code>
 */
TogglClient.prototype.detailedReport = function detailedReport(opts, callback) {
  this.reportsRequest('/details', { qs: opts }, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/reports/summary.md
 * @public
 * @param {Object} opts Request options
 * @param {Function} callback <code>(err, report)</code>
 */
TogglClient.prototype.summaryReport = function summaryReport(opts, callback) {
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
  this.reportsRequest('/api/v2/weekly', { qs: opts }, callback);
};
