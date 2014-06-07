'use strict'




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