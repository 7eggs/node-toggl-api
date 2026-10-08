'use strict';

const TogglClient = require('../client');
const utils = require('../utils');
const path = utils.path;


/**
 * GET Get last activity for every workspace user
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#get-get-last-activity-for-every-workspace-user
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} [options] <code>since</code> (UNIX timestamp)
 * @param {Function} [callback] <code>(err, activity)</code>
 */
TogglClient.prototype.getDashboard = function getDashboard(workspaceId,
  options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest(
    path`workspaces/${workspaceId}/dashboard/all_activity`, { qs: options },
    callback);
};


/**
 * GET Get most active users
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#get-get-most-active-users
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} [options] <code>since</code> (UNIX timestamp)
 * @param {Function} [callback] <code>(err, users)</code>
 */
TogglClient.prototype.getMostActiveUsers = function getMostActiveUsers(
  workspaceId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest(
    path`workspaces/${workspaceId}/dashboard/most_active`, { qs: options },
    callback);
};


/**
 * GET Get top activities
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#get-get-top-activities
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} [options] <code>since</code> (UNIX timestamp)
 * @param {Function} [callback] <code>(err, activity)</code>
 */
TogglClient.prototype.getTopActivity = function getTopActivity(workspaceId,
  options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest(
    path`workspaces/${workspaceId}/dashboard/top_activity`, { qs: options },
    callback);
};
