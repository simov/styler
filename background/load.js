
// The custom code is injected into style and script tags
// at the end of the head tag
// in order to give them enough weight for successful override

function parallel (get, location, files, done) {
  var result = []
  for (var i=0; i < files.length; i++) {
    ;((name) => {
      get(location + name, (err, code) => {
        result.push({name, code})
        if (result.length === files.length) {
          done(result)
        }
      })
    })(files[i])
  }
}

function load (item, done) {
  var get = file()
  var location = 'sites/' + (item.location ? item.location + '/' : '')

  parallel(get, location, item.inject, (files) => {
    var css = js = ''
    for (var i=0; i < files.length; i++) {
      if (/\.css$/.test(files[i].name)) {
        css += '\n/*' + files[i].name + '*/\n' + files[i].code
          .replace(/@-moz-document[^{]*\{/gi, '').replace(/`/g, '')
      }
      else if (/\.js$/.test(files[i].name)) {
        js += '\n/*' + files[i].name + '*/\n' + files[i].code
      }
    }
    done({css, js})
  })
}
