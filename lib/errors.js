'use strict'

var createCustomError = require('custom-error-generator')


/**
 * Toggl API error
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




/**
 * Validation error
 *
 * @class ValidateError
 */
exports.ValidateError = createCustomError('ValidateError', null, function(message, spec, value) {
  this.message = message

  if (arguments.length > 1) {
    this.spec = spec
  }

  if (arguments.length > 2) {
    this.value = value
  }
})