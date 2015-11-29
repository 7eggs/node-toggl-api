'use strict';

var moment = require('moment');
var ValidateError = require('./errors').ValidateError;
var specs = require('../data/api_params.json');


/**
 * @param {String} camelCase
 * @returns {String}
 */
function underscore(camelCase) {
  if (!camelCase) {
    return '';
  }

  function replacer(m) {
    return m[0] + '_' + m[1];
  }

  return camelCase.replace(/[a-z][A-Z]/g, replacer).toLowerCase();
}


/**
 * @param {Object} spec
 * @param {Object} options
 * @param {String} key
 * @returns {ValidateError|null}
 */
function validator(spec, options, key) {
  //jshint -W086
  var value = options[key];

  switch (spec.type) {
    case 'date':
      var defaultValue;
      if (spec.default) {
        defaultValue = moment().add(spec.default).format(spec.format);
      }

      if (!value) {
        value = options[key] = defaultValue;
      }
      else {
        value = moment(value, spec.format);

        if (!value.isValid()) {
          value = moment(value);
        }

        if (!value.isValid()) {
          return new ValidateError('Unknown date');
        }

        value = value.format(spec.format);
      }

      if (defaultValue === value && !spec.required) {
        delete options[key];
      }

      break;
    case 'enum':
      if (value !== undefined && !~spec.values.indexOf(value) &&
        !~spec.values.indexOf(value + '')) {
        return new ValidateError('Value does not match any of allowed', spec, value);
      }
    case 'boolean':
    case 'number':
    case 'string':
      if (spec.default && value === undefined) {
        value = options[key] = spec.default;
      }

      if (spec.default === value && !spec.required) {
        delete options[key];
      }

  }

  if (spec.required && value === undefined) {
    return new ValidateError(key + ' is required');
  }

  return null;
}


/**
 * @param {Object|String} schema Validation schema or schema Id
 * @param {Object} options Options to validate
 * @returns {ValidateError|null}
 */
module.exports = function validate(schema, options) {
  var key;
  var spec;
  var error;

  if (typeof schema === 'string') {
    if (!specs.hasOwnProperty(schema)) {
      return new ValidateError('Unknown validation schema: ' + schema);
    }

    schema = specs[schema];
  }

  for (key in options) {
    if (options.hasOwnProperty(key)) {
      var underscored = underscore(key);

      if (underscored !== key) {
        options[underscored] = options[key];
        delete options[key];
      }
    }
  }

  for (key in schema) {
    if (!schema.hasOwnProperty(key)) {
      continue;
    }

    spec = schema[key];

    // do nothing with keys for which default value is null
    if (spec === null || spec === undefined) {
      continue;
    }
    else if (spec === 'required') {
      spec = {
        required: true
      };

      schema[key] = spec;
    }
    else if (typeof spec !== 'object') {
      spec = {
        type: typeof spec,
        default: spec
      };

      schema[key] = spec;
    }

    if ((error = validator(spec, options, key))) {
      return error;
    }
  }

  return null;
};
