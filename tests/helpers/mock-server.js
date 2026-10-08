'use strict';

const http = require('http');
const TogglClient = require('../../');


/**
 * Local HTTP server that records every request and answers with whatever
 * the current responder returns, so the client can be tested end to end
 * (real fetch, real sockets) without touching the Toggl API.
 *
 * A responder returns <code>{status, body, raw, contentType, headers}</code>;
 * every field is optional. <code>body</code> is sent as JSON, <code>raw</code> as is,
 * and <code>hang: true</code> never answers.
 */
async function createMockServer() {
  const requests = [];
  let responder = () => ({});

  const server = http.createServer((req, res) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const url = new URL(req.url, 'http://localhost');
      const text = Buffer.concat(chunks).toString();
      const record = {
        method: req.method,
        path: url.pathname,
        query: Object.fromEntries(url.searchParams),
        headers: req.headers,
        body: text ? JSON.parse(text) : undefined
      };
      requests.push(record);

      const reply = responder(record) || {};
      if (reply.hang) {
        return;
      }
      const status = reply.status || 200;
      let payload = '';
      if (reply.raw !== undefined) {
        payload = reply.raw;
      }
      else if (reply.body !== undefined) {
        payload = JSON.stringify(reply.body);
      }

      res.writeHead(status, Object.assign({
        'Content-Type': reply.contentType || 'application/json; charset=utf-8'
      }, reply.headers));
      res.end(payload);
    });
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;

  return {
    url,
    requests,

    /**
     * @param {Function|Object} reply Responder function, or a fixed reply
     */
    respond(reply) {
      responder = typeof reply === 'function' ? reply : () => reply;
    },

    /** @returns {Object} Last recorded request */
    last() {
      return requests[requests.length - 1];
    },

    reset() {
      requests.length = 0;
      responder = () => ({});
    },

    /**
     * @param {Object} [options] Extra client options
     * @returns {TogglClient} Client pointed at this server
     */
    client(options) {
      return new TogglClient(Object.assign({
        apiToken: 'test-token',
        apiUrl: `${url}/api/v9/`,
        reportsUrl: `${url}/reports/api/v3/`
      }, options));
    },

    close() {
      server.closeAllConnections();
      return new Promise(resolve => server.close(resolve));
    }
  };
}


/**
 * Sets up a mock server for the enclosing describe block and returns an
 * object whose <code>server</code> and <code>toggl</code> fields are filled
 * before each test.
 */
function useMockServer() {
  const ctx = {};

  beforeAll(async () => {
    ctx.server = await createMockServer();
  });

  beforeEach(() => {
    ctx.server.reset();
    ctx.toggl = ctx.server.client();
  });

  afterAll(() => ctx.server.close());

  return ctx;
}


module.exports = { createMockServer, useMockServer };
