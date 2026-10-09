'use strict';
const TogglClient = require('../../');
const { describeLive, workspaceId } = require('../helpers/live');

describeLive('Testing Clients', () => {
  let togglClient

  beforeEach(() => {
    togglClient = new TogglClient({ apiToken: process.env.API_TOKEN });
  });

  it('should create a client, read it, update it and delete it', async () => {
    const name = `node-toggl-api client ${Date.now()}`
    const client = await togglClient.createClient(workspaceId, { name })
    expect(client).toHaveProperty('id')
    expect(client.name).toBe(name)

    try {
      const loaded = await togglClient.getClientData(workspaceId, client.id)
      expect(loaded.id).toBe(client.id)

      const listed = await togglClient.getWorkspaceClients(workspaceId, { name })
      expect(listed.map(c => c.id)).toContain(client.id)

      const mine = await togglClient.getClients()
      expect(mine.map(c => c.id)).toContain(client.id)

      const updated = await togglClient.updateClient(workspaceId, client.id, { name: name + ' updated', notes: 'notes' })
      expect(updated.name).toBe(name + ' updated')

      const projects = await togglClient.getClientProjects(workspaceId, client.id)
      expect(projects).toEqual([])
    } finally {
      await togglClient.deleteClient(workspaceId, client.id)
    }

    await expect(togglClient.getClientData(workspaceId, client.id)).rejects.toMatchObject({ name: 'APIError' })
  })
});
