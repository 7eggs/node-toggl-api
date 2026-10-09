'use strict';
const TogglClient = require('../../');
const { describeLive, workspaceId, organizationId } = require('../helpers/live');

// Creates a real invitation, so it only runs when INVITE_EMAIL is set
const itInvites = process.env.INVITE_EMAIL ? it : it.skip

describeLive('Testing Invitations', () => {
  let togglClient

  beforeEach(() => {
    togglClient = new TogglClient({ apiToken: process.env.API_TOKEN });
  });

  itInvites('should create a new organization invitation', async () => {
    const invitations = await togglClient.inviteUsers(organizationId, [workspaceId],
      [process.env.INVITE_EMAIL], { skip_email: true })
    expect(invitations).toHaveProperty('messages');
  })

  it('should reject an unknown invitation code', async () => {
    await expect(togglClient.getInvitation('not-a-real-invitation-code'))
      .rejects.toMatchObject({ name: 'APIError' })
  })
});
