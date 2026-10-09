toggl-api
==========

[Toggl Track](https://toggl.com/track/) API client for Node.js, covering the [Track API v9](https://engineering.toggl.com/docs/track/) and the [Reports API v3](https://engineering.toggl.com/docs/track/reports_start).

Toggl has shut down API v8, so versions 1.x of this library no longer work. See [Upgrading](#upgrading) below.

## Installation

    npm install toggl-api

Requires Node.js 18 or later. The library uses the built-in `fetch` and has no dependencies.

## How to use

```javascript
const TogglClient = require('toggl-api');
const toggl = new TogglClient({ apiToken: '1971800d4d82861d8f2c1651fea4d212' });

const me = await toggl.getUserData();
const workspaceId = me.default_workspace_id;

const timeEntry = await toggl.startTimeEntry({
  workspace_id: workspaceId,
  description: 'Some cool work',
  billable: true
});

// ...later
await toggl.stopTimeEntry(workspaceId, timeEntry.id);
await toggl.addTimeEntryTags(workspaceId, timeEntry.id, ['finished']);
```

Every method returns a promise. Pass a Node-style callback as the last argument instead, and the method returns nothing:

```javascript
toggl.getCurrentTimeEntry((err, timeEntry) => {
  // timeEntry is null when nothing is running
});
```

Arguments documented as optional (`[options]`) can be left out, even when a callback follows.

### Authentication

Find your API token at the bottom of your [Toggl profile](https://track.toggl.com/profile). Every request sends it with HTTP Basic auth. An e-mail and password work too:

```javascript
const toggl = new TogglClient({ username: 'me@example.com', password: 'secret' });
const user = await toggl.authenticate(); // optional: checks the credentials, stores the user in toggl.authData
```

### Options

| Option | Default | |
|---|---|---|
| `apiToken` | | API token |
| `username`, `password` | | E-mail and password, used when there is no `apiToken` |
| `timeout` | none | Request timeout, in milliseconds, per attempt |
| `retries` | `3` | How many times to retry a request rejected with a `429` (sent too fast). `0` disables retries |
| `retryDelay` | `1000` | Wait before the first retry, in milliseconds, doubled on each retry. A `Retry-After` header takes precedence |
| `fetch` | global `fetch` | Custom `fetch` implementation, for proxies or tests |
| `apiUrl` | `https://api.track.toggl.com/api/v9/` | Track API base URL |
| `reportsUrl` | `https://api.track.toggl.com/reports/api/v3/` | Reports API base URL |
| `accountsUrl` | `https://accounts.toggl.com/api/` | Accounts API base URL, used by `createUser` |

`TogglClient.setDefaults(options)` changes the defaults of the clients created afterwards.

### Errors

A request that gets a non-2xx response rejects with an `APIError` (a `ReportError` for the Reports API, which extends `APIError`):

```javascript
try {
  await toggl.getProjectData(workspaceId, 123);
} catch (err) {
  if (err instanceof TogglClient.APIError) {
    console.log(err.code);    // HTTP status, e.g. 404
    console.log(err.message); // the message from Toggl
    console.log(err.data);    // the raw response body
  }
}
```

Network errors and timeouts reject with the error thrown by `fetch`. Calling a method without a required ID throws a `TypeError` before anything is sent.

Toggl limits how many requests you can make per hour, per organization, depending on the plan (30 on Free). Over the limit, requests reject with a `402` whose message says when the quota resets. `getUserQuota()` shows what is left. Requests sent too fast get a `429`: the client waits and retries them (see the `retries` and `retryDelay` options), and rejects with the `429` when the retries run out.

### Reports

Reports take the workspace ID and the [v3 filters](https://engineering.toggl.com/docs/track/reports/detailed_reports). ID lists such as `user_ids` and `project_ids` take numbers or numeric strings:

```javascript
const range = { start_date: '2024-01-01', end_date: '2024-01-31' };

const summary = await toggl.summaryReport(workspaceId, { ...range, grouping: 'projects' });
const csv = await toggl.exportDetailedReport(workspaceId, 'csv', range); // a Buffer

// detailed reports are paginated
let options = range;
for (;;) {
  const page = await toggl.detailedReportPage(workspaceId, options);
  handle(page.data);
  if (page.nextRowNumber === null) break;
  options = { ...range, first_row_number: page.nextRowNumber };
}
```

### Bulk updates

Methods called `update...s` (plural) take [JSON Patch](https://tools.ietf.org/html/rfc6902) operations and resolve with `{success, failure}`:

```javascript
await toggl.updateTimeEntries(workspaceId, [1, 2], [
  { op: 'replace', path: '/description', value: 'Meeting' }
]);
```

Some bulk methods have no bulk endpoint in v9 (`deleteProjects`, `deleteTasks`, `addProjectUsers`, `deleteProjectUsers`). They send one request at a time and stop at the first error.

### Requests the library doesn't cover

`apiRequest(path, options)` and `reportsRequest(path, options)` call any endpoint with the client's credentials:

```javascript
const goals = await toggl.apiRequest(`workspaces/${workspaceId}/goals`, { qs: { active: true } });
await toggl.apiRequest(`workspaces/${workspaceId}/goals`, { method: 'POST', body: { name: 'Write docs' } });
```

## Methods

Methods link to the official documentation in their JSDoc comments. Workspace-scoped methods take the workspace ID first.

**Current user**
`getUserData([options])`, `updateUserData(data)`, `changeUserPassword([currentPassword], password)`, `resetApiToken()`, `getUserOrganizations()`, `getUserTags([options])`, `getUserFeatures()`, `getUserQuota()`, `getUserPreferences()`, `updateUserPreferences(data)`, `authenticate()`, `TogglClient.createUser(email, password, [timezone])`

**Time entries**
`getTimeEntries([options])`, `getCurrentTimeEntry()`, `getTimeEntryData(teId, [options])`, `startTimeEntry(data)`, `createTimeEntry(data)`, `updateTimeEntry(workspaceId, teId, data)`, `updateTimeEntries(workspaceId, teIds, operations)`, `stopTimeEntry(workspaceId, teId)`, `deleteTimeEntry(workspaceId, teId)`

`startTimeEntry` starts a running entry (`start` defaults to now). `createTimeEntry` records a finished one: give it `start` and `duration` (in seconds) or `stop`. Both read the workspace from `data.workspace_id`.

**Tags**
`getTags(workspaceId, [options])`, `createTag(workspaceId, name)`, `updateTagName(workspaceId, tagId, name)`, `deleteTag(workspaceId, tagId)`, `addTimeEntryTags(workspaceId, teId, tags)`, `removeTimeEntryTags(workspaceId, teId, tags)`, `updateTimeEntryTags(workspaceId, teId, tags, 'add'|'remove')`, `addTimeEntriesTags(workspaceId, teIds, tags)`, `removeTimeEntriesTags(workspaceId, teIds, tags)`, `updateTimeEntriesTags(workspaceId, teIds, tags, 'add'|'remove'|'replace')`

**Projects**
`getUserProjects([options])`, `getWorkspaceProjects(workspaceId, [options])`, `createProject(workspaceId, data)`, `getProjectData(workspaceId, projectId)`, `updateProject(workspaceId, projectId, data)`, `updateProjects(workspaceId, projectIds, operations)`, `deleteProject(workspaceId, projectId, [options])`, `deleteProjects(workspaceId, projectIds, [options])`, `pinProject(workspaceId, projectId, [pin])`

**Project users**
`getWorkspaceProjectUsers(workspaceId, [options])`, `getProjectUsers(workspaceId, projectId, [options])`, `addProjectUser(workspaceId, projectId, userId, [options])`, `addProjectUsers(workspaceId, projectId, userIds, [options])`, `updateProjectUser(workspaceId, puId, data)`, `updateProjectUsers(workspaceId, puIds, operations)`, `deleteProjectUser(workspaceId, puId)`, `deleteProjectUsers(workspaceId, puIds)`

**Tasks**
`getUserTasks([options])`, `getWorkspaceTasks(workspaceId, [options])`, `getProjectTasks(workspaceId, projectId, [options])`, `createTask(workspaceId, projectId, data|name)`, `getTaskData(workspaceId, projectId, taskId)`, `updateTask(workspaceId, projectId, taskId, data)`, `updateTasks(workspaceId, projectId, taskIds, operations)`, `deleteTask(workspaceId, projectId, taskId)`, `deleteTasks(workspaceId, projectId, taskIds)`

**Clients**
`getClients([options])`, `getWorkspaceClients(workspaceId, [options])`, `createClient(workspaceId, data)`, `getClientData(workspaceId, clientId)`, `getClientsData(workspaceId, clientIds)`, `updateClient(workspaceId, clientId, data)`, `deleteClient(workspaceId, clientId)`, `deleteClients(workspaceId, clientIds)`, `archiveClient(workspaceId, clientId)`, `archiveClients(workspaceId, clientIds)`, `restoreClient(workspaceId, clientId, [options])`, `getClientProjects(workspaceId, clientId, [options])`

**Workspaces**
`getWorkspaces([options])`, `getWorkspaceData(workspaceId)`, `createWorkspace(organizationId, data)`, `updateWorkspace(workspaceId, data)`, `getWorkspaceTags(workspaceId, [options])`, `getWorkspaceStatistics(workspaceId)`, `getWorkspacePreferences(workspaceId)`, `updateWorkspacePreferences(workspaceId, data)`, `getTimeEntryConstraints(workspaceId)`, `getAlerts(workspaceId)`, `createAlert(workspaceId, data)`, `updateAlert(workspaceId, alertId, data)`, `deleteAlert(workspaceId, alertId)`, `getTrackReminders(workspaceId)`, `createTrackReminder(workspaceId, data)`, `updateTrackReminder(workspaceId, reminderId, data)`, `deleteTrackReminder(workspaceId, reminderId)`

**Workspace users**
`getWorkspaceUsers(workspaceId, [options])`, `getWorkspaceWorkspaceUsers(workspaceId, [options])`, `getOrganizationWorkspaceUsers(organizationId, workspaceId, [options])`, `updateWorkspaceUser(workspaceId, wuId, data)`, `updateWorkspaceUsers(organizationId, workspaceId, {delete: ids}|ids)`, `deleteWorkspaceUser(workspaceId, wuId)`

**Organizations and groups**
`createOrganization(data)`, `getOrganization(organizationId)`, `updateOrganization(organizationId, data)`, `getOrganizationOwner(organizationId)`, `getOrganizationUsers(organizationId, [options])`, `updateOrganizationUser(organizationId, organizationUserId, data)`, `updateOrganizationUsers(organizationId, {delete: ids}|ids)`, `leaveOrganization(organizationId)`, `getGroups(organizationId, [options])`, `createGroup(organizationId, data)`, `updateGroup(organizationId, groupId, data)`, `deleteGroup(organizationId, groupId)`, `getProjectGroups(workspaceId, projectIds)`, `addProjectGroup(workspaceId, projectId, groupId)`, `deleteProjectGroup(workspaceId, projectGroupId)`

**Invitations**
`inviteUsers(organizationId, workspaces, emails, [options])`, `resendInvitation(organizationId, invitationId)`, `getInvitation(code)`, `acceptInvitation(code)`, `rejectInvitation(code)`

**Dashboard**
`getDashboard(workspaceId, [options])`, `getMostActiveUsers(workspaceId, [options])`, `getTopActivity(workspaceId, [options])`

**Reports**
`detailedReport(workspaceId, options)`, `detailedReportPage(workspaceId, options)`, `detailedReportTotals(workspaceId, options)`, `summaryReport(workspaceId, options)`, `projectSummaryReport(workspaceId, projectId, [options])`, `weeklyReport(workspaceId, options)`, `savedReport(token, [options])`, `exportDetailedReport(workspaceId, 'csv'|'xlsx'|'pdf', options)`, `exportSummaryReport(workspaceId, 'csv'|'xlsx'|'pdf', options)`, `exportWeeklyReport(workspaceId, 'csv'|'pdf', options)`

## Upgrading

2.0 targets API v9, and v9 changed most endpoints. The main changes from 1.x and the 2.0 betas:

- Node.js 18 or later is required.
- Workspace-scoped methods take the workspace ID first, e.g. `createClient(workspaceId, data)`, `updateProject(workspaceId, projectId, data)`, `createTask(workspaceId, projectId, data)`.
- Request bodies are sent as given. v8 wrapped them, e.g. `{client: data}`.
- `stopTimeEntry`, `updateTimeEntry` and `deleteTimeEntry` need the workspace ID. `startTimeEntry` and `createTimeEntry` need `data.workspace_id`.
- Reports use API v3: `detailedReport(workspaceId, {start_date, end_date, ...})`, and so on.
- `getWorkspaceUsers(workspaceId)` lists the workspace users. The organization variant is `getOrganizationWorkspaceUsers(organizationId, workspaceId)`.
- Authentication sends the credentials with every request. Session cookies and the `reauth` and `sessionCookie` options are gone. `destroy()` still exists but does nothing.

The full list is in the [changelog](CHANGELOG.md).

## Development

    npm install
    npm test              # offline tests, against a local mock server
    npm run coverage

`npm run test:live` runs the tests against the real API with the account set in a `.env` file:

    API_TOKEN=...
    WORKSPACE_ID=...
    ORGANIZATION_ID=...
    INVITE_EMAIL=...      # optional, enables the invitation test

The live tests create and delete their own data, and restore what they rename. Use a test account anyway. The whole suite makes more requests than a Free plan allows in an hour, so run it one file at a time (`npm run test:live -- tests/live/tags`), or point `WORKSPACE_ID` and `ORGANIZATION_ID` at different organizations.

## License

MIT
