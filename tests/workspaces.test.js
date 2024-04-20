'use strict';
const TogglClient = require('../');
require('dotenv').config()



describe('Testing Workspaces', () => {
    let togglClient
    const workspaceId = Number(process.env.WORKSPACE_ID)

    beforeEach(() => {
        togglClient = new TogglClient({ apiToken: process.env.API_TOKEN });
    });

    afterEach(() => {
        togglClient.destroy();
    });


    it('should get workspaces', async () => {
        const workspaces = await togglClient.getWorkspaces()
        expect(workspaces).toBeInstanceOf(Array)
    })

    it('should get workspace data', async () => {
        const workspace = await togglClient.getWorkspaceData(workspaceId)
        expect(workspace.id).toBe(workspaceId)
    })

    it.skip('should get workspace clients', async () => {
        const clients = await togglClient.getWorkspaceClients(workspaceId)
        expect(clients).toBeInstanceOf(Array)
    })

    it('should get workspace projects', async () => {
        const projects = await togglClient.getWorkspaceProjects(workspaceId)
        expect(projects).toBeInstanceOf(Array)
    })

    it('should get workspace tags', async () => {
        const tags = await togglClient.getWorkspaceTags(workspaceId)
        expect(tags).toBeInstanceOf(Array)
    })

    it('should get workspace tasks', async () => {
        const tasks = await togglClient.getWorkspaceTasks(workspaceId)
        expect(tasks).toHaveProperty('total_count')
    })

    it('should get workspace users', async () => {
        const users = await togglClient.getWorkspaceUsers(workspaceId)
        expect(users).toBeInstanceOf(Array)
    })

    it('should update workspace data', async () => {
        const dataToUpdate = {
            name: 'Test workspace updated'
        }
        const workspace = await togglClient.updateWorkspace(workspaceId, dataToUpdate)
        expect(workspace.name).toBe('Test workspace updated')
    })
});