'use strict'

var TogglClient = require('../client')
  , utils = require('../utils')




/**
 * Create tag
 *
 * @param {string} name Tag name
 * @param {number|string} workspaceId Workspace ID
 * @param {function} callback Accepts arguments: (err, tag)
 */
TogglClient.prototype.createTag = function(name, workspaceId, callback) {
  var tag = {
    name: name,
    wid:  workspaceId
  }

  if (!this.validateOptions('tag-create', tag, callback)) {
    return
  }

  var req = {
    method: 'POST',
    body:   {
      tag: tag
    }
  }

  this.apiRequest('/api/v8/tags', req, utils.wrapDataCallback(callback))
}




/**
 * Delete tag
 *
 * @param {number|string} tagId Tag Id
 * @param {function} callback Accepts arguments: (err)
 */
TogglClient.prototype.deleteTag = function(tagId, callback) {
  var req = {
    method: 'DELETE'
  }

  this.apiRequest('/api/v8/tags/' + tagId, req, callback)
}




/**
 * Update tag name
 *
 * @param {number|string} tagId Tag Id
 * @param {string} name New tag name
 * @param {function} callback Accepts arguments: (err, tag)
 */
TogglClient.prototype.updateTagName = function(tagId, name, callback) {
  var tag = {
    name: name
  }

  if (!this.validateOptions('tag-update', tag, callback)) {
    return
  }

  var req = {
    method: 'PUT',
    body:   {
      tag: tag
    }
  }

  this.apiRequest('/api/v8/tags/' + tagId, req, utils.wrapDataCallback(callback))
}