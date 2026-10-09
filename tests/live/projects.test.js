'use strict';
const TogglClient = require('../../');
const { describeLive, workspaceId } = require('../helpers/live');

describeLive('Testing Projects and Tasks', () => {
  let togglClient

  beforeEach(() => {
    togglClient = new TogglClient({ apiToken: process.env.API_TOKEN });
  });

  it('should create a project, update it, list it and delete it', async () => {
    const name = `node-toggl-api project ${Date.now()}`
    const project = await togglClient.createProject(workspaceId, { name })
    expect(project).toHaveProperty('id')
    expect(project.active).toBe(true)

    try {
      const loaded = await togglClient.getProjectData(workspaceId, project.id)
      expect(loaded.name).toBe(name)

      const updated = await togglClient.updateProject(workspaceId, project.id, { name: name + ' updated' })
      expect(updated.name).toBe(name + ' updated')

      const result = await togglClient.updateProjects(workspaceId, [project.id],
        [{ op: 'replace', path: '/color', value: '#06aaf5' }])
      expect(result.success).toEqual([project.id])

      const projects = await togglClient.getWorkspaceProjects(workspaceId, { name: name + ' updated' })
      expect(projects.map(p => p.id)).toContain(project.id)

      const mine = await togglClient.getUserProjects()
      expect(mine.map(p => p.id)).toContain(project.id)

      const users = await togglClient.getProjectUsers(workspaceId, project.id)
      expect(users).toBeInstanceOf(Array)
    } finally {
      await togglClient.deleteProject(workspaceId, project.id)
    }

    await expect(togglClient.getProjectData(workspaceId, project.id)).rejects.toMatchObject({ name: 'APIError' })
  })

  it('should create tasks when the workspace supports them', async () => {
    const project = await togglClient.createProject(workspaceId, { name: `node-toggl-api tasks ${Date.now()}` })

    try {
      let task
      try {
        task = await togglClient.createTask(workspaceId, project.id, 'Task 1')
      } catch (err) {
        // tasks are a paid feature: Free workspaces get a 403, even for
        // admins. A spent API quota is a 402, so that must not pass here
        expect(err.message).not.toMatch(/hourly limit/)
        expect([402, 403]).toContain(err.code)
        return
      }

      expect(task.name).toBe('Task 1')
      const loaded = await togglClient.getTaskData(workspaceId, project.id, task.id)
      expect(loaded.id).toBe(task.id)

      const updated = await togglClient.updateTask(workspaceId, project.id, task.id, { name: 'Task 1 updated' })
      expect(updated.name).toBe('Task 1 updated')

      const tasks = await togglClient.getProjectTasks(workspaceId, project.id)
      expect(tasks.map(t => t.id)).toContain(task.id)

      await togglClient.deleteTask(workspaceId, project.id, task.id)
    } finally {
      await togglClient.deleteProject(workspaceId, project.id)
    }
  })
});
