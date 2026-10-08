'use strict';

const TogglClient = require('../../');
const { APIError, ReportError } = require('../../lib/errors');
const utils = require('../../lib/utils');
const { execFileSync } = require('child_process');
const { createMockServer, useMockServer } = require('../helpers/mock-server');

function basic(credentials) {
  return 'Basic ' + Buffer.from(credentials).toString('base64');
}

describe('TogglClient core', () => {
  const ctx = useMockServer();

  describe('authentication', () => {
    it('sends the API token as HTTP Basic auth', async () => {
      await ctx.toggl.apiRequest('me');
      expect(ctx.server.last().headers.authorization).toBe(basic('test-token:api_token'));
    });

    it('sends e-mail and password as HTTP Basic auth', async () => {
      const toggl = ctx.server.client({ apiToken: undefined, username: 'a@b.c', password: 'pw' });
      await toggl.apiRequest('me');
      expect(ctx.server.last().headers.authorization).toBe(basic('a@b.c:pw'));
    });

    it('prefers the API token over e-mail and password', async () => {
      const toggl = ctx.server.client({ username: 'a@b.c', password: 'pw' });
      await toggl.apiRequest('me');
      expect(ctx.server.last().headers.authorization).toBe(basic('test-token:api_token'));
    });

    it('rejects without sending anything when there are no credentials', async () => {
      const toggl = ctx.server.client({ apiToken: undefined });
      await expect(toggl.apiRequest('me')).rejects.toThrow(/No credentials/);
      expect(ctx.server.requests).toHaveLength(0);
    });

    it('skips the credentials for noauth requests', async () => {
      const toggl = ctx.server.client({ apiToken: undefined });
      await toggl.apiRequest('status', { noauth: true });
      expect(ctx.server.last().headers.authorization).toBeUndefined();
    });

    it('authenticate() loads the current user into authData', async () => {
      ctx.server.respond({ body: { id: 7, email: 'a@b.c' } });
      const toggl = ctx.server.client({ apiToken: undefined, username: 'a@b.c', password: 'pw' });

      const user = await toggl.authenticate();

      expect(user).toEqual({ id: 7, email: 'a@b.c' });
      expect(toggl.authData).toEqual(user);
      expect(ctx.server.last()).toMatchObject({ method: 'GET', path: '/api/v9/me' });
    });

    it('authenticate() reports bad credentials', async () => {
      ctx.server.respond({ status: 403, raw: 'Incorrect username and/or password', contentType: 'text/plain' });
      const toggl = ctx.server.client({ apiToken: undefined, username: 'a@b.c', password: 'bad' });

      await expect(toggl.authenticate()).rejects.toMatchObject({
        name: 'APIError',
        code: 403,
        message: 'Incorrect username and/or password'
      });
      expect(toggl.authData).toBeNull();
    });

    it('authenticate() supports callbacks', done => {
      ctx.server.respond({ body: { id: 7 } });
      ctx.toggl.authenticate((err, user) => {
        expect(err).toBeNull();
        expect(user).toEqual({ id: 7 });
        done();
      });
    });
  });

  describe('requests', () => {
    it('sends identification headers', async () => {
      await ctx.toggl.apiRequest('me');
      const headers = ctx.server.last().headers;
      expect(headers['user-agent']).toBe(TogglClient.USER_AGENT);
      expect(headers.accept).toBe('application/json');
    });

    it('sends JSON bodies', async () => {
      await ctx.toggl.apiRequest('things', { method: 'POST', body: { a: 1, list: [1, 2] } });
      const request = ctx.server.last();
      expect(request.method).toBe('POST');
      expect(request.headers['content-type']).toBe('application/json');
      expect(request.body).toEqual({ a: 1, list: [1, 2] });
    });

    it('sends no body nor content type when there is no body', async () => {
      await ctx.toggl.apiRequest('things', { method: 'DELETE' });
      expect(ctx.server.last().headers['content-type']).toBeUndefined();
      expect(ctx.server.last().body).toBeUndefined();
    });

    it('serializes query strings', async () => {
      const date = new Date('2024-01-02T03:04:05.000Z');
      await ctx.toggl.apiRequest('things', {
        qs: { a: 1, b: true, c: 'x y', ids: [1, 2, 3], since: date, skip: undefined, nil: null }
      });
      expect(ctx.server.last().query).toEqual({
        a: '1', b: 'true', c: 'x y', ids: '1,2,3', since: '2024-01-02T03:04:05.000Z'
      });
    });

    it('joins base URLs and paths with a single slash', async () => {
      const toggl = ctx.server.client({ apiUrl: `${ctx.server.url}/api/v9` });
      await toggl.apiRequest('/me');
      expect(ctx.server.last().path).toBe('/api/v9/me');
    });

    it('works with opts omitted', async () => {
      ctx.server.respond({ body: { ok: true } });
      await expect(ctx.toggl.apiRequest('me')).resolves.toEqual({ ok: true });
    });

    it('resolves with undefined for empty bodies', async () => {
      await expect(ctx.toggl.apiRequest('me', { method: 'DELETE' })).resolves.toBeUndefined();
    });

    it('resolves with text for non-JSON bodies', async () => {
      ctx.server.respond({ raw: 'OK', contentType: 'text/plain' });
      await expect(ctx.toggl.apiRequest('me')).resolves.toBe('OK');
    });

    it('resolves with a Buffer for binary requests', async () => {
      ctx.server.respond({ raw: '%PDF-1.4', contentType: 'application/pdf' });
      const data = await ctx.toggl.apiRequest('report.pdf', { binary: true });
      expect(Buffer.isBuffer(data)).toBe(true);
      expect(data.toString()).toBe('%PDF-1.4');
      expect(ctx.server.last().headers.accept).toBe('*/*');
    });

    it('resolves with headers and status for raw requests', async () => {
      ctx.server.respond({ body: [1], headers: { 'X-Next-Row-Number': '51' } });
      const result = await ctx.toggl.apiRequest('me', { raw: true });
      expect(result.data).toEqual([1]);
      expect(result.status).toBe(200);
      expect(result.headers.get('x-next-row-number')).toBe('51');
    });

    it('uses a custom fetch implementation', async () => {
      const calls = [];
      const toggl = ctx.server.client({
        fetch: (url, init) => {
          calls.push({ url, init });
          return Promise.resolve(new Response('{"id":1}', { status: 200 }));
        }
      });
      await expect(toggl.apiRequest('me')).resolves.toEqual({ id: 1 });
      expect(calls).toHaveLength(1);
      expect(calls[0].url).toBe(`${ctx.server.url}/api/v9/me`);
      expect(ctx.server.requests).toHaveLength(0);
    });

    it('aborts requests that exceed the timeout', async () => {
      const slow = await createMockServer();
      const toggl = slow.client({ timeout: 50 });
      slow.respond({ hang: true });
      try {
        await expect(toggl.apiRequest('me', {})).rejects.toThrow();
      } finally {
        await slow.close();
      }
    });
  });

  describe('errors', () => {
    it('rejects with an APIError carrying the status and plain-text message', async () => {
      ctx.server.respond({ status: 400, raw: 'Workspace not found', contentType: 'text/plain' });
      const error = await ctx.toggl.apiRequest('me').catch(e => e);
      expect(error).toBeInstanceOf(APIError);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('APIError');
      expect(error.code).toBe(400);
      expect(error.message).toBe('Workspace not found');
      expect(error.data).toBe('Workspace not found');
    });

    it('uses JSON string error bodies as the message', async () => {
      ctx.server.respond({ status: 400, body: 'invalid duration' });
      await expect(ctx.toggl.apiRequest('me')).rejects.toMatchObject({ message: 'invalid duration' });
    });

    it('uses JSON object error bodies as the message', async () => {
      ctx.server.respond({ status: 400, body: { error: { message: 'Bad filter', code: 10 } } });
      await expect(ctx.toggl.apiRequest('me')).rejects.toMatchObject({
        message: 'Bad filter',
        data: { error: { message: 'Bad filter', code: 10 } }
      });
    });

    it('uses the message field of JSON error bodies', async () => {
      ctx.server.respond({ status: 429, body: { message: 'Too many requests' } });
      await expect(ctx.toggl.apiRequest('me')).rejects.toMatchObject({ code: 429, message: 'Too many requests' });
    });

    it('keeps legacy array error bodies in errors', async () => {
      ctx.server.respond({ status: 400, body: ['first', 'second'] });
      await expect(ctx.toggl.apiRequest('me')).rejects.toMatchObject({
        message: 'first',
        errors: ['first', 'second']
      });
    });

    it('has a generic message for empty error bodies', async () => {
      ctx.server.respond({ status: 500 });
      await expect(ctx.toggl.apiRequest('me')).rejects.toMatchObject({
        code: 500,
        message: 'Toggl API error: HTTP 500'
      });
    });

    it('rejects with network errors', async () => {
      const toggl = new TogglClient({ apiToken: 't', apiUrl: 'http://127.0.0.1:1/' });
      await expect(toggl.apiRequest('me')).rejects.toThrow();
    });

    it('rejects reports errors with a ReportError', async () => {
      ctx.server.respond({ status: 402, raw: 'Payment required', contentType: 'text/plain' });
      const error = await ctx.toggl.reportsRequest('workspace/1/weekly/time_entries', { method: 'POST' })
        .catch(e => e);
      expect(error).toBeInstanceOf(ReportError);
      expect(error).toBeInstanceOf(APIError);
      expect(error).toMatchObject({ name: 'ReportError', code: 402, message: 'Payment required' });
    });

    it('exposes the error classes on the client', () => {
      expect(TogglClient.APIError).toBe(APIError);
      expect(TogglClient.ReportError).toBe(ReportError);
    });
  });

  describe('callbacks', () => {
    it('passes data to the callback and returns undefined', done => {
      ctx.server.respond({ body: { id: 1 } });
      const result = ctx.toggl.apiRequest('me', {}, (err, data) => {
        expect(err).toBeNull();
        expect(data).toEqual({ id: 1 });
        done();
      });
      expect(result).toBeUndefined();
    });

    it('passes errors to the callback', done => {
      ctx.server.respond({ status: 404, raw: 'Not found', contentType: 'text/plain' });
      ctx.toggl.apiRequest('me', {}, err => {
        expect(err).toBeInstanceOf(APIError);
        expect(err.code).toBe(404);
        done();
      });
    });

    it('accepts the callback in place of opts', done => {
      ctx.server.respond({ body: { id: 1 } });
      ctx.toggl.apiRequest('me', (err, data) => {
        expect(data).toEqual({ id: 1 });
        done();
      });
    });

    it('passes missing credentials errors to the callback', done => {
      const toggl = ctx.server.client({ apiToken: undefined });
      toggl.apiRequest('me', {}, err => {
        expect(err.message).toMatch(/No credentials/);
        done();
      });
    });

    it('does not turn exceptions thrown by the callback into rejections', () => {
      // Jest traps uncaught exceptions, so check this in a plain Node process
      const script = `
        const utils = require(${JSON.stringify(require.resolve('../../lib/utils'))});
        process.on('uncaughtException', e => console.log('uncaughtException:' + e.message));
        process.on('unhandledRejection', e => console.log('unhandledRejection:' + e.message));
        utils.callbackify(Promise.resolve(1), () => { throw new Error('boom'); });
      `;
      const output = execFileSync(process.execPath, ['-e', script]).toString().trim();
      expect(output).toBe('uncaughtException:boom');
    });
  });

  describe('defaults', () => {
    afterEach(() => {
      TogglClient.setDefaults({ apiUrl: 'https://api.track.toggl.com/api/v9/' });
    });

    it('points at the v9 and reports v3 APIs', () => {
      const toggl = new TogglClient();
      expect(toggl.options.apiUrl).toBe('https://api.track.toggl.com/api/v9/');
      expect(toggl.options.reportsUrl).toBe('https://api.track.toggl.com/reports/api/v3/');
    });

    it('setDefaults() changes the options of new clients', () => {
      TogglClient.setDefaults({ apiUrl: 'http://example.test/' });
      expect(new TogglClient().options.apiUrl).toBe('http://example.test/');
    });

    it('defaultClient() returns a shared instance', () => {
      expect(TogglClient.defaultClient()).toBe(TogglClient.defaultClient());
    });

    it('destroy() is safe to call', () => {
      expect(() => ctx.toggl.destroy()).not.toThrow();
    });

    it('identifies itself with the package version', () => {
      expect(TogglClient.USER_AGENT).toBe('node-toggl-api v' + require('../../package.json').version);
    });
  });
});

describe('utils', () => {
  it('path`` encodes segments and joins arrays', () => {
    expect(utils.path`workspaces/${1}/time_entries/${[2, 3]}`).toBe('workspaces/1/time_entries/2,3');
    expect(utils.path`invitations/${'a/b c'}`).toBe('invitations/a%2Fb%20c');
  });

  it('path`` refuses missing IDs instead of calling the wrong endpoint', () => {
    expect(() => utils.path`workspaces/${undefined}/tags`).toThrow(TypeError);
    expect(() => utils.path`workspaces/${null}/tags`).toThrow(TypeError);
    expect(() => utils.path`workspaces/${''}/tags`).toThrow(TypeError);
  });

  it('queryString() returns an empty string when there is nothing to send', () => {
    expect(utils.queryString()).toBe('');
    expect(utils.queryString({ a: undefined })).toBe('');
  });

  it('optional() shifts the callback', () => {
    const cb = () => {};
    expect(utils.optional(cb, undefined, {})).toEqual([{}, cb]);
    expect(utils.optional({ a: 1 }, cb, {})).toEqual([{ a: 1 }, cb]);
    expect(utils.optional(undefined, cb, 'x')).toEqual(['x', cb]);
  });

  it('parseBody() handles JSON, text and empty bodies', () => {
    expect(utils.parseBody('')).toBeUndefined();
    expect(utils.parseBody('{"a":1}')).toEqual({ a: 1 });
    expect(utils.parseBody('null')).toBeNull();
    expect(utils.parseBody('plain text')).toBe('plain text');
  });
});
