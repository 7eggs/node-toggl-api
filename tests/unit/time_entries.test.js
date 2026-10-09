'use strict';

const TogglClient = require('../../');
const { useMockServer } = require('../helpers/mock-server');
const { testEndpoints } = require('../helpers/endpoints');

const createdWith = TogglClient.USER_AGENT;

describe('Time entries', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'getTimeEntries() without filters',
      call: (t, ...cb) => t.getTimeEntries(...cb),
      method: 'GET', path: '/api/v9/me/time_entries'
    },
    {
      name: 'getTimeEntries(options)',
      call: (t, ...cb) => t.getTimeEntries({ since: 1700000000, meta: true }, ...cb),
      method: 'GET', path: '/api/v9/me/time_entries',
      query: { since: '1700000000', meta: 'true' }
    },
    {
      name: 'getTimeEntries(startDate, endDate) with strings',
      call: (t, ...cb) => t.getTimeEntries('2024-03-25', '2024-05-25', ...cb),
      method: 'GET', path: '/api/v9/me/time_entries',
      query: { start_date: '2024-03-25', end_date: '2024-05-25' }
    },
    {
      name: 'getTimeEntries(startDate, endDate) with Dates and timestamps',
      call: (t, ...cb) => t.getTimeEntries(new Date('2024-03-25T00:00:00Z'), Date.UTC(2024, 4, 25), ...cb),
      method: 'GET', path: '/api/v9/me/time_entries',
      query: { start_date: '2024-03-25T00:00:00.000Z', end_date: '2024-05-25T00:00:00.000Z' }
    },
    {
      name: 'getCurrentTimeEntry()',
      call: (t, ...cb) => t.getCurrentTimeEntry(...cb),
      method: 'GET', path: '/api/v9/me/time_entries/current',
      reply: { body: null }, result: null
    },
    {
      name: 'getTimeEntryData(id)',
      call: (t, ...cb) => t.getTimeEntryData(42, ...cb),
      method: 'GET', path: '/api/v9/me/time_entries/42',
      reply: { body: { id: 42 } }, result: { id: 42 }
    },
    {
      name: 'getTimeEntryData(id, options)',
      call: (t, ...cb) => t.getTimeEntryData(42, { meta: true }, ...cb),
      method: 'GET', path: '/api/v9/me/time_entries/42', query: { meta: 'true' }
    },
    {
      name: 'startTimeEntry(data) with an explicit start',
      call: (t, ...cb) => t.startTimeEntry({ workspace_id: 1, description: 'Work', start: '2024-01-01T10:00:00Z', duration: 30 }, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/time_entries',
      body: { workspace_id: 1, description: 'Work', start: '2024-01-01T10:00:00Z', duration: -1, created_with: createdWith }
    },
    {
      name: 'startTimeEntry(data) with wid',
      call: (t, ...cb) => t.startTimeEntry({ wid: 3, start: '2024-01-01T10:00:00Z', created_with: 'my app' }, ...cb),
      method: 'POST', path: '/api/v9/workspaces/3/time_entries',
      body: { wid: 3, workspace_id: 3, start: '2024-01-01T10:00:00Z', duration: -1, created_with: 'my app' }
    },
    {
      name: 'createTimeEntry(data)',
      call: (t, ...cb) => t.createTimeEntry({ workspace_id: 1, start: '2024-01-01T10:00:00Z', duration: 3600 }, ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/time_entries',
      body: { workspace_id: 1, start: '2024-01-01T10:00:00Z', duration: 3600, created_with: createdWith }
    },
    {
      name: 'updateTimeEntry(wid, id, data)',
      call: (t, ...cb) => t.updateTimeEntry(1, 42, { description: 'Updated' }, ...cb),
      method: 'PUT', path: '/api/v9/workspaces/1/time_entries/42',
      body: { description: 'Updated' }
    },
    {
      name: 'updateTimeEntries(wid, ids, operations)',
      call: (t, ...cb) => t.updateTimeEntries(1, [42, 43], [{ op: 'replace', path: '/description', value: 'Bulk' }], ...cb),
      method: 'PATCH', path: '/api/v9/workspaces/1/time_entries/42,43',
      body: [{ op: 'replace', path: '/description', value: 'Bulk' }],
      reply: { body: { success: [42, 43], failure: [] } }, result: { success: [42, 43], failure: [] }
    },
    {
      name: 'deleteTimeEntry(wid, id)',
      call: (t, ...cb) => t.deleteTimeEntry(1, 42, ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/time_entries/42',
      reply: {}, result: undefined
    },
    {
      name: 'stopTimeEntry(wid, id)',
      call: (t, ...cb) => t.stopTimeEntry(1, 42, ...cb),
      method: 'PATCH', path: '/api/v9/workspaces/1/time_entries/42/stop'
    }
  ]);

  it('startTimeEntry() starts now by default', async () => {
    const before = Date.now();
    await ctx.toggl.startTimeEntry({ workspace_id: 1, description: 'Now' });
    const start = Date.parse(ctx.server.last().body.start);
    expect(start).toBeGreaterThanOrEqual(before - 1000);
    expect(start).toBeLessThanOrEqual(Date.now());
  });

  it('startTimeEntry() and createTimeEntry() do not modify the data passed in', async () => {
    const data = { workspace_id: 1, start: '2024-01-01T10:00:00Z' };
    await ctx.toggl.startTimeEntry(data);
    await ctx.toggl.createTimeEntry(data);
    expect(data).toEqual({ workspace_id: 1, start: '2024-01-01T10:00:00Z' });
  });

  it('createTimeEntry() does not turn the entry into a running one', async () => {
    await ctx.toggl.createTimeEntry({ workspace_id: 1, start: '2024-01-01T10:00:00Z', stop: '2024-01-01T11:00:00Z' });
    expect(ctx.server.last().body).not.toHaveProperty('duration');
  });

  it('refuses to start an entry without a workspace', () => {
    expect(() => ctx.toggl.startTimeEntry({ description: 'Nowhere' })).toThrow(TypeError);
    expect(ctx.server.requests).toHaveLength(0);
  });
});
