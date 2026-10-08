'use strict';

const TogglClient = require('../client');
const utils = require('../utils');
const path = utils.path;


/**
 * POST Search time entries: detailed report. Resolves with the first page
 * of rows; use {@link TogglClient#detailedReportPage} to paginate.
 *
 * @see https://engineering.toggl.com/docs/track/reports/detailed_reports#post-search-time-entries
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} options Filters: <code>start_date</code>, <code>end_date</code>,
 *   <code>project_ids</code>, <code>user_ids</code>, <code>page_size</code>,
 *   <code>first_row_number</code>, <code>grouped</code>, ...
 * @param {Function} [callback] <code>(err, rows)</code>
 */
TogglClient.prototype.detailedReport = function detailedReport(workspaceId,
  options, callback) {
  return reportsPost(this, path`workspace/${workspaceId}/search/time_entries`,
    options, callback);
};


/**
 * Detailed report page, with what is needed to load the next one.
 * Resolves with <code>{data, nextId, nextRowNumber}</code>; when
 * <code>nextRowNumber</code> is not null, pass it as
 * <code>first_row_number</code> to get the next page.
 *
 * @see https://engineering.toggl.com/docs/track/reports_start#detailed-reports
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} options See {@link TogglClient#detailedReport}
 * @param {Function} [callback] <code>(err, page)</code>
 */
TogglClient.prototype.detailedReportPage = function detailedReportPage(
  workspaceId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  const req = {
    method: 'POST',
    body: options,
    raw: true
  };

  const promise = this.reportsRequest(
    path`workspace/${workspaceId}/search/time_entries`, req).then(res => ({
      data: res.data,
      nextId: toNumber(res.headers.get('X-Next-ID')),
      nextRowNumber: toNumber(res.headers.get('X-Next-Row-Number'))
    }));

  return utils.callbackify(promise, callback);
};


/**
 * POST Load totals detailed report
 *
 * @see https://engineering.toggl.com/docs/track/reports/detailed_reports#post-load-totals-detailed-report
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} options Filters, plus <code>granularity</code>, <code>with_graph</code>, ...
 * @param {Function} [callback] <code>(err, totals)</code>
 */
TogglClient.prototype.detailedReportTotals = function detailedReportTotals(
  workspaceId, options, callback) {
  return reportsPost(this,
    path`workspace/${workspaceId}/search/time_entries/totals`, options,
    callback);
};


/**
 * POST Search time entries: summary report.
 *
 * @see https://engineering.toggl.com/docs/track/reports/summary_reports#post-search-time-entries
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} options Filters, plus <code>grouping</code>, <code>sub_grouping</code>, ...
 * @param {Function} [callback] <code>(err, report)</code>
 */
TogglClient.prototype.summaryReport = function summaryReport(workspaceId,
  options, callback) {
  return reportsPost(this, path`workspace/${workspaceId}/summary/time_entries`,
    options, callback);
};


/**
 * POST Load project summary
 *
 * @see https://engineering.toggl.com/docs/track/reports/summary_reports#post-load-project-summary
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} projectId Project ID
 * @param {Object} [options] <code>start_date</code>, <code>end_date</code>
 * @param {Function} [callback] <code>(err, summary)</code>
 */
TogglClient.prototype.projectSummaryReport = function projectSummaryReport(
  workspaceId, projectId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return reportsPost(this,
    path`workspace/${workspaceId}/projects/${projectId}/summary`, options,
    callback);
};


/**
 * POST Search time entries: weekly report.
 *
 * @see https://engineering.toggl.com/docs/track/reports/weekly_reports#post-search-time-entries
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} options Filters: <code>start_date</code>, <code>end_date</code>, ...
 * @param {Function} [callback] <code>(err, report)</code>
 */
TogglClient.prototype.weeklyReport = function weeklyReport(workspaceId,
  options, callback) {
  return reportsPost(this, path`workspace/${workspaceId}/weekly/time_entries`,
    options, callback);
};


/**
 * POST Load the previously saved report
 *
 * @see https://engineering.toggl.com/docs/track/reports/saved_reports#post-load-the-previously-saved-report
 * @public
 * @param {String} reportToken Saved report token
 * @param {Object} [options] Filters overriding the saved ones
 * @param {Function} [callback] <code>(err, report)</code>
 */
TogglClient.prototype.savedReport = function savedReport(reportToken, options,
  callback) {
  [options, callback] = utils.optional(options, callback, {});

  return reportsPost(this, path`shared/${reportToken}`, options, callback);
};


/**
 * POST Export detailed report. Resolves with the file as a Buffer.
 *
 * @see https://engineering.toggl.com/docs/track/reports/detailed_reports#post-export-detailed-report
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {String} format <code>'csv'</code>, <code>'xlsx'</code> or <code>'pdf'</code>
 * @param {Object} options See {@link TogglClient#detailedReport}
 * @param {Function} [callback] <code>(err, buffer)</code>
 */
TogglClient.prototype.exportDetailedReport = function exportDetailedReport(
  workspaceId, format, options, callback) {
  return reportsExport(this,
    path`workspace/${workspaceId}/search/time_entries.${format}`, options,
    callback);
};


/**
 * POST Export summary report. Resolves with the file as a Buffer.
 *
 * @see https://engineering.toggl.com/docs/track/reports/summary_reports#post-export-summary-report
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {String} format <code>'csv'</code>, <code>'xlsx'</code> or <code>'pdf'</code>
 * @param {Object} options See {@link TogglClient#summaryReport}
 * @param {Function} [callback] <code>(err, buffer)</code>
 */
TogglClient.prototype.exportSummaryReport = function exportSummaryReport(
  workspaceId, format, options, callback) {
  return reportsExport(this,
    path`workspace/${workspaceId}/summary/time_entries.${format}`, options,
    callback);
};


/**
 * POST Export weekly report. Resolves with the file as a Buffer.
 *
 * @see https://engineering.toggl.com/docs/track/reports/weekly_reports#post-export-weekly-report
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {String} format <code>'csv'</code> or <code>'pdf'</code>
 * @param {Object} options See {@link TogglClient#weeklyReport}
 * @param {Function} [callback] <code>(err, buffer)</code>
 */
TogglClient.prototype.exportWeeklyReport = function exportWeeklyReport(
  workspaceId, format, options, callback) {
  return reportsExport(this,
    path`workspace/${workspaceId}/weekly/time_entries.${format}`, options,
    callback);
};


function reportsPost(client, reportPath, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  const req = {
    method: 'POST',
    body: options
  };

  return client.reportsRequest(reportPath, req, callback);
}


function reportsExport(client, reportPath, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  const req = {
    method: 'POST',
    body: options,
    binary: true
  };

  return client.reportsRequest(reportPath, req, callback);
}


function toNumber(header) {
  return header === null || header === '' ? null : Number(header);
}
