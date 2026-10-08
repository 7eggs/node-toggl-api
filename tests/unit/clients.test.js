'use strict';

const { useMockServer } = require('../helpers/mock-server');
const { testEndpoints } = require('../helpers/endpoints');

describe('Clients', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'getClients()',
      call: (t, ...cb) => t.getClients(...cb),
      method: 'GET', path: '/api/v9/me/clients',
      reply: { body: [{ id: 3 }] }, result: [{ id: 3 }]
    },
    {
      name: 'getClients(options)',
      call: (t, ...cb) => t.getClients({ since: 1700000000 }, ...cb),
      method: 'GET', path: '/api/v9/me/clients', query: { since: '1700000000' }
    },
    {
      name: 'getWorkspaceClients(wid)',
      call: (t, ...cb) => t.getWorkspaceClients(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/clients'
    },
    {
      name: 'getWorkspaceClients(wid, options)',
      call: (t, ...cb) => t.getWorkspaceClients(1, { status: 'archived', name: 'Acme' }, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/clients', query: { status: 'archived', name: 'Acme' }
    },
    {
      name: 'createClient(wid, data)',
      call: (t, ...cb) => t.createClient(1, { name: 'Acme', notes: 'n' }, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/clients', body: { name: 'Acme', notes: 'n' }
    },
    {
      name: 'getClientData(wid, id)',
      call: (t, ...cb) => t.getClientData(1, 3, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/clients/3'
    },
    {
      name: 'getClientsData(wid, ids)',
      call: (t, ...cb) => t.getClientsData(1, [3, 4], ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/clients/data', body: [3, 4]
    },
    {
      name: 'updateClient(wid, id, data)',
      call: (t, ...cb) => t.updateClient(1, 3, { name: 'Acme Inc' }, ...cb),
      method: 'PUT', path: '/api/v9/workspaces/1/clients/3', body: { name: 'Acme Inc' }
    },
    {
      name: 'deleteClient(wid, id)',
      call: (t, ...cb) => t.deleteClient(1, 3, ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/clients/3'
    },
    {
      name: 'deleteClients(wid, ids)',
      call: (t, ...cb) => t.deleteClients(1, [3, 4], ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/clients/delete', body: [3, 4]
    },
    {
      name: 'archiveClient(wid, id)',
      call: (t, ...cb) => t.archiveClient(1, 3, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/clients/3/archive'
    },
    {
      name: 'archiveClients(wid, ids)',
      call: (t, ...cb) => t.archiveClients(1, [3, 4], ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/clients/archive', body: [3, 4]
    },
    {
      name: 'restoreClient(wid, id)',
      call: (t, ...cb) => t.restoreClient(1, 3, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/clients/3/restore', body: {}
    },
    {
      name: 'restoreClient(wid, id, options)',
      call: (t, ...cb) => t.restoreClient(1, 3, { restore_all_projects: true }, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/clients/3/restore', body: { restore_all_projects: true }
    },
    {
      name: 'getClientProjects(wid, id)',
      call: (t, ...cb) => t.getClientProjects(1, 3, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/projects', query: { client_ids: '3' }
    },
    {
      name: 'getClientProjects(wid, id, options)',
      call: (t, ...cb) => t.getClientProjects(1, 3, { active: true }, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/projects', query: { client_ids: '3', active: 'true' }
    }
  ]);
});
