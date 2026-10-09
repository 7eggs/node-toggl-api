'use strict';

const { useMockServer } = require('../helpers/mock-server');
const { testEndpoints } = require('../helpers/endpoints');

describe('Workspaces', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'getWorkspaces()',
      call: (t, ...cb) => t.getWorkspaces(...cb),
      method: 'GET', path: '/api/v9/me/workspaces',
      reply: { body: [{ id: 1 }] }, result: [{ id: 1 }]
    },
    {
      name: 'getWorkspaces(options)',
      call: (t, ...cb) => t.getWorkspaces({ since: 1700000000 }, ...cb),
      method: 'GET', path: '/api/v9/me/workspaces', query: { since: '1700000000' }
    },
    {
      name: 'getWorkspaceData(wid)',
      call: (t, ...cb) => t.getWorkspaceData(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1'
    },
    {
      name: 'createWorkspace(orgId, data)',
      call: (t, ...cb) => t.createWorkspace(8, { name: 'W' }, ...cb),
      method: 'POST', path: '/api/v9/organizations/8/workspaces', body: { name: 'W' }
    },
    {
      name: 'updateWorkspace(wid, data)',
      call: (t, ...cb) => t.updateWorkspace(1, { name: 'W2' }, ...cb),
      method: 'PUT', path: '/api/v9/workspaces/1', body: { name: 'W2' }
    },
    {
      name: 'getWorkspaceTags(wid)',
      call: (t, ...cb) => t.getWorkspaceTags(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/tags'
    },
    {
      name: 'getWorkspaceTags(wid, options)',
      call: (t, ...cb) => t.getWorkspaceTags(1, { search: 'x' }, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/tags', query: { search: 'x' }
    },
    {
      name: 'getWorkspaceStatistics(wid)',
      call: (t, ...cb) => t.getWorkspaceStatistics(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/statistics'
    },
    {
      name: 'getWorkspacePreferences(wid)',
      call: (t, ...cb) => t.getWorkspacePreferences(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/preferences'
    },
    {
      name: 'updateWorkspacePreferences(wid, data)',
      call: (t, ...cb) => t.updateWorkspacePreferences(1, { hide_start_end_times: true }, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/preferences', body: { hide_start_end_times: true }
    },
    {
      name: 'getTimeEntryConstraints(wid)',
      call: (t, ...cb) => t.getTimeEntryConstraints(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/time_entry_constraints'
    },
    {
      name: 'getAlerts(wid)',
      call: (t, ...cb) => t.getAlerts(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/alerts'
    },
    {
      name: 'createAlert(wid, data)',
      call: (t, ...cb) => t.createAlert(1, { project_id: 9, thresholds: [80] }, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/alerts', body: { project_id: 9, thresholds: [80] }
    },
    {
      name: 'updateAlert(wid, id, data)',
      call: (t, ...cb) => t.updateAlert(1, 2, { thresholds: [90] }, ...cb),
      method: 'PUT', path: '/api/v9/workspaces/1/alerts/2', body: { thresholds: [90] }
    },
    {
      name: 'deleteAlert(wid, id)',
      call: (t, ...cb) => t.deleteAlert(1, 2, ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/alerts/2'
    },
    {
      name: 'getTrackReminders(wid)',
      call: (t, ...cb) => t.getTrackReminders(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/track_reminders'
    },
    {
      name: 'createTrackReminder(wid, data)',
      call: (t, ...cb) => t.createTrackReminder(1, { frequency: 1, threshold: 8 }, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/track_reminders', body: { frequency: 1, threshold: 8 }
    },
    {
      name: 'updateTrackReminder(wid, id, data)',
      call: (t, ...cb) => t.updateTrackReminder(1, 4, { threshold: 6 }, ...cb),
      method: 'PUT', path: '/api/v9/workspaces/1/track_reminders/4', body: { threshold: 6 }
    },
    {
      name: 'deleteTrackReminder(wid, id)',
      call: (t, ...cb) => t.deleteTrackReminder(1, 4, ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/track_reminders/4'
    }
  ]);
});

describe('Workspace users', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'getWorkspaceUsers(wid)',
      call: (t, ...cb) => t.getWorkspaceUsers(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/users'
    },
    {
      name: 'getWorkspaceUsers(wid, options)',
      call: (t, ...cb) => t.getWorkspaceUsers(1, { exclude_deleted: true }, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/users', query: { exclude_deleted: 'true' }
    },
    {
      name: 'getWorkspaceWorkspaceUsers(wid)',
      call: (t, ...cb) => t.getWorkspaceWorkspaceUsers(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/workspace_users'
    },
    {
      name: 'getWorkspaceWorkspaceUsers(wid, options)',
      call: (t, ...cb) => t.getWorkspaceWorkspaceUsers(1, { includeIndirect: true }, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/workspace_users', query: { includeIndirect: 'true' }
    },
    {
      name: 'getOrganizationWorkspaceUsers(orgId, wid)',
      call: (t, ...cb) => t.getOrganizationWorkspaceUsers(8, 1, ...cb),
      method: 'GET', path: '/api/v9/organizations/8/workspaces/1/workspace_users'
    },
    {
      name: 'getOrganizationWorkspaceUsers(orgId, wid, options)',
      call: (t, ...cb) => t.getOrganizationWorkspaceUsers(8, 1, { active: true, page: 1 }, ...cb),
      method: 'GET', path: '/api/v9/organizations/8/workspaces/1/workspace_users',
      query: { active: 'true', page: '1' }
    },
    {
      name: 'updateWorkspaceUsers(orgId, wid, {delete})',
      call: (t, ...cb) => t.updateWorkspaceUsers(8, 1, { delete: [5] }, ...cb),
      method: 'PATCH', path: '/api/v9/organizations/8/workspaces/1/workspace_users', body: { delete: [5] }
    },
    {
      name: 'updateWorkspaceUsers(orgId, wid, ids)',
      call: (t, ...cb) => t.updateWorkspaceUsers(8, 1, [5, 6], ...cb),
      method: 'PATCH', path: '/api/v9/organizations/8/workspaces/1/workspace_users', body: { delete: [5, 6] }
    },
    {
      name: 'updateWorkspaceUser(wid, wuId, data)',
      call: (t, ...cb) => t.updateWorkspaceUser(1, 5, { admin: true }, ...cb),
      method: 'PUT', path: '/api/v9/workspaces/1/workspace_users/5', body: { admin: true }
    },
    {
      name: 'deleteWorkspaceUser(wid, wuId)',
      call: (t, ...cb) => t.deleteWorkspaceUser(1, 5, ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/workspace_users/5'
    }
  ]);
});
