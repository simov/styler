
var utils = {
  find: (url, config) => {
    for (var name in config) {
      var site = config[name]
      for (var i=0; i < site.domains.length; i++) {
        if (url.host === site.domains[i]) {
          return {name: name, site: site}
        }
      }
    }
  },

  // The custom code is injected into style and script tags
  // at the end of the head tag
  // in order to give them enough weight for successful override
  // requires: file
  load: (config, done) => {
    var site = config.site
    if (!site.enabled || !site.inject) {
      return done(true)
    }

    var styles = (site.inject.css || []).map((file) => {
      return ['sites', config.name, file].join('/')
    })
    var scripts = (site.inject.js || []).map((file) => {
      return ['sites', config.name, file].join('/')
    })

    file.loadList(styles, (err, css) => {
      if (err) return done({err: err})
      file.loadList(scripts, (err, js) => {
        if (err) return done({err: err})
        done(null, {css: utils.concat(css), js: utils.concat(js)})
      })
    })
  },

  concat: (files) =>
    Object.keys(files).reduce((str, name) => {
      var code = files[name]
      str += '\n/*' + name + '*/\n' +
        code.replace(/@-moz-document[^{]*\{/gi, '')
      return str
    }, '')
}
