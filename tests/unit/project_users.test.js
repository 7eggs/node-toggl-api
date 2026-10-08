'use strict';

const { useMockServer } = require('../helpers/mock-server');
const { testEndpoints } = require('../helpers/endpoints');

describe('Project users', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'getWorkspaceProjectUsers(wid)',
      call: (t, ...cb) => t.getWorkspaceProjectUsers(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/project_users'
    },
    {
      name: 'getWorkspaceProjectUsers(wid, options)',
      call: (t, ...cb) => t.getWorkspaceProjectUsers(1, { user_id: 5, with_group_members: true }, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/project_users',
      query: { user_id: '5', with_group_members: 'true' }
    },
    {
      name: 'getProjectUsers(wid, pid)',
      call: (t, ...cb) => t.getProjectUsers(1, 9, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/project_users', query: { project_ids: '9' }
    },
    {
      name: 'getProjectUsers(wid, pid, options)',
      call: (t, ...cb) => t.getProjectUsers(1, 9, { user_id: 5 }, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/project_users', query: { project_ids: '9', user_id: '5' }
    },
    {
      name: 'addProjectUser(wid, pid, uid)',
      call: (t, ...cb) => t.addProjectUser(1, 9, 5, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/project_users',
      body: { project_id: 9, user_id: 5 }
    },
    {
      name: 'addProjectUser(wid, pid, uid, options)',
      call: (t, ...cb) => t.addProjectUser(1, 9, 5, { manager: true, rate: 10 }, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/project_users',
      body: { project_id: 9, user_id: 5, manager: true, rate: 10 }
    },
    {
      name: 'addProjectUsers(wid, pid, uids, options) sends one request per user',
      call: (t, ...cb) => t.addProjectUsers(1, 9, [5, 6], { manager: false }, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/project_users',
      body: { project_id: 9, user_id: 6, manager: false },
      requests: 2, reply: { body: { id: 1 } }, result: [{ id: 1 }, { id: 1 }]
    },
    {
      name: 'updateProjectUser(wid, id, data)',
      call: (t, ...cb) => t.updateProjectUser(1, 7, { manager: true }, ...cb),
      method: 'PUT', path: '/api/v9/workspaces/1/project_users/7', body: { manager: true }
    },
    {
      name: 'updateProjectUsers(wid, ids, operations)',
      call: (t, ...cb) => t.updateProjectUsers(1, [7, 8], [{ op: 'replace', path: '/manager', value: true }], ...cb),
      method: 'PATCH', path: '/api/v9/workspaces/1/project_users/7,8',
      body: [{ op: 'replace', path: '/manager', value: true }]
    },
    {
      name: 'deleteProjectUser(wid, id)',
      call: (t, ...cb) => t.deleteProjectUser(1, 7, ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/project_users/7'
    },
    {
      name: 'deleteProjectUsers(wid, ids) sends one request per project user',
      call: (t, ...cb) => t.deleteProjectUsers(1, [7, 8], ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/project_users/8', requests: 2
    }
  ]);
});
