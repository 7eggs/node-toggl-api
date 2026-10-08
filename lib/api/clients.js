'use strict';

const TogglClient = require('../client');
const utils = require('../utils');
const path = utils.path;


/**
 * GET Clients visible to the current user, across workspaces.
 *
 * @see https://engineering.toggl.com/docs/track/api/me#get-clients
 * @public
 * @param {Object} [options] <code>since</code> (UNIX timestamp)
 * @param {Function} [callback] <code>(err, clients)</code>
 */
TogglClient.prototype.getClients = function getClients(options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest('me/clients', { qs: options }, callback);
};


/**
 * GET List clients
 *
 * @see https://engineering.toggl.com/docs/track/api/clients#get-list-clients
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} [options] <code>status</code> (active, archived, both), <code>name</code>
 * @param {Function} [callback] <code>(err, clients)</code>
 */
TogglClient.prototype.getWorkspaceClients = function getWorkspaceClients(
  workspaceId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  return this.apiRequest(path`workspaces/${workspaceId}/clients`,
    { qs: options }, callback);
};


/**
 * POST Create client
 *
 * @see https://engineering.toggl.com/docs/track/api/clients#post-create-client
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Object} data <code>name</code>, <code>notes</code>, <code>external_reference</code>
 * @param {Function} [callback] <code>(err, client)</code>
 */
TogglClient.prototype.createClient = function createClient(workspaceId, data,
  callback) {
  const req = {
    method: 'POST',
    body: data
  };

  return this.apiRequest(path`workspaces/${workspaceId}/clients`, req,
    callback);
};


/**
 * GET Load client from ID
 *
 * @see https://engineering.toggl.com/docs/track/api/clients#get-load-client-from-id
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} clientId Client ID
 * @param {Function} [callback] <code>(err, client)</code>
 */
TogglClient.prototype.getClientData = function getClientData(workspaceId,
  clientId, callback) {
  return this.apiRequest(path`workspaces/${workspaceId}/clients/${clientId}`,
    {}, callback);
};


/**
 * POST List clients for given client IDs
 *
 * @see https://engineering.toggl.com/docs/track/api/clients#post-list-clients-for-given-client_ids
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number[]} clientIds Client IDs
 * @param {Function} [callback] <code>(err, clients)</code>
 */
TogglClient.prototype.getClientsData = function getClientsData(workspaceId,
  clientIds, callback) {
  const req = {
    method: 'POST',
    body: clientIds
  };

  return this.apiRequest(path`workspaces/${workspaceId}/clients/data`, req,
    callback);
};


/**
 * PUT Change client
 *
 * @see https://engineering.toggl.com/docs/track/api/clients#put-change-client
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} clientId Client ID
 * @param {Object} data Client data
 * @param {Function} [callback] <code>(err, client)</code>
 */
TogglClient.prototype.updateClient = function updateClient(workspaceId,
  clientId, data, callback) {
  const req = {
    method: 'PUT',
    body: data
  };

  return this.apiRequest(path`workspaces/${workspaceId}/clients/${clientId}`,
    req, callback);
};


/**
 * DELETE Delete client
 *
 * @see https://engineering.toggl.com/docs/track/api/clients#delete-delete-client
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} clientId Client ID
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.deleteClient = function deleteClient(workspaceId,
  clientId, callback) {
  const req = {
    method: 'DELETE'
  };

  return this.apiRequest(path`workspaces/${workspaceId}/clients/${clientId}`,
    req, callback);
};


/**
 * POST Delete clients
 *
 * @see https://engineering.toggl.com/docs/track/api/clients#post-delete-clients
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number[]} clientIds Client IDs
 * @param {Function} [callback] <code>(err)</code>
 */
TogglClient.prototype.deleteClients = function deleteClients(workspaceId,
  clientIds, callback) {
  const req = {
    method: 'POST',
    body: clientIds
  };

  return this.apiRequest(path`workspaces/${workspaceId}/clients/delete`, req,
    callback);
};


/**
 * POST Archives client, and its projects (premium workspaces only).
 * Resolves with the IDs of the archived projects.
 *
 * @see https://engineering.toggl.com/docs/track/api/clients#post-archives-client
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} clientId Client ID
 * @param {Function} [callback] <code>(err, projectIds)</code>
 */
TogglClient.prototype.archiveClient = function archiveClient(workspaceId,
  clientId, callback) {
  const req = {
    method: 'POST'
  };

  return this.apiRequest(
    path`workspaces/${workspaceId}/clients/${clientId}/archive`, req, callback);
};


/**
 * POST Archives one or more clients in bulk
 *
 * @see https://engineering.toggl.com/docs/track/api/clients#post-archives-one-or-more-clients-in-bulk
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number[]} clientIds Client IDs
 * @param {Function} [callback] <code>(err, result)</code>
 */
TogglClient.prototype.archiveClients = function archiveClients(workspaceId,
  clientIds, callback) {
  const req = {
    method: 'POST',
    body: clientIds
  };

  return this.apiRequest(path`workspaces/${workspaceId}/clients/archive`, req,
    callback);
};


/**
 * POST Restores client and related projects.
 *
 * @see https://engineering.toggl.com/docs/track/api/clients#post-restores-client-and-related-projects
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} clientId Client ID
 * @param {Object} [options] <code>projects</code> (IDs to restore) or <code>restore_all_projects</code>
 * @param {Function} [callback] <code>(err, client)</code>
 */
TogglClient.prototype.restoreClient = function restoreClient(workspaceId,
  clientId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  const req = {
    method: 'POST',
    body: options
  };

  return this.apiRequest(
    path`workspaces/${workspaceId}/clients/${clientId}/restore`, req, callback);
};


/**
 * GET Projects of a client, through the workspace projects endpoint.
 *
 * @see https://engineering.toggl.com/docs/track/api/projects#get-workspaceprojects
 * @public
 * @param {Number|String} workspaceId Workspace ID
 * @param {Number|String} clientId Client ID
 * @param {Object} [options] Other filters, see {@link TogglClient#getWorkspaceProjects}
 * @param {Function} [callback] <code>(err, projects)</code>
 */
TogglClient.prototype.getClientProjects = function getClientProjects(
  workspaceId, clientId, options, callback) {
  [options, callback] = utils.optional(options, callback, {});

  const qs = Object.assign({}, options, { client_ids: clientId });
  return this.apiRequest(path`workspaces/${workspaceId}/projects`, { qs: qs },
    callback);
};
