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
   *
   * @type {number}
   */
  this.code = code

  if (Array.isArray(errors)) {
    this.message = errors[0]

    /**
     * List of errors
     *
     * @type {string[]}
     */
    this.errors = errors
  }
  else {
    this.message = 'Unknown API error'

    /**
     * Keeps error or other descriptive data if errors array is not specified
     */
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
    /**
     * Error message
     *
     * @type {string}
     */
    this.message = error.message

    /**
     * Error code (basically HTTP code)
     *
     * @type {number}
     */
    this.code = error.code

    /**
     * Tips from Toggl inside error object
     *
     * @type {string}
     */
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
  /**
   * Validator error message
   *
   * @type {string}
   */
  this.message = message

  if (arguments.length > 1) {
    this.spec = spec
  }

  if (arguments.length > 2) {
    this.value = value
  }
})