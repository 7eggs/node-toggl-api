'use strict';
const TogglClient = require('../');
require('dotenv').config()

describe('Toggl API Client', () => {
  let toggl
  const workspaceId = Number(process.env.WORKSPACE_ID)

  beforeEach(() => {
    toggl = new TogglClient({ apiToken: process.env.API_TOKEN });
  });

  afterEach(() => {
    toggl.destroy();
  });

  const newTimeEntry = {
    description: 'Test entry',
    workspace_id: workspaceId,
    duration: -1,
    start: new Date(Date.now()),
    stop: null
  }

  it('should start a new time entry', done => {
    toggl.startTimeEntry(newTimeEntry,
      (err, timeEntry) => {
        if (err) {
          return done(err);
        }

        expect(timeEntry).toHaveProperty('id');
        return done();
      })
  })

  it('should start a new time entry, and stop it 3 seconds later', done => {
    toggl.startTimeEntry(newTimeEntry, (err, timeEntry) => {
      if (err) {
        return done(err);

      }
      expect(timeEntry).toHaveProperty('id');

      setTimeout(() => {
        toggl.stopTimeEntry(workspaceId, timeEntry.id,
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

