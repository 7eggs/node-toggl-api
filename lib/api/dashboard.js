'use strict'

var TogglClient = require('../client')
    , utils = require('../utils')




/**
 * Get dashboard for a given workspace
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/dashboard.md#get-dashboard-data
 * @public
 * @param {number|string} wId Workspace Id
 * @param {function} callback Accepts arguments: (err, clients)
 */
TogglClient.prototype.getDashboard = function(wId, callback) {
    this.apiRequest('/api/v8/dashboard/' + wId, {}, callback)
}
