'use strict'

var createCustomError = require('custom-error-generator')


/**
 * API request error
 *
 * @class APIError
 */
exports.APIError = createCustomError('APIError', null, function(code, errors) {
  /**
   * HTTP status code
   */
  this.code = code

  if (Array.isArray(errors)) {
    this.message = errors[0]
    this.errors = errors
  }
  else {
    this.message = 'Unknown API error'
    this.data = errors
  }
})