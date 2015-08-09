
var utils = {}


utils.match = function (url) {
  for (var key in settings) {
    var site = settings[key]
    for (var i=0; i < site.domains.length; i++) {
      if (url.host == site.domains[i]) {
        return site
      }
    }
  }
}

// The custom code is injected into style and script tags
// at the end of the document body
// in order to give them enough weight for successful override

// requires: file
utils.inject = function (url, done) {
  if (!url) return done(true)
  var site = this.match(url)
  if (!site) return done(true)

  if (!site.enabled || !site.inject) return done(true)

  var styles = (site.inject.css || []).map(function (file) {
    return ['sites', site.directory, file].join('/')
  })
  var scripts = (site.inject.js || []).map(function (file) {
    return ['sites', site.directory, file].join('/')
  })

  file.loadList(styles, function (err, css) {
    if (err) return done({err: err})
    file.loadList(scripts, function (err, js) {
      if (err) return done({err: err})
      done(null, {css: concat(css), js: concat(js)})
    })
  })
}

function concat (result) {
  var str = ''
  for (var file in result) {
    var code = result[file]
    str += '\n/*'+file+'*/\n'+code
  }
  return str
}
