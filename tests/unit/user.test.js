'use strict';

const TogglClient = require('../../');
const { useMockServer } = require('../helpers/mock-server');
const { testEndpoints } = require('../helpers/endpoints');

describe('User', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'getUserData()',
      call: (t, ...cb) => t.getUserData(...cb),
      method: 'GET', path: '/api/v9/me',
      reply: { body: { id: 7 } }, result: { id: 7 }
    },
    {
      name: 'getUserData(options)',
      call: (t, ...cb) => t.getUserData({ with_related_data: true }, ...cb),
      method: 'GET', path: '/api/v9/me', query: { with_related_data: 'true' }
    },
    {
      name: 'updateUserData(data)',
      call: (t, ...cb) => t.updateUserData({ fullname: 'Jane' }, ...cb),
      method: 'PUT', path: '/api/v9/me', body: { fullname: 'Jane' }
    },
    {
      name: 'changeUserPassword(current, password)',
      call: (t, ...cb) => t.changeUserPassword('old', 'new', ...cb),
      method: 'PUT', path: '/api/v9/me', body: { current_password: 'old', password: 'new' }
    },
    {
      name: 'getUserOrganizations()',
      call: (t, ...cb) => t.getUserOrganizations(...cb),
      method: 'GET', path: '/api/v9/me/organizations'
    },
    {
      name: 'getUserTags()',
      call: (t, ...cb) => t.getUserTags(...cb),
      method: 'GET', path: '/api/v9/me/tags'
    },
    {
      name: 'getUserTags(options)',
      call: (t, ...cb) => t.getUserTags({ since: 1700000000 }, ...cb),
      method: 'GET', path: '/api/v9/me/tags', query: { since: '1700000000' }
    },
    {
      name: 'getUserFeatures()',
      call: (t, ...cb) => t.getUserFeatures(...cb),
      method: 'GET', path: '/api/v9/me/features'
    },
    {
      name: 'getUserQuota()',
      call: (t, ...cb) => t.getUserQuota(...cb),
      method: 'GET', path: '/api/v9/me/quota'
    },
    {
      name: 'getUserPreferences()',
      call: (t, ...cb) => t.getUserPreferences(...cb),
      method: 'GET', path: '/api/v9/me/preferences'
    },
    {
      name: 'updateUserPreferences(data)',
      call: (t, ...cb) => t.updateUserPreferences({ date_format: 'YYYY-MM-DD' }, ...cb),
      method: 'POST', path: '/api/v9/me/preferences', body: { date_format: 'YYYY-MM-DD' }
    },
    {
      name: 'resetApiToken()',
      call: (t, ...cb) => t.resetApiToken(...cb),
      method: 'POST', path: '/api/v9/me/reset_token',
      reply: { body: 'new-token' }, result: 'new-token'
    }
  ]);

  describe('changeUserPassword()', () => {
    it('uses the password the client was created with', async () => {
      const toggl = ctx.server.client({ apiToken: undefined, username: 'a@b.c', password: 'old' });
      await toggl.changeUserPassword('new');
      expect(ctx.server.last().body).toEqual({ current_password: 'old', password: 'new' });
    });

    it('uses the password the client was created with (callback)', done => {
      const toggl = ctx.server.client({ apiToken: undefined, username: 'a@b.c', password: 'old' });
      toggl.changeUserPassword('new', err => {
        expect(err).toBeNull();
        expect(ctx.server.last().body).toEqual({ current_password: 'old', password: 'new' });
        done();
      });
    });

    it('rejects when the current password is unknown', async () => {
      await expect(ctx.toggl.changeUserPassword('new')).rejects.toThrow('Current password is unknown.');
      expect(ctx.server.requests).toHaveLength(0);
    });

    it('passes the unknown password error to the callback', done => {
      ctx.toggl.changeUserPassword('new', err => {
        expect(err.message).toBe('Current password is unknown.');
        done();
      });
    });
  });

  describe('resetApiToken()', () => {
    it('switches a token client to the new token', async () => {
      ctx.server.respond({ body: 'new-token' });
      await ctx.toggl.resetApiToken();
      expect(ctx.toggl.options.apiToken).toBe('new-token');

      await ctx.toggl.getUserData();
      expect(ctx.server.last().headers.authorization)
        .toBe('Basic ' + Buffer.from('new-token:api_token').toString('base64'));
    });

    it('leaves password clients alone', async () => {
      ctx.server.respond({ body: 'new-token' });
      const toggl = ctx.server.client({ apiToken: undefined, username: 'a@b.c', password: 'pw' });
      await toggl.resetApiToken();
      expect(toggl.options.apiToken).toBeUndefined();
    });

    it('keeps the old token when the reset fails', async () => {
      ctx.server.respond({ status: 403, raw: 'Forbidden', contentType: 'text/plain' });
      await expect(ctx.toggl.resetApiToken()).rejects.toMatchObject({ code: 403 });
      expect(ctx.toggl.options.apiToken).toBe('test-token');
    });
  });

  describe('createUser()', () => {
    beforeEach(() => {
      TogglClient.defaultClient().options.accountsUrl = `${ctx.server.url}/accounts/api/`;
    });

    it('signs up without credentials, with UTC by default', async () => {
      ctx.server.respond({ body: { id: 1 } });
      await expect(TogglClient.createUser('a@b.c', 'pw')).resolves.toEqual({ id: 1 });
      const request = ctx.server.last();
      expect(request).toMatchObject({ method: 'POST', path: '/accounts/api/signup' });
      expect(request.headers.authorization).toBeUndefined();
      expect(request.body).toEqual({ email: 'a@b.c', password: 'pw', timezone: 'UTC' });
    });

    it('takes a timezone', async () => {
      await TogglClient.createUser('a@b.c', 'pw', 'Europe/Rome');
      expect(ctx.server.last().body.timezone).toBe('Europe/Rome');
    });

    it('takes a callback in place of the timezone', done => {
      TogglClient.createUser('a@b.c', 'pw', err => {
        expect(err).toBeNull();
        expect(ctx.server.last().body.timezone).toBe('UTC');
        done();
      });
    });

    it('takes the whole sign up data', done => {
      const data = { email: 'a@b.c', password: 'pw', display_name: 'Jane', tos_accepted_for: 'track' };
      TogglClient.createUser(data, err => {
        expect(err).toBeNull();
        expect(ctx.server.last().body).toEqual(Object.assign({ timezone: 'UTC' }, data));
        done();
      });
    });
  });
});
