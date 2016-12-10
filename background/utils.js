
var utils = {
  find: (url, config) => {
    for (var key in config) {
      var item = config[key]
      if (item.domains.some((domain) => (url.host === domain))) {
        item.key = key
        return item
      }
    }
  },

  // The custom code is injected into style and script tags
  // at the end of the head tag
  // in order to give them enough weight for successful override
  load: (item, done) => {
    var load = file()
    var css = [], js = []

    var exit = () =>
      (
        css.length === (item.inject.css || []).length &&
        js.length === (item.inject.js || []).length
      ) &&
      done(null, {css: utils.concat(css), js: utils.concat(js)})

    var loop = (filtes, result) => {
      for (var i=0; i < filtes.length; i++) {
        load('sites/' + item.key + '/' + filtes[i], (err, code) => {
          result.push({file: filtes[i], code})
          exit()
        })
      }
    }

    loop(item.inject.css || [], css)
    loop(item.inject.js || [], js)
  },

  concat: (items) =>
    items.reduce((result, item) =>
      (result += '\n/*' + item.file + '*/\n' +
        item.code.replace(/@-moz-document[^{]*\{/gi, '')
      ) || result
    , '')
}
