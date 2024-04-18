'use strict';

var TogglClient = require('../client');
var utils = require('../utils');


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md#create-a-client
 * @public
 * @param {Object} data New client data
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err, clientData)</code>
 */
TogglClient.prototype.createClient = function createClient(data, workspaceId, callback) {
  if (!this.validateOptions('client-create', data, callback)) {
    return;
  }

  const req = {
    method: 'POST',
    body: {
      client: data
    }
  };

  this.apiRequest(`/api/v9/workspaces/${workspaceId}/clients`, req, utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md#delete-a-client
 * @public
 * @param {Number|String} clientId Client ID
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err)</code>
 */
TogglClient.prototype.deleteClient = function deleteClient(clientId, workspaceId, callback) {
  var req = {
    method: 'DELETE'
  };

  this.apiRequest(`/api/v9/workspaces/${workspaceId}/clients/${clientId}`, req, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md#get-client-details
 * @public
 * @param {Number|String} clientId Client ID
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err, clientData)</code>
 */
TogglClient.prototype.getClientData = function getClientData(clientId, workspaceId, callback) {
  this.apiRequest(`/api/v9/workspaces/${workspaceId}/clients/${clientId}`, {},
    utils.wrapDataCallback(callback));
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md#get-client-projects
 * @public
 * @param {Number|String} clientId Client ID
 * @param {String|Boolean} active Filter projects: active (true), archived (false), both
 * @param {Function} callback <code>(err, projects)</code>
 */
TogglClient.prototype.getClientProjects = function getClientProjects(clientId,
  active, callback) {
  var qs = {
    active: active
  };

  if (!this.validateOptions('client-get-projects', qs, callback)) {
    return;
  }

  this.apiRequest(`/api/v9/clients/${clientId}/projects`, { qs: qs },
    callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md#get-clients-visible-to-user
 * @public
 * @param {Function} callback <code>(err, clients)</code>
 */
TogglClient.prototype.getClients = function getClients(callback) {
  this.apiRequest('/api/v9/me/clients', {}, callback);
};


/**
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md#update-a-client
 * @public
 * @param {Number|String} clientId Client ID
 * @param {Object} data Client data
 * @param {Number|String} workspaceId Workspace Id
 * @param {Function} callback <code>(err, clientData)</code>
 */
TogglClient.prototype.updateClient = function updateClient(clientId, data, workspaceId,
  callback) {
  var req = {
    method: 'PUT',
    body: {
      client: data
    }
  };

  this.apiRequest(`/api/v9/workspaces/${workspaceId}/clients/${clientId}`, req,
    utils.wrapDataCallback(callback));
};
