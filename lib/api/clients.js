'use strict'

var TogglClient = require('../client')
  , utils = require('../utils')




/**
 * Create a client
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md
 * @public
 * @param {object} data New client data
 * @param {function} callback Accepts arguments: (err, clientData)
 */
TogglClient.prototype.createClient = function(data, callback) {
  if (!this.validateOptions('client-create', data, callback)) {
    return
  }

  var req = {
    method: 'POST',
    body:   {
      client: data
    }
  }

  this.apiRequest('/api/v8/clients', req, utils.wrapDataCallback(callback))
}




/**
 * Delete client
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md
 * @public
 * @param {number|string} clientId Client ID
 * @param {function} callback Accepts arguments: (err)
 */
TogglClient.prototype.deleteClient = function(clientId, callback) {
  var req = {
    method: 'DELETE'
  }

  this.apiRequest('/api/v8/clients/' + clientId, req, callback)
}




/**
 * Get client details
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md
 * @public
 * @param {number|string} clientId Client ID
 * @param {function} callback Accepts arguments: (err, clientData)
 */
TogglClient.prototype.getClientData = function(clientId, callback) {
  this.apiRequest('/api/v8/clients/' + clientId, {}, utils.wrapDataCallback(callback))
}




/**
 * Get client projects
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md
 * @public
 * @param {number|string} clientId Client ID
 * @param {string|boolean} active Filter projects: active (true), archived (false), both
 * @param {function} callback Accepts arguments: (err, projects)
 */
TogglClient.prototype.getClientProjects = function(clientId, active, callback) {
  var qs = {
    active: active
  }

  if (!this.validateOptions('client-get-projects', qs, callback)) {
    return
  }

  this.apiRequest('/api/v8/clients/' + clientId + '/projects', {qs: qs}, callback)
}




/**
 * Get list of clients
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md
 * @public
 * @param {function} callback Accepts arguments: (err, clients)
 */
TogglClient.prototype.getClients = function(callback) {
  this.apiRequest('/api/v8/clients', {}, callback)
}




/**
 * Update client details
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md
 * @public
 * @param {number|string} clientId Client ID
 * @param {object} data Client data
 * @param {function} callback Accepts arguments: (err, clientData)
 */
TogglClient.prototype.updateClient = function(clientId, data, callback) {
  var req = {
    method: 'PUT',
    body:   {
      client: data
    }
  }

  this.apiRequest('/api/v8/clients/' + clientId, req, utils.wrapDataCallback(callback))
}