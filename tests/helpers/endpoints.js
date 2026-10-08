'use strict';


/**
 * Generates one promise test and one callback test per endpoint case.
 *
 * A case is <code>{name, call, method, path, query, body, reply, result, requests}</code>:
 * - <code>call(toggl, ...cb)</code> calls the method, spreading <code>cb</code>
 *   as the last argument, so the same case runs with and without a callback;
 * - <code>method</code>, <code>path</code>, <code>query</code> and <code>body</code>
 *   describe the expected (last) request, query defaults to <code>{}</code>;
 * - <code>reply</code> is the mock server reply, <code>{body: {ok: true}}</code> by default;
 * - <code>result</code>, when present, is the expected resolved value;
 * - <code>requests</code> is the expected number of requests, 1 by default.
 *
 * @param {Object} ctx Context returned by useMockServer()
 * @param {Object[]} cases
 */
function testEndpoints(ctx, cases) {
  const table = cases.map(c => [c.name, c]);

  function check(c, result) {
    const request = ctx.server.last();
    expect(ctx.server.requests).toHaveLength(c.requests || 1);
    expect(request.method).toBe(c.method);
    expect(request.path).toBe(c.path);
    expect(request.query).toEqual(c.query || {});
    expect(request.body).toEqual(c.body);
    if ('result' in c) {
      expect(result).toEqual(c.result);
    }
  }

  describe('with promises', () => {
    it.each(table)('%s', async (name, c) => {
      ctx.server.respond(c.reply || { body: { ok: true } });
      check(c, await c.call(ctx.toggl));
    });
  });

  describe('with callbacks', () => {
    it.each(table)('%s', (name, c) => {
      ctx.server.respond(c.reply || { body: { ok: true } });
      return new Promise((resolve, reject) => {
        const returned = c.call(ctx.toggl, (err, result) => {
          try {
            expect(err).toBeNull();
            check(c, result);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        expect(returned).toBeUndefined();
      });
    });
  });
}


module.exports = { testEndpoints };
