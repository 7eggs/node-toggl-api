'use strict';

require('dotenv').config();

/**
 * Live tests hit the real Toggl API with the account in .env
 * (API_TOKEN, WORKSPACE_ID, ORGANIZATION_ID) and are skipped without it.
 */
const enabled = Boolean(process.env.API_TOKEN);

module.exports = {
  describeLive: enabled ? describe : describe.skip,
  workspaceId: Number(process.env.WORKSPACE_ID),
  organizationId: Number(process.env.ORGANIZATION_ID)
};
