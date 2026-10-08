'use strict';
const TogglClient = require('../../');
const { describeLive, workspaceId } = require('../helpers/live');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describeLive('Testing Time Entries', () => {
  let togglClient
  const created = []
  const newTimeEntry = {
    description: 'Test entry',
    workspace_id: workspaceId
  }

  async function start(data) {
    const timeEntry = await togglClient.startTimeEntry(Object.assign({}, newTimeEntry, data))
    expect(timeEntry).toHaveProperty('id');
    created.push(timeEntry.id)
    return timeEntry
  }

  beforeEach(() => {
    togglClient = new TogglClient({ apiToken: process.env.API_TOKEN });
  });

  afterAll(async () => {
    const toggl = new TogglClient({ apiToken: process.env.API_TOKEN });
    for (const id of created) {
      await toggl.deleteTimeEntry(workspaceId, id).catch(() => {})
    }
  });


  it('should start a new time entry', async () => {
    const timeEntry = await start()
    expect(timeEntry.duration).toBeLessThan(0)
    expect(timeEntry.stop).toBeNull()
  })

  it('should create a finished time entry', async () => {
    const timeEntry = await togglClient.createTimeEntry(Object.assign({}, newTimeEntry, {
      start: new Date(Date.now() - 3_600_000).toISOString(),
      duration: 1_800
    }))
    created.push(timeEntry.id)
    expect(timeEntry.duration).toBe(1_800)
    expect(timeEntry.stop).not.toBeNull()
  })

  it('should start a new time entry (with callback)', done => {
    togglClient.startTimeEntry(newTimeEntry,
      (err, timeEntry) => {
        if (err) {
          return done(err);
        }

        created.push(timeEntry.id)
        expect(timeEntry).toHaveProperty('id');
        return done();
      })
  })

  it('should start a new time entry, edit it, stop it, delete it', async () => {
    const timeEntry = await start()

    const dataToUpdate = {
      description: 'Test entry updated',
      workspace_id: workspaceId,
      id: timeEntry.id
    }

    await togglClient.updateTimeEntry(workspaceId, timeEntry.id, dataToUpdate)
    const updatedEntry = await togglClient.getTimeEntryData(timeEntry.id)
    expect(updatedEntry.description).toBe('Test entry updated')

    const currentTimeEntry = await togglClient.getCurrentTimeEntry()
    expect(currentTimeEntry.id).toBe(updatedEntry.id)

    await sleep(3_000)

    const stoppedEntry = await togglClient.stopTimeEntry(workspaceId, timeEntry.id)
    expect(stoppedEntry.duration).toBeGreaterThanOrEqual(2);

    const deletedEntry = await togglClient.deleteTimeEntry(workspaceId, timeEntry.id)
    expect(deletedEntry).toBeUndefined()
    await expect(togglClient.getTimeEntryData(timeEntry.id)).rejects.toMatchObject({ code: 404 })
  })

  it('should start 2 new time entry, edit it in BULK, stop it', async () => {
    const timeEntry1 = await start()
    const timeEntry2 = await start()

    const dataToUpdate = [
      {
        "op": "replace",
        "path": "/description",
        "value": "Test entry updated 123"
      }
    ]

    const result = await togglClient.updateTimeEntries(workspaceId, [timeEntry1.id, timeEntry2.id], dataToUpdate)
    expect(result.success.sort()).toEqual([timeEntry1.id, timeEntry2.id].sort())

    const updatedEntry1 = await togglClient.getTimeEntryData(timeEntry1.id)
    expect(updatedEntry1.description).toBe('Test entry updated 123')
    const updatedEntry2 = await togglClient.getTimeEntryData(timeEntry2.id)
    expect(updatedEntry2.description).toBe('Test entry updated 123')
  })

  it('should get time entries', async () => {
    const timeEntries = await togglClient.getTimeEntries()
    expect(timeEntries).toBeInstanceOf(Array)
  })


  it('should get time entries with starting and ending dates', async () => {
    const timeEntries = await togglClient.getTimeEntries(
      new Date(Date.now() - 7 * 86_400_000).toISOString(),
      new Date(Date.now() + 86_400_000).toISOString()
    )
    expect(timeEntries).toBeInstanceOf(Array)
    expect(timeEntries.length).toBeGreaterThan(0)
  })

  it('should get time entries with options', async () => {
    const timeEntries = await togglClient.getTimeEntries({ since: Math.floor(Date.now() / 1000) - 3_600 })
    expect(timeEntries).toBeInstanceOf(Array)
  })
});
