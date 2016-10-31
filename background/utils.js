
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
  load: (config, done) => {
    var site = config.site
    if (!site.enabled || !site.inject) {
      done(new Error(config.name + 'not enabled'))
      return
    }

    var load = file({promise: true})

    var styles = (site.inject.css || [])
      .map((file) => load('sites/' + config.name + '/' + file))
    var scripts = (site.inject.js || [])
      .map((file) => load('sites/' + config.name + '/' + file))

    Promise.all([
      new Promise((resolve, reject) => Promise.all(styles)
        .then((styles) => resolve({css: utils.concat(styles)})).catch(reject)
      ),
      new Promise((resolve, reject) => Promise.all(scripts)
        .then((scripts) => resolve({js: utils.concat(scripts)})).catch(reject)
      )
    ])
    .then((result) => done(null, {css: result[0].css, js: result[1].js}))
    .catch(done)
  },

  concat: (files) =>
    Object.keys(files).reduce((str, name) => {
      var code = files[name]
      str += '\n/*' + name + '*/\n' +
        code.replace(/@-moz-document[^{]*\{/gi, '')
      return str
    }, '')
}
