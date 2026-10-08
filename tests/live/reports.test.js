'use strict';
const TogglClient = require('../../');
const { describeLive, workspaceId } = require('../helpers/live');

describeLive('Testing Reports', () => {
  let togglClient
  const day = 86_400_000
  const range = {
    start_date: new Date(Date.now() - 30 * day).toISOString().slice(0, 10),
    end_date: new Date(Date.now() + day).toISOString().slice(0, 10)
  }

  beforeEach(() => {
    togglClient = new TogglClient({ apiToken: process.env.API_TOKEN });
  });

  it('should load a detailed report', async () => {
    const rows = await togglClient.detailedReport(workspaceId, range)
    expect(rows).toBeInstanceOf(Array)
  })

  it('should load a detailed report page', async () => {
    const page = await togglClient.detailedReportPage(workspaceId, Object.assign({ page_size: 1 }, range))
    expect(page.data).toBeInstanceOf(Array)
    expect(page).toHaveProperty('nextRowNumber')
  })

  it('should load a summary report', async () => {
    const report = await togglClient.summaryReport(workspaceId, Object.assign({ grouping: 'projects' }, range))
    expect(report).toHaveProperty('groups')
  })

  it('should load a weekly report', async () => {
    const report = await togglClient.weeklyReport(workspaceId, range)
    expect(report).toBeInstanceOf(Array)
  })

  it('should export a detailed report as CSV', async () => {
    const csv = await togglClient.exportDetailedReport(workspaceId, 'csv', range)
    expect(Buffer.isBuffer(csv)).toBe(true)
  })
});
