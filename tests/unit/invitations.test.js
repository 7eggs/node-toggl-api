'use strict';

const { useMockServer } = require('../helpers/mock-server');
const { testEndpoints } = require('../helpers/endpoints');

describe('Invitations', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'getInvitation(code)',
      call: (t, ...cb) => t.getInvitation('abc', ...cb),
      method: 'GET', path: '/api/v9/invitations/abc'
    },
    {
      name: 'acceptInvitation(code)',
      call: (t, ...cb) => t.acceptInvitation('abc', ...cb),
      method: 'POST', path: '/api/v9/organizations/invitations/abc/accept'
    },
    {
      name: 'rejectInvitation(code)',
      call: (t, ...cb) => t.rejectInvitation('abc', ...cb),
      method: 'POST', path: '/api/v9/organizations/invitations/abc/reject'
    },
    {
      name: 'inviteUsers(orgId, workspaces, emails)',
      call: (t, ...cb) => t.inviteUsers(8, [{ workspace_id: 1, admin: true }], ['a@b.c'], ...cb),
      method: 'POST', path: '/api/v9/organizations/8/invitations',
      body: { emails: ['a@b.c'], workspaces: [{ workspace_id: 1, admin: true }] }
    },
    {
      name: 'inviteUsers(orgId, workspaceIds, emails, options)',
      call: (t, ...cb) => t.inviteUsers(8, [1, 2], ['a@b.c'], { skip_email: true }, ...cb),
      method: 'POST', path: '/api/v9/organizations/8/invitations',
      body: { emails: ['a@b.c'], workspaces: [{ workspace_id: 1 }, { workspace_id: 2 }], skip_email: true }
    },
    {
      name: 'resendInvitation(orgId, invitationId)',
      call: (t, ...cb) => t.resendInvitation(8, 33, ...cb),
      method: 'PUT', path: '/api/v9/organizations/8/invitations/33/resend'
    }
  ]);

  it('encodes invitation codes', async () => {
    await ctx.toggl.acceptInvitation('a/b');
    expect(ctx.server.last().path).toBe('/api/v9/organizations/invitations/a%2Fb/accept');
  });
});
