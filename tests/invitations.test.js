'use strict';
const TogglClient = require('../');
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Testing Invitations', () => {
  let togglClient
  const workspaceId = Number(process.env.WORKSPACE_ID)
  const organizationId = Number(process.env.ORGANIZATION_ID)

  beforeEach(() => {
    togglClient = new TogglClient({ apiToken: process.env.API_TOKEN });
  });

  afterEach(() => {
    togglClient.destroy();
  });

  it('should create a new organization invitation', async () => {
    const emails = ['clicnet.com.br@gmail.com']
    const workspaces = [{
      workspace_id: workspaceId,
    }]

    const invitations = await togglClient.inviteUsers(organizationId, workspaces, emails)
    expect(invitations).toHaveProperty('messages');

  })

});

