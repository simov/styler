
;(function (name, root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory()
  }
  else if (typeof define === 'function' && define.amd) {
    define(factory)
  }
  else {
    root[name] = factory()
  }
}('file', this, function () {

  var load = (path, done) => {
    var xhr = new XMLHttpRequest()
    var params = '?preventCache=' + Date.now()

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        done(null, xhr.responseText)
      }
    }

    xhr.open('GET', path + params, true)

    try {
      xhr.send()
    }
    catch (err) {
      done(err)
    }
  }

  var promise = (path) => new Promise((resolve, reject) => {
    load(path, (err, body) => (err ? reject(err) : resolve(body)))
  })

  return (options) => ((options && options.promise) ? promise : load)
}))
