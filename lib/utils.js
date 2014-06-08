'use strict'

var slice = Array.prototype.slice




/**
 * Arguments object to array
 *
 * @param {Arguments} args
 * @returns {Array}
 */
exports.args = function(args) {
  return slice.call(args, 0)
}




/**
 * Wrap request callback inside helper which returns response "data" object in case of success
 *
 * @param {function} callback Accepts arguments: (err, userData)
 */
exports.wrapDataCallback = function wrapDataCallback(callback) {
  return function onresponse(err, res) {
    if (err) {
      callback(err)
    }
    else {
      callback(null, res.data)
    }
  }
}