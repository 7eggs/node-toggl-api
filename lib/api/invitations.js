'use strict';

const TogglClient = require('../client');
const utils = require('../utils');
const path = utils.path;


/**
 * GET Get an invitation
 *
 * @see https://engineering.toggl.com/docs/track/openapi
 * @public
 * @param {String} invitationCode Invitation code
 * @param {Function} [callback] <code>(err, invitation)</code>
 */
TogglClient.prototype.getInvitation = function getInvitation(invitationCode,
  callback) {
  return this.apiRequest(path`invitations/${invitationCode}`, {}, callback);
};


/**
 * POST Accepts invitation
 *
 * @see https://engineering.toggl.com/docs/track/api/invitations#post-accepts-invitation
 * @public
 * @param {String} invitationCode Invitation code
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.acceptInvitation = function acceptInvitation(
  invitationCode, callback) {
  const req = {
    method: 'POST'
  };

  return this.apiRequest(
    path`organizations/invitations/${invitationCode}/accept`, req, callback);
};


/**
 * POST Rejects invitation
 *
 * @see https://engineering.toggl.com/docs/track/api/invitations#post-rejects-invitation
 * @public
 * @param {String} invitationCode Invitation code
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.rejectInvitation = function rejectInvitation(
  invitationCode, callback) {
  const req = {
    method: 'POST'
  };

  return this.apiRequest(
    path`organizations/invitations/${invitationCode}/reject`, req, callback);
};


/**
 * POST Creates a new invitation for the user: invites people to an
 * organization and some of its workspaces.
 *
 * @see https://engineering.toggl.com/docs/track/api/invitations#post-creates-a-new-invitation-for-the-user
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Object[]|Number[]} workspaces Workspaces to join, as
 *   <code>{workspace_id, admin, role}</code> objects or just workspace IDs
 * @param {String[]} emails E-mail addresses
 * @param {Object} [options] <code>groups</code>, <code>skip_email</code>, <code>project_invite</code>
 * @param {Function} [callback] <code>(err, result)</code>
 */
TogglClient.prototype.inviteUsers = function inviteUsers(organizationId,
  workspaces, emails, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  const req = {
    method: 'POST',
    body: Object.assign({}, options, {
      emails: emails,
      workspaces: workspaces.map(w => typeof w === 'object' ? w : { workspace_id: w })
    })
  };

  return this.apiRequest(path`organizations/${organizationId}/invitations`, req,
    callback);
};


/**
 * PUT Resends user their invitation
 *
 * @see https://engineering.toggl.com/docs/track/api/invitations#put-resends-user-their-invitation
 * @public
 * @param {Number|String} organizationId Organization ID
 * @param {Number|String} invitationId Invitation ID
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.resendInvitation = function resendInvitation(
  organizationId, invitationId, callback) {
  const req = {
    method: 'PUT'
  };

  return this.apiRequest(
    path`organizations/${organizationId}/invitations/${invitationId}/resend`,
    req, callback);
};
