
var utils = {
  find: (url, config) => {
    for (var key in config) {
      var item = config[key]
      for (var i=0; i < item.domains.length; i++) {
        if (url.host === item.domains[i]) {
          item.key = key
          return item
        }
      }
    }
  },

  // The custom code is injected into style and script tags
  // at the end of the head tag
  // in order to give them enough weight for successful override
  load: (item, done) => {
    var load = file({promise: true})

    var styles = (item.inject.css || [])
      .map((file) => load('sites/' + item.key + '/' + file))
    var scripts = (item.inject.js || [])
      .map((file) => load('sites/' + item.key + '/' + file))

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
