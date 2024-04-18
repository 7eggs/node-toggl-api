'use strict';
const TogglClient = require('../');
require('dotenv').config()

describe('Toggl API Client', () => {
  let toggl;

  beforeEach(() => {
    toggl = new TogglClient({ apiToken: process.env.API_TOKEN });
  });
  afterEach(() => {
    toggl.destroy();
  });

  it('should start a new time entry', done => {
    toggl.startTimeEntry({
      description: 'Test entry',
      billable: true
    }, function (err, timeEntry) {
      expect(timeEntry).toHaveProperty('id');
      done(err || null);
    });
  });

  it('should start a new time entry, and stop it 3 seconds later', done => {
    toggl.startTimeEntry({
      description: 'Test entry',
      billable: true
    }, function (err, timeEntry) {
      expect(timeEntry).toHaveProperty('id');

      setTimeout(function () {
        toggl.stopTimeEntry(timeEntry.id, function (err) {
          const duration = -timeEntry.duration + Date.now() / 1_000
          expect(duration).toBeGreaterThan(2);
          done(err || null);
        });
      }, 3_000);
    });
  });
});

