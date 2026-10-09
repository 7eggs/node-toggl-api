'use strict';
const TogglClient = require('../../');
const { describeLive, workspaceId, organizationId } = require('../helpers/live');

// resetApiToken and changeUserPassword are not tested live on purpose:
// they would invalidate the credentials in .env
describeLive('Testing User', () => {
  let togglClient

  beforeEach(() => {
    togglClient = new TogglClient({ apiToken: process.env.API_TOKEN });
  });

  it('should authenticate with the API token', async () => {
    const user = await togglClient.authenticate()
    expect(user).toHaveProperty('id')
    expect(togglClient.authData).toEqual(user)
  })

  it('should reject a bad API token', async () => {
    const bad = new TogglClient({ apiToken: 'not-a-real-token' })
    await expect(bad.getUserData()).rejects.toMatchObject({ name: 'APIError' })
  })

  it('should get user data, with and without related data', async () => {
    const user = await togglClient.getUserData()
    expect(user).toHaveProperty('email')
    const related = await togglClient.getUserData({ with_related_data: true })
    expect(related).toHaveProperty('workspaces')
  })

  it('should get the organizations, tags, features, quota and preferences', async () => {
    const organizations = await togglClient.getUserOrganizations()
    expect(organizations.map(o => o.id)).toContain(organizationId)

    const tags = await togglClient.getUserTags()
    expect(tags === null || Array.isArray(tags)).toBe(true)

    const features = await togglClient.getUserFeatures()
    expect(features.map(f => f.workspace_id)).toContain(workspaceId)

    const quota = await togglClient.getUserQuota()
    expect(quota).toBeInstanceOf(Array)

    const preferences = await togglClient.getUserPreferences()
    expect(preferences).toBeInstanceOf(Object)
  })

  it('should update user data and restore it', async () => {
    const original = await togglClient.getUserData()
    try {
      const updated = await togglClient.updateUserData({ fullname: original.fullname + ' updated' })
      expect(updated.fullname).toBe(original.fullname + ' updated')
    } finally {
      await togglClient.updateUserData({ fullname: original.fullname })
    }
  })
});
