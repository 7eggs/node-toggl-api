'use strict';

var TogglClient = require('../client');
var utils = require('../utils');


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/dashboard.md#get-dashboard-data
 * @public
 * @param {Number|String} wId Workspace Id
 * @param {Function} callback <code>(err, clients)</code>
 */
TogglClient.prototype.getDashboard = function getDashboard(wId, callback) {
  this.apiRequest('/api/v8/dashboard/' + wId, {}, callback);
};
