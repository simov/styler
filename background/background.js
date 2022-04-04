
// ----------------------------------------------------------------------------
// load.js

// The custom code is injected into style and script tags
// at the end of the head tag
// in order to give them enough weight for successful override

function parallel (location, files, done) {
  var result = []
  for (var i=0; i < files.length; i++) {
    ;((name) => {
      file(location + name)
        .then((code) => {
          result.push({name, code})
          if (result.length === files.length) {
            done(result.filter(Boolean))
          }
        })
        .catch((err) => {
          result.push(null)
          if (result.length === files.length) {
            done(result.filter(Boolean))
          }
        })
    })(files[i])
  }
}

function load (item, done) {
  var location = 'sites/' + (item.location ? item.location + '/' : '')

  parallel(location, item.inject, (files) => {
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

// ----------------------------------------------------------------------------
// file.js
var file = (path) => {
  // console.log(path)
  return fetch(chrome.runtime.getURL(`${path}?preventCache=${Date.now()}`))
  .then((res) => res.text())
}
// ;(function (name, root, factory) {
//   if (typeof exports === 'object') {
//     module.exports = factory()
//   }
//   else if (typeof define === 'function' && define.amd) {
//     define(factory)
//   }
//   else {
//     root[name] = factory()
//   }
// }('file', this, function () {

//   var load = (path, done) => {
//     var xhr = new XMLHttpRequest()
//     var params = '?preventCache=' + Date.now()

//     xhr.onreadystatechange = () => {
//       if (xhr.readyState === 4) {
//         done(null, xhr.responseText)
//       }
//     }

//     xhr.open('GET', path + params, true)

//     try {
//       xhr.send()
//     }
//     catch (err) {
//       done(err)
//     }
//   }

//   var promise = (path) => new Promise((resolve, reject) => {
//     load(path, (err, body) => (err ? reject(err) : resolve(body)))
//   })

//   return (options) => ((options && options.promise) ? promise : load)
// }))

// ----------------------------------------------------------------------------
// index.js
var match

file('sites/config.json').then((config) => {
  match = JSON.parse(config)
    .filter(({enable, match, inject}) => enable && match && inject)
    .reduce((all, item) => {
      item.match.forEach((domain) => {
        all[domain] = item
      })
      return all
    }, {})
})

var send = (tab, item) => {
  if (item.cache && item.code) {
    chrome.tabs.sendMessage(tab.id, {message: 'inject', body: item.code})
  }
  else {
    load(item, (code) => {
      if (item.cache) {
        item.code = code
      }
      chrome.tabs.sendMessage(tab.id, {message: 'inject', body: code})
    })
  }
}

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === 'check') {
    if (match['*']) {
      if (!(match['*'].ignore || []).includes(req.location.host)) {
        send(sender.tab, match['*'])
      }
    }
    if (match[req.location.host]) {
      send(sender.tab, match[req.location.host])
    }
  }
})

// ----------------------------------------------------------------------------
