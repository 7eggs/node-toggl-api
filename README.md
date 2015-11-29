toggl-api
==========

[Toggl](https://www.toggl.com/) API for Node.js. Library is based on official Toggl API [documentation](https://github.com/toggl/toggl_api_docs).

## Installation

    npm install toggl-api --save

## How to use

```javascript
var TogglClient = require('toggl-api');
var toggl = new TogglClient({apiToken: '1971800d4d82861d8f2c1651fea4d212'});

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
        toggl.destroy()
      });
    });
  }, 120000);
});
```

## Documentation

Documentation is available at: [http://7eggs.github.io/node-toggl-api/](http://7eggs.github.io/node-toggl-api/)

## TODO

* TESTS
* Documentation in Markdown format
* Remove custom data validator
