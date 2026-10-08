'use strict';

const { useMockServer } = require('../helpers/mock-server');
const { testEndpoints } = require('../helpers/endpoints');

describe('Tasks', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'getUserTasks()',
      call: (t, ...cb) => t.getUserTasks(...cb),
      method: 'GET', path: '/api/v9/me/tasks'
    },
    {
      name: 'getUserTasks(options)',
      call: (t, ...cb) => t.getUserTasks({ include_not_active: true }, ...cb),
      method: 'GET', path: '/api/v9/me/tasks', query: { include_not_active: 'true' }
    },
    {
      name: 'getWorkspaceTasks(wid)',
      call: (t, ...cb) => t.getWorkspaceTasks(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/tasks',
      reply: { body: { data: [], total_count: 0 } }, result: { data: [], total_count: 0 }
    },
    {
      name: 'getWorkspaceTasks(wid, options)',
      call: (t, ...cb) => t.getWorkspaceTasks(1, { pid: 9, active: true }, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/tasks', query: { pid: '9', active: 'true' }
    },
    {
      name: 'getProjectTasks(wid, pid)',
      call: (t, ...cb) => t.getProjectTasks(1, 9, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/projects/9/tasks'
    },
    {
      name: 'getProjectTasks(wid, pid, options)',
      call: (t, ...cb) => t.getProjectTasks(1, 9, { active: false }, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/projects/9/tasks', query: { active: 'false' }
    },
    {
      name: 'createTask(wid, pid, data)',
      call: (t, ...cb) => t.createTask(1, 9, { name: 'T', estimated_seconds: 60 }, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/projects/9/tasks',
      body: { name: 'T', estimated_seconds: 60 }
    },
    {
      name: 'createTask(wid, pid, name)',
      call: (t, ...cb) => t.createTask(1, 9, 'T', ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/projects/9/tasks', body: { name: 'T' }
    },
    {
      name: 'getTaskData(wid, pid, id)',
      call: (t, ...cb) => t.getTaskData(1, 9, 20, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/projects/9/tasks/20'
    },
    {
      name: 'updateTask(wid, pid, id, data)',
      call: (t, ...cb) => t.updateTask(1, 9, 20, { active: false }, ...cb),
      method: 'PUT', path: '/api/v9/workspaces/1/projects/9/tasks/20', body: { active: false }
    },
    {
      name: 'updateTasks(wid, pid, ids, operations)',
      call: (t, ...cb) => t.updateTasks(1, 9, [20, 21], [{ op: 'replace', path: '/active', value: false }], ...cb),
      method: 'PATCH', path: '/api/v9/workspaces/1/projects/9/tasks/20,21',
      body: [{ op: 'replace', path: '/active', value: false }]
    },
    {
      name: 'deleteTask(wid, pid, id)',
      call: (t, ...cb) => t.deleteTask(1, 9, 20, ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/projects/9/tasks/20'
    },
    {
      name: 'deleteTasks(wid, pid, ids) sends one request per task',
      call: (t, ...cb) => t.deleteTasks(1, 9, [20, 21], ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/projects/9/tasks/21', requests: 2
    }
  ]);
});
