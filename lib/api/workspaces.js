'use strict';

const TogglClient = require('../client');
const utils = require('../utils');
const path = utils.path;


/**
 * GET Workspaces of the current user.
 *
 * @see https://engineering.toggl.com/docs/track/api/me#get-workspaces
 * @public
 * @param {Object} [options] <code>since</code> (UNIX timestamp)
 * @param {Function} [callback] <code>(err, workspaces)</code>
 */
TogglClient.prototype.getWorkspaces = function getWorkspaces(options,
  callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest('me/workspaces', { qs: options }, callback);
};


/**
 * GET Get single workspace
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#get-get-single-workspace
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Function} [callback] <code>(err, workspace)</code>
 */
TogglClient.prototype.getWorkspaceData = function getWorkspaceData(
  workspaceId, callback) {
  return this.apiRequest(path`workspaces/${workspaceId}`, {}, callback);
};


/**
 * POST Create a new workspace.
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#post-create-a-new-workspace
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Object} data Workspace data, <code>name</code> is required
 * @param {Function} [callback] <code>(err, workspace)</code>
 */
TogglClient.prototype.createWorkspace = function createWorkspace(
  organizationId, data, callback) {
  const req = {
    method: 'POST',
    body: data
  };

  return this.apiRequest(path`organizations/${organizationId}/workspaces`, req,
    callback);
};


/**
 * PUT Update workspace
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#put-update-workspace
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} data Workspace data
 * @param {Function} [callback] <code>(err, workspace)</code>
 */
TogglClient.prototype.updateWorkspace = function updateWorkspace(workspaceId,
  data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(path`workspaces/${workspaceId}`, req, callback);
};


/**
 * Same as {@link TogglClient#getTags}, kept for backwards compatibility.
 *
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} [options] See {@link TogglClient#getTags}
 * @param {Function} [callback] <code>(err, tags)</code>
 */
TogglClient.prototype.getWorkspaceTags = function getWorkspaceTags(workspaceId,
  options, callback) {
  return this.getTags(workspaceId, options, callback);
};


/**
 * GET Workspace statistics: admins, groups and members count.
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#get-workspace-statistics
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Function} [callback] <code>(err, statistics)</code>
 */
TogglClient.prototype.getWorkspaceStatistics = function getWorkspaceStatistics(
  workspaceId, callback) {
  return this.apiRequest(path`workspaces/${workspaceId}/statistics`, {},
    callback);
};


/**
 * GET Get workspace preferences
 *
 * @see https://engineering.toggl.com/docs/track/api/preferences#get-get-workspace-preferences
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Function} [callback] <code>(err, preferences)</code>
 */
TogglClient.prototype.getWorkspacePreferences =
  function getWorkspacePreferences(workspaceId, callback) {
    return this.apiRequest(path`workspaces/${workspaceId}/preferences`, {},
      callback);
  };


/**
 * POST Update workspace preferences
 *
 * @see https://engineering.toggl.com/docs/track/api/preferences#post-update-workspace-preferences
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} data Preferences
 * @param {Function} [callback] <code>(err, preferences)</code>
 */
TogglClient.prototype.updateWorkspacePreferences =
  function updateWorkspacePreferences(workspaceId, data, callback) {
    const req = {
      method: 'POST',
      body: data
    };

    return this.apiRequest(path`workspaces/${workspaceId}/preferences`, req,
      callback);
  };


/**
 * GET Get workspace time entry constraints
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#get-get-workspace-time-entry-constraints
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Function} [callback] <code>(err, constraints)</code>
 */
TogglClient.prototype.getTimeEntryConstraints = function getTimeEntryConstraints(
  workspaceId, callback) {
  return this.apiRequest(path`workspaces/${workspaceId}/time_entry_constraints`,
    {}, callback);
};


/**
 * GET Alerts of the workspace projects.
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#get-alerts
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Function} [callback] <code>(err, alerts)</code>
 */
TogglClient.prototype.getAlerts = function getAlerts(workspaceId, callback) {
  return this.apiRequest(path`workspaces/${workspaceId}/alerts`, {}, callback);
};


/**
 * POST Alerts: creates a project alert.
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#post-alerts
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} data <code>project_id</code>, <code>threshold_type</code>,
 *   <code>thresholds</code>, <code>receiver_roles</code>, <code>receiver_users</code>, ...
 * @param {Function} [callback] <code>(err, alert)</code>
 */
TogglClient.prototype.createAlert = function createAlert(workspaceId, data,
  callback) {
  const req = {
    method: 'POST',
    body: data
  };

  return this.apiRequest(path`workspaces/${workspaceId}/alerts`, req, callback);
};


/**
 * PUT Alerts
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#put-alerts
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} alertId Alert ID
 * @param {Object} data Alert data
 * @param {Function} [callback] <code>(err, alert)</code>
 */
TogglClient.prototype.updateAlert = function updateAlert(workspaceId, alertId,
  data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(path`workspaces/${workspaceId}/alerts/${alertId}`, req,
    callback);
};


/**
 * DELETE Alerts
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#delete-alerts
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} alertId Alert ID
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.deleteAlert = function deleteAlert(workspaceId, alertId,
  callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(path`workspaces/${workspaceId}/alerts/${alertId}`, req,
    callback);
};


/**
 * GET TrackReminders
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#get-trackreminders
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Function} [callback] <code>(err, reminders)</code>
 */
TogglClient.prototype.getTrackReminders = function getTrackReminders(
  workspaceId, callback) {
  return this.apiRequest(path`workspaces/${workspaceId}/track_reminders`, {},
    callback);
};


/**
 * POST TrackReminders
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#post-trackreminders
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} data <code>frequency</code>, <code>threshold</code>, <code>user_ids</code>,
 *   <code>group_ids</code>, <code>email_reminder_enabled</code>, ...
 * @param {Function} [callback] <code>(err, reminder)</code>
 */
TogglClient.prototype.createTrackReminder = function createTrackReminder(
  workspaceId, data, callback) {
  const req = {
    method: 'POST',
    body: data
  };

  return this.apiRequest(path`workspaces/${workspaceId}/track_reminders`, req,
    callback);
};


/**
 * PUT TrackReminder
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#put-trackreminder
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} reminderId Reminder ID
 * @param {Object} data Reminder data
 * @param {Function} [callback] <code>(err, reminder)</code>
 */
TogglClient.prototype.updateTrackReminder = function updateTrackReminder(
  workspaceId, reminderId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(
    path`workspaces/${workspaceId}/track_reminders/${reminderId}`, req,
    callback);
};


/**
 * DELETE TrackReminder
 *
 * @see https://engineering.toggl.com/docs/track/api/workspaces#delete-trackreminder
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} reminderId Reminder ID
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.deleteTrackReminder = function deleteTrackReminder(
  workspaceId, reminderId, callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(
    path`workspaces/${workspaceId}/track_reminders/${reminderId}`, req,
    callback);
};
