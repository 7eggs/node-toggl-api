'use strict';

const { useMockServer } = require('../helpers/mock-server');
const { testEndpoints } = require('../helpers/endpoints');

describe('Tags', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'getTags(wid)',
      call: (t, ...cb) => t.getTags(1, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/tags',
      reply: { body: [{ id: 5, name: 'a' }] }, result: [{ id: 5, name: 'a' }]
    },
    {
      name: 'getTags(wid, options)',
      call: (t, ...cb) => t.getTags(1, { search: 'bug', page: 2, per_page: 10 }, ...cb),
      method: 'GET', path: '/api/v9/workspaces/1/tags',
      query: { search: 'bug', page: '2', per_page: '10' }
    },
    {
      name: 'createTag(wid, name)',
      call: (t, ...cb) => t.createTag(1, 'urgent', ...cb),
      method: 'POST', path: '/api/v9/workspaces/1/tags', body: { name: 'urgent' }
    },
    {
      name: 'updateTagName(wid, id, name)',
      call: (t, ...cb) => t.updateTagName(1, 5, 'renamed', ...cb),
      method: 'PUT', path: '/api/v9/workspaces/1/tags/5', body: { name: 'renamed' }
    },
    {
      name: 'deleteTag(wid, id)',
      call: (t, ...cb) => t.deleteTag(1, 5, ...cb),
      method: 'DELETE', path: '/api/v9/workspaces/1/tags/5'
    },
    {
      name: 'updateTimeEntryTags(wid, id, tags, action)',
      call: (t, ...cb) => t.updateTimeEntryTags(1, 42, ['a'], 'add', ...cb),
      method: 'PUT', path: '/api/v9/workspaces/1/time_entries/42',
      body: { tags: ['a'], tag_action: 'add' }
    },
    {
      name: 'addTimeEntryTags(wid, id, tags)',
      call: (t, ...cb) => t.addTimeEntryTags(1, 42, ['a', 'b'], ...cb),
      method: 'PUT', path: '/api/v9/workspaces/1/time_entries/42',
      body: { tags: ['a', 'b'], tag_action: 'add' }
    },
    {
      name: 'removeTimeEntryTags(wid, id, tags) uses the "delete" tag action',
      call: (t, ...cb) => t.removeTimeEntryTags(1, 42, ['a'], ...cb),
      method: 'PUT', path: '/api/v9/workspaces/1/time_entries/42',
      body: { tags: ['a'], tag_action: 'delete' }
    },
    {
      name: 'updateTimeEntriesTags(wid, ids, tags, action)',
      call: (t, ...cb) => t.updateTimeEntriesTags(1, [42, 43], ['a'], 'replace', ...cb),
      method: 'PATCH', path: '/api/v9/workspaces/1/time_entries/42,43',
      body: [{ op: 'replace', path: '/tags', value: ['a'] }]
    },
    {
      name: 'addTimeEntriesTags(wid, ids, tags)',
      call: (t, ...cb) => t.addTimeEntriesTags(1, [42, 43], ['a'], ...cb),
      method: 'PATCH', path: '/api/v9/workspaces/1/time_entries/42,43',
      body: [{ op: 'add', path: '/tags', value: ['a'] }]
    },
    {
      name: 'removeTimeEntriesTags(wid, ids, tags) uses the "remove" patch op',
      call: (t, ...cb) => t.removeTimeEntriesTags(1, [42], ['a'], ...cb),
      method: 'PATCH', path: '/api/v9/workspaces/1/time_entries/42',
      body: [{ op: 'remove', path: '/tags', value: ['a'] }]
    }
  ]);
});
