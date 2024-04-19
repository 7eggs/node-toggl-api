'use strict';
const TogglClient = require('../');
require('dotenv').config()

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

  it('should start a new time entry (with promise)', async () => {
    const timeEntry = await togglClient.startTimeEntry(newTimeEntry)
    expect(timeEntry).toHaveProperty('id');
  })

  it('should start a new time entry, and stop it 3 seconds later', done => {
    togglClient.startTimeEntry(newTimeEntry, (err, timeEntry) => {
      if (err) {
        return done(err);

      }
      expect(timeEntry).toHaveProperty('id');

      setTimeout(() => {
        togglClient.stopTimeEntry(workspaceId, timeEntry.id,
          (err, timeEntry) => {
            if (err) {
              return done(err);
            }

            const duration = -timeEntry.duration + Date.now() / 1_000
            expect(duration).toBeGreaterThan(2);
            done();
          });
      }, 3_000);
    });
  });
});

