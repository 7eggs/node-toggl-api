'use strict';

var TogglClient = require('./');
var toggl = new TogglClient({apiToken: '94a35a309b535ecef5e1c246163daa97'});

toggl.startTimeEntry({
  description: 'Some cool work',
  billable:    true
}, function(err, timeEntry) {
  // handle error

  // working 10 seconds
  setTimeout(function() {
    toggl.stopTimeEntry(timeEntry.id, function(err) {
      // handle error

      toggl.updateTimeEntry(timeEntry.id, {tags: ['finished']}, function(err) {
        toggl.destroy();
      });
    });
  }, 10000);
});
