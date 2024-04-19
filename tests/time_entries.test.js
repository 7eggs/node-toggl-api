'use strict';
const TogglClient = require('../');
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Toggl API Client', () => {
  let togglClient
  const workspaceId = Number(process.env.WORKSPACE_ID)
  const newTimeEntry = {
    description: 'Test entry',
    workspace_id: workspaceId,
    duration: -1,
    start: new Date(Date.now()),
    stop: null
  }

  beforeEach(() => {
    togglClient = new TogglClient({ apiToken: process.env.API_TOKEN });
  });

  afterEach(() => {
    togglClient.destroy();
  });


  it('should start a new time entry (with callback)', done => {
    togglClient.startTimeEntry(newTimeEntry,
      (err, timeEntry) => {
        if (err) {
          return done(err);
        }

        expect(timeEntry).toHaveProperty('id');
        return done();
      })
  })

  it.only('should start a new time entry, edit it, stop it, delete it', async () => {
    const timeEntry = await togglClient.startTimeEntry(newTimeEntry)
    expect(timeEntry).toHaveProperty('id');


    const dataToUpdate = {
      description: 'Test entry updated',
      workspace_id: workspaceId,
      id: timeEntry.id
    }

    await togglClient.updateTimeEntry(workspaceId, timeEntry.id, dataToUpdate)
    const updatedEntry = await togglClient.getTimeEntryData(timeEntry.id)
    expect(updatedEntry.description).toBe('Test entry updated')

    await sleep(3_000)

    const stoppedEntry = await togglClient.stopTimeEntry(workspaceId, timeEntry.id)
    const duration = -stoppedEntry.duration + Date.now() / 1_000
    expect(duration).toBeGreaterThan(2);

    const deletedEntry = await togglClient.deleteTimeEntry(workspaceId, timeEntry.id)
    expect(deletedEntry).toBeUndefined()
  });
});

