'use strict';

const TogglClient = require('../client');

/**
 * POST Accepts invitation
 * @see https://engineering.toggl.com/docs/api/invitations#post-accepts-invitation
 * @public
 * @param {String} invitationCode Organization Id
 * @param {Function} callback <code>(err, users, notifications)</code>
 */
TogglClient.prototype.acceptInvitation = function (invitationCode, callback) {
  const req = {
    method: 'POST',
  };
  return this.apiRequest(`organizations/invitations/${invitationCode}/accept`, req, callback);
};

/**
 * POST Rejects invitation
 * @see https://engineering.toggl.com/docs/api/invitations#post-rejects-invitation
 * @public
 * @param {String} invitationCode Organization Id
 * @param {Function} callback <code>(err, users, notifications)</code>
 */
TogglClient.prototype.rejectInvitation = function (invitationCode, callback) {
  const req = {
    method: 'POST',
  };
  return this.apiRequest(`organizations/invitations/${invitationCode}/reject`, req, callback);
};


/**
 * POST Creates a new invitation for the user
 * @see https://engineering.toggl.com/docs/api/invitations#post-creates-a-new-invitation-for-the-user
 * @public
 * @param {Number} organizationId Organization Id
 * @param {String[]} emails E-mail addresses
 * @param {Object[]} workspaces Workspaces
 * @param {Function} callback <code>(err, users, notifications)</code>
 */
TogglClient.prototype.inviteUsers = function (organizationId, workspaces, emails, callback) {
  const req = {
    method: 'POST',
    body: {
      emails: emails,
      workspaces: workspaces
    }
  };
  return this.apiRequest(`organizations/${organizationId}/invitations`, req, callback);
};



/**
 * PUT Resends user their invitation
 * @see https://engineering.toggl.com/docs/api/invitations#put-resends-user-their-invitation
 * @public
 * @param {String} organizationId Organization Id
 * @param {String} invitationCode Invitation Code
 * @param {Function} callback <code>(err, users, notifications)</code>
 */
TogglClient.prototype.inviteUsers = function (organizationId, invitationCode, callback) {
  const req = {
    method: 'POST'

  };
  return this.apiRequest(`organizations/${organizationId}/invitations/${invitationCode}/resend`, req, callback);
};