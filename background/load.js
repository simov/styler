
// The custom code is injected into style and script tags
// at the end of the head tag
// in order to give them enough weight for successful override
function load (item, done) {
  var load = file()
  var css = [], js = []

  var exit = () =>
    (
      css.length === (item.inject.css || []).length &&
      js.length === (item.inject.js || []).length
    ) &&
    done(null, {css: concat(css), js: concat(js)})

  var loop = (files, result) => {
    for (var i=0; i < files.length; i++) {
      ;((file) => {
        load('sites/' + item.key + '/' + file, (err, code) => {
          result.push({file, code})
          exit()
        })
      })(files[i])
    }
  }

  loop(item.inject.css || [], css)
  loop(item.inject.js || [], js)
}

var concat = (items) =>
  items.reduce((result, item) =>
    (result += '\n/*' + item.file + '*/\n' +
      item.code.replace(/@-moz-document[^{]*\{/gi, '').replace(/`/g, '')
    ) || result
  , '')
