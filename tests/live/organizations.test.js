'use strict';
const TogglClient = require('../../');
const { describeLive, organizationId } = require('../helpers/live');

// Read only: groups and organization changes need a paid plan or admin rights
describeLive('Testing Organizations', () => {
  let togglClient

  beforeEach(() => {
    togglClient = new TogglClient({ apiToken: process.env.API_TOKEN });
  });

  it('should get the organization', async () => {
    const organization = await togglClient.getOrganization(organizationId)
    expect(organization.id).toBe(organizationId)
  })

  it('should get the organization users', async () => {
    const users = await togglClient.getOrganizationUsers(organizationId)
    expect(users).toBeInstanceOf(Array)
    expect(users[0]).toHaveProperty('email')
  })
});
