
var utils = {
  find: function (url, config) {
    for (var name in config) {
      var site = config[name]
      for (var i=0; i < site.domains.length; i++) {
        if (url.host == site.domains[i]) {
          return {name:name, site:site}
        }
      }
    }
  },

  // The custom code is injected into style and script tags
  // at the end of the document body
  // in order to give them enough weight for successful override
  // requires: file
  load: function (config, done) {
    var site = config.site
    if (!site.enabled || !site.inject) return done(true)

    var styles = (site.inject.css || []).map(function (file) {
      return ['sites', config.name, file].join('/')
    })
    var scripts = (site.inject.js || []).map(function (file) {
      return ['sites', config.name, file].join('/')
    })

    file.loadList(styles, function (err, css) {
      if (err) return done({err: err})
      file.loadList(scripts, function (err, js) {
        if (err) return done({err: err})
        done(null, {css:utils.concat(css), js:utils.concat(js)})
      })
    })
  },

  concat: function (files) {
    var str = ''
    for (var name in files) {
      var code = files[name]
      str += '\n/*'+name+'*/\n'+code
    }
    return str
  }
}
