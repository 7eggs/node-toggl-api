'use strict';

const { useMockServer } = require('../helpers/mock-server');
const { testEndpoints } = require('../helpers/endpoints');

describe('Organizations', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'createOrganization(data)',
      call: (t, ...cb) => t.createOrganization({ name: 'O', workspace_name: 'W' }, ...cb),
      method: 'POST', path: '/api/v9/organizations', body: { name: 'O', workspace_name: 'W' }
    },
    {
      name: 'getOrganization(orgId)',
      call: (t, ...cb) => t.getOrganization(8, ...cb),
      method: 'GET', path: '/api/v9/organizations/8'
    },
    {
      name: 'updateOrganization(orgId, data)',
      call: (t, ...cb) => t.updateOrganization(8, { name: 'O2' }, ...cb),
      method: 'PUT', path: '/api/v9/organizations/8', body: { name: 'O2' }
    },
    {
      name: 'getOrganizationOwner(orgId)',
      call: (t, ...cb) => t.getOrganizationOwner(8, ...cb),
      method: 'GET', path: '/api/v9/organizations/8/owner'
    },
    {
      name: 'getOrganizationUsers(orgId)',
      call: (t, ...cb) => t.getOrganizationUsers(8, ...cb),
      method: 'GET', path: '/api/v9/organizations/8/users'
    },
    {
      name: 'getOrganizationUsers(orgId, options)',
      call: (t, ...cb) => t.getOrganizationUsers(8, { only_admins: true, workspaces: [1, 2] }, ...cb),
      method: 'GET', path: '/api/v9/organizations/8/users', query: { only_admins: 'true', workspaces: '1,2' }
    },
    {
      name: 'updateOrganizationUser(orgId, id, data)',
      call: (t, ...cb) => t.updateOrganizationUser(8, 15, { organization_admin: true }, ...cb),
      method: 'PUT', path: '/api/v9/organizations/8/users/15', body: { organization_admin: true }
    },
    {
      name: 'updateOrganizationUsers(orgId, {delete})',
      call: (t, ...cb) => t.updateOrganizationUsers(8, { delete: [15] }, ...cb),
      method: 'PATCH', path: '/api/v9/organizations/8/users', body: { delete: [15] }
    },
    {
      name: 'updateOrganizationUsers(orgId, ids)',
      call: (t, ...cb) => t.updateOrganizationUsers(8, [15, 16], ...cb),
      method: 'PATCH', path: '/api/v9/organizations/8/users', body: { delete: [15, 16] }
    },
    {
      name: 'leaveOrganization(orgId)',
      call: (t, ...cb) => t.leaveOrganization(8, ...cb),
      method: 'DELETE', path: '/api/v9/organizations/8/users/leave'
    }
  ]);
});

describe('Groups', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'getGroups(orgId)',
      call: (t, ...cb) => t.getGroups(8, ...cb),
      method: 'GET', path: '/api/v9/organizations/8/groups'
    },
    {
      name: 'getGroups(orgId, options)',
      call: (t, ...cb) => t.getGroups(8, { name: 'Devs', workspace: 1 }, ...cb),
      method: 'GET', path: '/api/v9/organizations/8/groups', query: { name: 'Devs', workspace: '1' }
    },
    {
      name: 'createGroup(orgId, data)',
      call: (t, ...cb) => t.createGroup(8, { name: 'Devs', users: [5], workspaces: [1] }, ...cb),
      method: 'POST', path: '/api/v9/organizations/8/groups', body: { name: 'Devs', users: [5], workspaces: [1] }
    },
    {
      name: 'updateGroup(orgId, id, data)',
      call: (t, ...cb) => t.updateGroup(8, 12, { name: 'Ops' }, ...cb),
      method: 'PUT', path: '/api/v9/organizations/8/groups/12', body: { name: 'Ops' }
    },
    {
      name: 'deleteGroup(orgId, id)',
      call: (t, ...cb) => t.deleteGroup(8, 12, ...cb),
      method: 'DELETE', path: '/api/v9/organizations/8/groups/12'
    },
    {
      name: 'getProjectGroups(wid, projectIds)',
      call: (t, ...cb) => t.getProjectGroups(1, [9, 10], ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/project_groups', query: { project_ids: '9,10' }
    },
    {
      name: 'addProjectGroup(wid, pid, groupId)',
      call: (t, ...cb) => t.addProjectGroup(1, 9, 12, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/project_groups', body: { project_id: 9, group_id: 12 }
    },
    {
      name: 'deleteProjectGroup(wid, id)',
      call: (t, ...cb) => t.deleteProjectGroup(1, 40, ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/project_groups/40'
    }
  ]);
});
