# Changelog

## 2.0.0

Moves the library to the [Track API v9](https://engineering.toggl.com/docs/track/) and the [Reports API v3](https://engineering.toggl.com/docs/track/reports_start). Toggl has shut down API v8, which 1.x used, so 1.x no longer works ([#24](https://github.com/7eggs/node-toggl-api/issues/24)). These notes compare 2.0.0 with 1.0.2 and the 2.0.0 betas.

### Breaking changes

- Node.js 18 or later is required. The library uses the built-in `fetch` and has no dependencies: `request`, `object-assign` and `custom-error-generator` are gone.
- Workspace-scoped methods take the workspace ID first, matching the URL, e.g. `createClient(workspaceId, data)`, `updateProject(workspaceId, projectId, data)`, `deleteWorkspaceUser(workspaceId, wuId)`. Tasks live under their project: `createTask(workspaceId, projectId, data)`, `getTaskData(workspaceId, projectId, taskId)`.
- Request bodies are sent flat, as v9 expects, instead of wrapped in `{client: ...}`, `{project: ...}`, `{user: ...}` and so on.
- `stopTimeEntry`, `updateTimeEntry` and `deleteTimeEntry` take the workspace ID. `startTimeEntry` and `createTimeEntry` read it from `data.workspace_id` (or `data.wid`).
- Reports use API v3. Report methods take the workspace ID and v3 filters (`start_date`, `end_date`, `project_ids`, ...), sent as a JSON body. Exports (`csv`, `xlsx`, `pdf`) resolve with the file as a `Buffer` ([#12](https://github.com/7eggs/node-toggl-api/issues/12)).
- `getWorkspaceUsers(workspaceId)` lists the workspace users, as in v8. The organization endpoint moved to `getOrganizationWorkspaceUsers(organizationId, workspaceId)`.
- `createTimeEntry` records a finished entry. It used to force `duration: -1`, which started a running entry like `startTimeEntry`.
- Resending an invitation is `resendInvitation(organizationId, invitationId)`. It used to be a second method named `inviteUsers`, which replaced the invite method.
- `addProjectUser(workspaceId, projectId, userId, [options])` replaces the old overloaded argument list and no longer sends the v8 `fields` parameter.
- Credentials are sent with HTTP Basic auth on every request. `authenticate()` works with an API token too and resolves with the current user, `id` included ([#8](https://github.com/7eggs/node-toggl-api/issues/8)). Session cookies and the `reauth` and `sessionCookie` options are gone. `destroy()` still exists but does nothing.
- `APIError` and `ReportError` are plain `Error` subclasses with `code` (the HTTP status), `message` and `data`. `ReportError` extends `APIError`.
- `createUser` signs up through accounts.toggl.com (the `accountsUrl` option).

### Fixes

- Network errors are reported as errors. They used to resolve as successes.
- Plain-text error bodies, which is what v9 returns, become the error message.
- The report methods appended `/api/v2` to a base URL that already contained it, and `summaryReport` called an undefined `checkSummaryGrouping`.
- `updateProject` appended the project ID to the URL twice.
- `getTaskData` built a `me/tasks<ID>` URL without a slash, and `updateTasks` referenced an undefined variable.
- `createWorkspace` used `PUT` and appended an absolute URL to `apiUrl`.
- `getWorkspaces` uses `me/workspaces`. `GET /workspaces` is not part of v9.
- `getClientProjects` goes through the workspace projects endpoint. The v8 `clients/{id}/projects` route no longer exists.
- `getProjectUsers` returns the users of the given project. It used to return every project user of the workspace.
- Bulk methods with no bulk endpoint in v9 (`deleteProjects`, `deleteTasks`, `addProjectUsers`, `deleteProjectUsers`) send one request per ID and stop at the first error. They used to join the IDs into a single invalid request.
- `updateWorkspaceUsers` wraps an array of IDs as `{delete: [...]}`.
- `workspaces.js` and `workspace_users.js` defined some methods twice and the last one loaded won. The two alert methods were both named `postAlerts`, so only delete existed.
- The tag helpers return their promise, so they can be awaited.
- `resetApiToken` switches the client to the new token when used with a promise too, not only with a callback.
- `changeUserPassword` passes the unknown password error to the promise as well as the callback.
- `startTimeEntry` and `createTimeEntry` no longer change the data passed in.
- `createProject` creates active projects unless `data.active` says otherwise. v9 archives a project created without it, and an archived project can't take tasks.
- `updateTimeEntryTags` sends `'remove'` when given `'delete'`. Toggl's spec documents `'delete'`, but the API ignores it and replaces the entry's tags.
- Report ID filters (`user_ids`, `project_ids`, ...) given as numeric strings are sent as numbers. v3 rejects `["123"]` with a 400, and the v2 reports answered `user_ids` with a 500 ([#13](https://github.com/7eggs/node-toggl-api/issues/13)).
- `detailedReportPage(workspaceId, callback)` sent the callback as the request body and never called it.
- Callbacks run outside the promise chain, so an exception thrown in a callback is not reported as a rejection.

### New

- **Client:** requests rejected with a `429` (sent too fast) are retried, waiting for `Retry-After` or backing off from 1 second ([#15](https://github.com/7eggs/node-toggl-api/issues/15)). The `retries` (3) and `retryDelay` options tune it. `timeout` and `fetch` options. Every method returns a promise when called without a callback (1.0.2 took callbacks only).
- **User:** `getUserOrganizations`, `getUserTags`, `getUserFeatures`, `getUserQuota`, `getUserPreferences`, `updateUserPreferences`. `createUser` takes an optional timezone, or the whole sign up data.
- **Time entries:** `getTimeEntries` takes an options object (`since`, `before`, `meta`, ...) besides `(startDate, endDate)`. `getTimeEntryData` takes options. `startTimeEntry` defaults `start` to now.
- **Tags:** `getTags` takes `page`, `per_page` and `search`.
- **Projects:** `getUserProjects`, `updateProjects` (bulk), `pinProject`. `getWorkspaceProjects` passes its filters through, and `deleteProject` takes the `teDeletionMode` option.
- **Project users:** `getWorkspaceProjectUsers`, `updateProjectUsers` (bulk).
- **Tasks:** `getUserTasks`, `getWorkspaceTasks` and `getProjectTasks` take filters. `updateTasks` uses the bulk endpoint.
- **Clients:** `getClientsData`, `deleteClients`, `archiveClient`, `archiveClients`, `restoreClient`. The client lists take filters.
- **Workspaces:** `getWorkspaceStatistics`, `getWorkspacePreferences`, `updateWorkspacePreferences`, `getTimeEntryConstraints`, `getWorkspaceWorkspaceUsers`, and create, read, update and delete for alerts and track reminders.
- **Organizations and groups:** `createOrganization`, `getOrganization`, `updateOrganization`, `getOrganizationOwner`, `getOrganizationUsers`, `updateOrganizationUser`, `updateOrganizationUsers`, `leaveOrganization`, `getGroups`, `createGroup`, `updateGroup`, `deleteGroup`, `getProjectGroups`, `addProjectGroup`, `deleteProjectGroup`.
- **Invitations:** `getInvitation`, and `acceptInvitation` and `rejectInvitation` (new since 1.0.2). `inviteUsers` takes workspace IDs or objects and extra fields.
- **Dashboard:** `getMostActiveUsers`, `getTopActivity`. All three dashboard methods take the `since` filter.
- **Reports:** `detailedReportPage` (exposes the `X-Next-ID` / `X-Next-Row-Number` pagination), `detailedReportTotals`, `projectSummaryReport`, `savedReport`, `exportDetailedReport`, `exportSummaryReport`, `exportWeeklyReport`.
- An offline test suite against a local mock server (`npm test`), and live tests against a real account (`npm run test:live`).
