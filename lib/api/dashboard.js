'use strict';

var TogglClient = require('../client');
var utils = require('../utils');


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/dashboard.md#get-dashboard-data
 * @public
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err, clients)</code>
 */
TogglClient.prototype.getDashboard = function getDashboard(workspaceId, callback) {
  return this.apiRequest(`workspaces/${workspaceId}/dashboard/all_activity`, {}, callback);
};
