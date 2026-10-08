'use strict';

const TogglClient = require('../client');
const utils = require('../utils');
const path = utils.path;


/**
 * POST Creates a new organization, with a first workspace.
 *
 * @see https://engineering.toggl.com/docs/track/api/organizations#post-creates-a-new-organization
 * @public
 * @param {Object} data <code>name</code>, <code>workspace_name</code>
 * @param {Function} [callback] <code>(err, organization)</code>
 */
TogglClient.prototype.createOrganization = function createOrganization(data,
  callback) {
  const req = {
    method: 'POST',
    body: data
  };

  return this.apiRequest('organizations', req, callback);
};


/**
 * GET Organization data
 *
 * @see https://engineering.toggl.com/docs/track/api/organizations#get-organization-data
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Function} [callback] <code>(err, organization)</code>
 */
TogglClient.prototype.getOrganization = function getOrganization(
  organizationId, callback) {
  return this.apiRequest(path`organizations/${organizationId}`, {}, callback);
};


/**
 * PUT Updates an existing organization
 *
 * @see https://engineering.toggl.com/docs/track/api/organizations#put-updates-an-existing-organization
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Object} data <code>name</code>
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.updateOrganization = function updateOrganization(
  organizationId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(path`organizations/${organizationId}`, req, callback);
};


/**
 * GET Get owner of the organization
 *
 * @see https://engineering.toggl.com/docs/track/api/organizations#get-get-owner-of-the-organization
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Function} [callback] <code>(err, owner)</code>
 */
TogglClient.prototype.getOrganizationOwner = function getOrganizationOwner(
  organizationId, callback) {
  return this.apiRequest(path`organizations/${organizationId}/owner`, {},
    callback);
};


/**
 * GET List of users in organization
 *
 * @see https://engineering.toggl.com/docs/track/api/organizations#get-list-of-users-in-organization
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Object} [options] <code>filter</code>, <code>active_status</code>,
 *   <code>only_admins</code>, <code>groups</code>, <code>workspaces</code>,
 *   <code>page</code>, <code>per_page</code>, <code>sort_dir</code>
 * @param {Function} [callback] <code>(err, users)</code>
 */
TogglClient.prototype.getOrganizationUsers = function getOrganizationUsers(
  organizationId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest(path`organizations/${organizationId}/users`,
    { qs: options }, callback);
};


/**
 * PUT Changes a single organization-user
 *
 * @see https://engineering.toggl.com/docs/track/api/organizations#put-changes-a-single-organization-user
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Number|String} organizationUserId Organization user ID
 * @param {Object} data <code>name</code>, <code>email</code>, <code>role_id</code>,
 *   <code>organization_admin</code>, <code>inactive</code>, <code>groups</code>, <code>workspaces</code>
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.updateOrganizationUser = function updateOrganizationUser(
  organizationId, organizationUserId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(
    path`organizations/${organizationId}/users/${organizationUserId}`, req,
    callback);
};


/**
 * PATCH Apply changes in bulk to users in an organization (currently,
 * removes them).
 *
 * @see https://engineering.toggl.com/docs/track/api/organizations#patch-apply-changes-in-bulk-to-users-in-an-organization
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Object|Number[]} changes <code>{delete: [organizationUserIds]}</code>,
 *   or just the array of organization user IDs to remove
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.updateOrganizationUsers =
  function updateOrganizationUsers(organizationId, changes, callback) {
    const req = {
      method: 'PATCH',
      body: Array.isArray(changes) ? { delete: changes } : changes
    };

    return this.apiRequest(path`organizations/${organizationId}/users`, req,
      callback);
  };


/**
 * DELETE Leaves organization
 *
 * @see https://engineering.toggl.com/docs/track/api/organizations#delete-leaves-organization
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.leaveOrganization = function leaveOrganization(
  organizationId, callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(path`organizations/${organizationId}/users/leave`,
    req, callback);
};
