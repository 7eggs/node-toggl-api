'use strict';

const { ReportError } = require('../../lib/errors');
const { useMockServer } = require('../helpers/mock-server');
const { testEndpoints } = require('../helpers/endpoints');

const range = { start_date: '2024-01-01', end_date: '2024-01-31' };

describe('Reports', () => {
  const ctx = useMockServer();

  testEndpoints(ctx, [
    {
      name: 'detailedReport(wid, options)',
      call: (t, ...cb) => t.detailedReport(1, Object.assign({ page_size: 10 }, range), ...cb),
      method: 'POST', path: '/reports/api/v3/workspace/1/search/time_entries',
      body: Object.assign({ page_size: 10 }, range),
      reply: { body: [{ user_id: 5, time_entries: [] }] }, result: [{ user_id: 5, time_entries: [] }]
    },
    {
      name: 'detailedReport(wid)',
      call: (t, ...cb) => t.detailedReport(1, ...cb),
      method: 'POST', path: '/reports/api/v3/workspace/1/search/time_entries', body: {}
    },
    {
      name: 'detailedReportPage(wid, options)',
      call: (t, ...cb) => t.detailedReportPage(1, range, ...cb),
      method: 'POST', path: '/reports/api/v3/workspace/1/search/time_entries', body: range,
      reply: { body: [{ id: 1 }], headers: { 'X-Next-ID': '77', 'X-Next-Row-Number': '51' } },
      result: { data: [{ id: 1 }], nextId: 77, nextRowNumber: 51 }
    },
    {
      name: 'detailedReportPage(wid)',
      call: (t, ...cb) => t.detailedReportPage(1, ...cb),
      method: 'POST', path: '/reports/api/v3/workspace/1/search/time_entries', body: {}
    },
    {
      name: 'detailedReportPage(wid, options) on the last page',
      call: (t, ...cb) => t.detailedReportPage(1, range, ...cb),
      method: 'POST', path: '/reports/api/v3/workspace/1/search/time_entries', body: range,
      reply: { body: [] },
      result: { data: [], nextId: null, nextRowNumber: null }
    },
    {
      name: 'detailedReportTotals(wid, options)',
      call: (t, ...cb) => t.detailedReportTotals(1, Object.assign({ with_graph: true }, range), ...cb),
      method: 'POST', path: '/reports/api/v3/workspace/1/search/time_entries/totals',
      body: Object.assign({ with_graph: true }, range)
    },
    {
      name: 'summaryReport(wid, options)',
      call: (t, ...cb) => t.summaryReport(1, Object.assign({ grouping: 'projects' }, range), ...cb),
      method: 'POST', path: '/reports/api/v3/workspace/1/summary/time_entries',
      body: Object.assign({ grouping: 'projects' }, range)
    },
    {
      name: 'projectSummaryReport(wid, pid, options)',
      call: (t, ...cb) => t.projectSummaryReport(1, 9, range, ...cb),
      method: 'POST', path: '/reports/api/v3/workspace/1/projects/9/summary', body: range
    },
    {
      name: 'projectSummaryReport(wid, pid)',
      call: (t, ...cb) => t.projectSummaryReport(1, 9, ...cb),
      method: 'POST', path: '/reports/api/v3/workspace/1/projects/9/summary', body: {}
    },
    {
      name: 'weeklyReport(wid, options)',
      call: (t, ...cb) => t.weeklyReport(1, range, ...cb),
      method: 'POST', path: '/reports/api/v3/workspace/1/weekly/time_entries', body: range
    },
    {
      name: 'savedReport(token)',
      call: (t, ...cb) => t.savedReport('tok', ...cb),
      method: 'POST', path: '/reports/api/v3/shared/tok', body: {}
    },
    {
      name: 'savedReport(token, options)',
      call: (t, ...cb) => t.savedReport('tok', { page_size: 5 }, ...cb),
      method: 'POST', path: '/reports/api/v3/shared/tok', body: { page_size: 5 }
    },
    {
      name: 'exportDetailedReport(wid, format, options)',
      call: (t, ...cb) => t.exportDetailedReport(1, 'csv', range, ...cb),
      method: 'POST', path: '/reports/api/v3/workspace/1/search/time_entries.csv', body: range,
      reply: { raw: 'a,b\n1,2\n', contentType: 'text/csv' }, result: Buffer.from('a,b\n1,2\n')
    },
    {
      name: 'exportSummaryReport(wid, format, options)',
      call: (t, ...cb) => t.exportSummaryReport(1, 'pdf', range, ...cb),
      method: 'POST', path: '/reports/api/v3/workspace/1/summary/time_entries.pdf', body: range,
      reply: { raw: '%PDF', contentType: 'application/pdf' }, result: Buffer.from('%PDF')
    },
    {
      name: 'exportWeeklyReport(wid, format, options)',
      call: (t, ...cb) => t.exportWeeklyReport(1, 'csv', range, ...cb),
      method: 'POST', path: '/reports/api/v3/workspace/1/weekly/time_entries.csv', body: range,
      reply: { raw: 'x', contentType: 'text/csv' }, result: Buffer.from('x')
    }
  ]);

  it('sends the API credentials to the reports API', async () => {
    await ctx.toggl.weeklyReport(1, range);
    expect(ctx.server.last().headers.authorization)
      .toBe('Basic ' + Buffer.from('test-token:api_token').toString('base64'));
  });

  it('rejects report errors with a ReportError', async () => {
    ctx.server.respond({ status: 400, raw: 'start_date must be before end_date', contentType: 'text/plain' });
    const error = await ctx.toggl.summaryReport(1, range).catch(e => e);
    expect(error).toBeInstanceOf(ReportError);
    expect(error).toMatchObject({ code: 400, message: 'start_date must be before end_date' });
  });

  it('sends numeric string IDs in ID filters as numbers', async () => {
    const options = Object.assign({ user_ids: ['1757147', 1757126], tag_ids: [null, '5'], description: '42' }, range);
    await ctx.toggl.detailedReport(1, options);
    expect(ctx.server.last().body).toEqual(Object.assign({}, range, {
      user_ids: [1757147, 1757126], tag_ids: [null, 5], description: '42'
    }));
    expect(options.user_ids).toEqual(['1757147', 1757126]);

    await ctx.toggl.exportSummaryReport(1, 'pdf', Object.assign({ project_ids: ['9'] }, range));
    expect(ctx.server.last().body.project_ids).toEqual([9]);

    await ctx.toggl.detailedReportPage(1, Object.assign({ client_ids: ['3'] }, range));
    expect(ctx.server.last().body.client_ids).toEqual([3]);
  });

  it('parses export errors instead of returning them as a file', async () => {
    ctx.server.respond({ status: 402, raw: 'Feature not available', contentType: 'text/plain' });
    await expect(ctx.toggl.exportDetailedReport(1, 'pdf', range))
      .rejects.toMatchObject({ name: 'ReportError', code: 402, message: 'Feature not available' });
  });

  it('pages through a detailed report with detailedReportPage()', async () => {
    const pages = { undefined: ['51', [1]], 51: ['101', [2]], 101: [null, [3]] };
    ctx.server.respond(r => {
      const [next, body] = pages[r.body.first_row_number];
      return { body, headers: next ? { 'X-Next-Row-Number': next } : {} };
    });

    const rows = [];
    let options = Object.assign({}, range);
    for (;;) {
      const page = await ctx.toggl.detailedReportPage(1, options);
      rows.push(...page.data);
      if (page.nextRowNumber === null) {
        break;
      }
      options = Object.assign({}, range, { first_row_number: page.nextRowNumber });
    }

    expect(rows).toEqual([1, 2, 3]);
    expect(ctx.server.requests).toHaveLength(3);
  });
});
