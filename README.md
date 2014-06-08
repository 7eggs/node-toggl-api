toggl-api
==========

Toggl API for Node.js. Library is based on official Toggl API [documentation](https://github.com/toggl/toggl_api_docs).

## How to use

```javascript

var TogglClient = require('toggl-api')
  , toggl = new TogglClient({apiToken: '1971800d4d82861d8f2c1651fea4d212'})

toggl.startTimeEntry({
  description: 'Some cool work',
  billable:    true
}, function(err, timeEntry) {
  // handle error

  // working now exactly 1hr
  setTimeout(function() {
    toggl.stopTimeEntry(timeEntry.id, function(err) {
      // handle error

      toggl.updateTimeEntry(timeEntry.id, {tags: ['finished']}, function(err) {
        toggl.destroy()
      })
    })
  }, 3600000)
})
```

## API

TODO (all the APIs with descriptive JSDoc's are available in [lib/api/*.js](lib/api) files)

## TODO

* API documentation
* Implement High-level API
* Tests
* Remove custom data validator
