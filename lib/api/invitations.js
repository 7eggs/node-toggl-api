'use strict';

const TogglClient = require('../client');

/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspace_users.md#invite-users-to-workspace
 * @public
 * @param {Number|String} organizationId Organization Id
 * @param {String[]} emails E-mail addresses
 * @param {Object[]} workspaces Workspaces
 * @param {Function} callback <code>(err, users, notifications)</code>
 */
TogglClient.prototype.inviteUsers = function inviteUsers(organizationId, workspaces, emails, callback) {
  const req = {
    method: 'POST',
    body: {
      emails: emails,
      workspaces: workspaces
    }
  };
  return this.apiRequest(`organizations/${organizationId}/invitations`, req, callback);
};

