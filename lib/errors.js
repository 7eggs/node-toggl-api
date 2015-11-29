'use strict';

var createCustomError = require('custom-error-generator');


exports.APIError = createCustomError('APIError', null,
  function createApiError(code, errors) {
    this.code = code;

    if (Array.isArray(errors)) {
      this.message = errors[0];
      this.errors = errors;
    }
    else {
      this.message = 'Unknown API error';
      this.data = errors;
    }
  });


exports.ReportError = createCustomError('ReportError', null,
  function createReportError(error, code, data) {
    if (typeof error === 'object') {
      this.message = error.message;
      this.code = error.code;
      this.tip = error.tip;
    }
    else {
      this.message = error;
      this.code = arguments[1];
      this.data = arguments[2];
    }
  });


exports.ValidateError = createCustomError('ValidateError', null,
  function createValidateError(message, spec, value) {
    this.message = message;

    if (arguments.length > 1) {
      this.spec = spec;
    }

    if (arguments.length > 2) {
      this.value = value;
    }
  });
