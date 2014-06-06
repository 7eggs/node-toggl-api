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
 * Reports API error
 *
 * @class ReportError
 */
exports.ReportError = createCustomError('ReportError', null, function(error, code, data) {
  if (typeof error === 'object') {
    this.message = error.message
    this.code = error.code
    this.tip = error.tip
  }
  else {
    this.message = error
    this.code = arguments[1]
    this.data = arguments[2]
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