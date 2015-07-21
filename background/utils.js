
var utils = {}

/**
 * Create sorted array of all settings.
 *
 * @api public
 */

utils.sort = function (settings) {
  var result = []
  for (var host in settings) {
    result.push({host: host, data: settings[host]})
  }
  return result.sort(function desc (a, b) {
    if (a.host < b.host) return  1
    if (a.host > b.host) return -1
    return 0
  })
}

/**
 * Test if a given url matches one of
 * the urls from the settings.
 *
 * @param {String} url
 * @param {Array} settings (should be sorted!)
 * @return {String} host
 * @api public
 */

utils.match = function (url, settings) {
  for (var i=0; i < settings.length; i++) {
    var regex = new RegExp('^'+settings[i].host)
    if (regex.test(url)) {
      return settings[i].host
    }
  }
  return null
}

/**
 * The custom code is injected into tags at the end of the document's body
 * in order to give them enough weight for successful override.
 */

// requires: file

utils.inject = (function () {
  return function (url, cb) {
    if (!url) return cb(true)
    var path = this.match(url.host + (url.path || ''), sorted)
    if (!path) return cb(true)

    if (!settings[path].enabled || !settings[path].inject) return cb(true)
    var inject = settings[path].inject || {}

    file.loadList(inject.css || [], function (err, css) {
      if (err) return cb({err: err})
      file.loadList(inject.js || [], function (err, js) {
        if (err) return cb({err: err})
        cb(null, {css: map(css), js: map(js)})
      })
    })
  }

  function map (result) {
    var str = ''
    for (var file in result) {
      var code = result[file]
      str += '\n/*'+file+'*/\n'+code
    }
    return str
  }
}())


utils.parseUrl = function (url) {
  var regex = /^([^:]+):\/\/([^\/]+)((\/[^\/]+(?=\/))+)?(?:\/(.*))?$/
    , match = url.match(regex)
  // prot - chrome-extension, chrome, http ...
  return match ? {
    prot: match[1],
    host: match[2],
    path: match[3],
    file: match[5]
  } : null
}
