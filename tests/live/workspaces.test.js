'use strict';
const TogglClient = require('../../');
const { describeLive, workspaceId, organizationId } = require('../helpers/live');


describeLive('Testing Workspaces', () => {
    let togglClient

    beforeEach(() => {
        togglClient = new TogglClient({ apiToken: process.env.API_TOKEN });
    });


    it('should get workspaces', async () => {
        const workspaces = await togglClient.getWorkspaces()
        expect(workspaces).toBeInstanceOf(Array)
        expect(workspaces.map(w => w.id)).toContain(workspaceId)
    })

    it('should get workspace data', async () => {
        const workspace = await togglClient.getWorkspaceData(workspaceId)
        expect(workspace.id).toBe(workspaceId)
    })

    it('should get workspace clients', async () => {
        const clients = await togglClient.getWorkspaceClients(workspaceId)
        expect(clients === null || Array.isArray(clients)).toBe(true)
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
        expect(users[0]).toHaveProperty('email')
    })

    it('should get workspace users through the organization', async () => {
        const users = await togglClient.getOrganizationWorkspaceUsers(organizationId, workspaceId)
        expect(users).toBeInstanceOf(Array)
    })

    it('should get workspace statistics and time entry constraints', async () => {
        const statistics = await togglClient.getWorkspaceStatistics(workspaceId)
        expect(statistics).toHaveProperty('members_count')
        const constraints = await togglClient.getTimeEntryConstraints(workspaceId)
        expect(constraints).toHaveProperty('time_entry_constraints_enabled')
    })

    it('should update workspace data and restore it', async () => {
        const original = await togglClient.getWorkspaceData(workspaceId)
        try {
            const workspace = await togglClient.updateWorkspace(workspaceId, { name: original.name + ' updated' })
            expect(workspace.name).toBe(original.name + ' updated')
        } finally {
            await togglClient.updateWorkspace(workspaceId, { name: original.name })
        }
    })
});
