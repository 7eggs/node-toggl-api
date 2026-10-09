'use strict';

const { useMockServer } = require('../helpers/mock-server');
const { testEndpoints } = require('../helpers/endpoints');

describe('Projects', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'getUserProjects()',
      call: (t, ...cb) => t.getUserProjects(...cb),
      method: 'GET', path: '/api/v9/me/projects'
    },
    {
      name: 'getUserProjects(options)',
      call: (t, ...cb) => t.getUserProjects({ include_archived: true }, ...cb),
      method: 'GET', path: '/api/v9/me/projects', query: { include_archived: 'true' }
    },
    {
      name: 'getWorkspaceProjects(wid)',
      call: (t, ...cb) => t.getWorkspaceProjects(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/projects'
    },
    {
      name: 'getWorkspaceProjects(wid, options)',
      call: (t, ...cb) => t.getWorkspaceProjects(1, { active: false, client_ids: [3, 4], page: 2 }, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/projects',
      query: { active: 'false', client_ids: '3,4', page: '2' }
    },
    {
      name: 'createProject(wid, data)',
      call: (t, ...cb) => t.createProject(1, { name: 'P', is_private: true }, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/projects', body: { active: true, name: 'P', is_private: true }
    },
    {
      name: 'createProject(wid, data) with active: false',
      call: (t, ...cb) => t.createProject(1, { name: 'P', active: false }, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/projects', body: { name: 'P', active: false }
    },
    {
      name: 'getProjectData(wid, id)',
      call: (t, ...cb) => t.getProjectData(1, 9, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/projects/9'
    },
    {
      name: 'updateProject(wid, id, data)',
      call: (t, ...cb) => t.updateProject(1, 9, { active: false }, ...cb),
      method: 'PUT', path: '/api/v9/workspaces/1/projects/9', body: { active: false }
    },
    {
      name: 'updateProjects(wid, ids, operations)',
      call: (t, ...cb) => t.updateProjects(1, [9, 10], [{ op: 'replace', path: '/active', value: false }], ...cb),
      method: 'PATCH', path: '/api/v9/workspaces/1/projects/9,10',
      body: [{ op: 'replace', path: '/active', value: false }]
    },
    {
      name: 'deleteProject(wid, id)',
      call: (t, ...cb) => t.deleteProject(1, 9, ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/projects/9'
    },
    {
      name: 'deleteProject(wid, id, options)',
      call: (t, ...cb) => t.deleteProject(1, 9, { teDeletionMode: 'unassign' }, ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/projects/9', query: { teDeletionMode: 'unassign' }
    },
    {
      name: 'deleteProjects(wid, ids) sends one request per project',
      call: (t, ...cb) => t.deleteProjects(1, [9, 10], ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/projects/10',
      requests: 2, reply: { body: 1 }, result: [1, 1]
    },
    {
      name: 'deleteProjects(wid, ids, options)',
      call: (t, ...cb) => t.deleteProjects(1, [9], { teDeletionMode: 'delete' }, ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/projects/9', query: { teDeletionMode: 'delete' }
    },
    {
      name: 'pinProject(wid, id)',
      call: (t, ...cb) => t.pinProject(1, 9, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/projects/9/pin', body: { pin: true }
    },
    {
      name: 'pinProject(wid, id, false)',
      call: (t, ...cb) => t.pinProject(1, 9, false, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/projects/9/pin', body: { pin: false }
    }
  ]);

  it('deleteProjects() sends the requests one at a time, in order', async () => {
    await ctx.toggl.deleteProjects(1, [9, 10, 11]);
    expect(ctx.server.requests.map(r => r.path)).toEqual([
      '/api/v9/workspaces/1/projects/9',
      '/api/v9/workspaces/1/projects/10',
      '/api/v9/workspaces/1/projects/11'
    ]);
  });

  it('deleteProjects() stops at the first error', async () => {
    ctx.server.respond(r => r.path.endsWith('/10') ? { status: 403, raw: 'Forbidden', contentType: 'text/plain' } : {});
    await expect(ctx.toggl.deleteProjects(1, [9, 10, 11])).rejects.toMatchObject({ code: 403 });
    expect(ctx.server.requests).toHaveLength(2);
  });
});
