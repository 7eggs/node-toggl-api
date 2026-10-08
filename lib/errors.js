'use strict';


/**
 * Error returned by the Toggl Track API (non 2xx response).
 *
 * @param {Number} code HTTP status code
 * @param {*} data Response body (string, object or array)
 */
class APIError extends Error {
  constructor(code, data) {
    super(errorMessage(code, data));
    this.name = 'APIError';
    this.code = code;
    this.data = data;

    if (Array.isArray(data)) {
      this.errors = data;
    }
  }
}


/**
 * Error returned by the Toggl Reports API.
 */
class ReportError extends APIError {
  constructor(code, data) {
    super(code, data);
    this.name = 'ReportError';
  }
}


function errorMessage(code, data) {
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }
  if (Array.isArray(data) && typeof data[0] === 'string') {
    return data[0];
  }
  if (data && typeof data === 'object') {
    const message = data.message || data.error || data.error_message;
    if (typeof message === 'string') {
      return message;
    }
    if (message && typeof message.message === 'string') {
      return message.message;
    }
  }
  return `Toggl API error: HTTP ${code}`;
}


exports.APIError = APIError;
exports.ReportError = ReportError;
