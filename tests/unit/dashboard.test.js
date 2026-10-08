'use strict';

const { useMockServer } = require('../helpers/mock-server');
const { testEndpoints } = require('../helpers/endpoints');

describe('Dashboard', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'getDashboard(wid)',
      call: (t, ...cb) => t.getDashboard(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/dashboard/all_activity'
    },
    {
      name: 'getDashboard(wid, options)',
      call: (t, ...cb) => t.getDashboard(1, { since: 1700000000 }, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/dashboard/all_activity', query: { since: '1700000000' }
    },
    {
      name: 'getMostActiveUsers(wid)',
      call: (t, ...cb) => t.getMostActiveUsers(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/dashboard/most_active'
    },
    {
      name: 'getTopActivity(wid, options)',
      call: (t, ...cb) => t.getTopActivity(1, { since: 1700000000 }, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/dashboard/top_activity', query: { since: '1700000000' }
    }
  ]);
});
