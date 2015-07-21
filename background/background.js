
// should load it from the setes/config.json
var settings = {}
// array of all domains sorted
var sorted = []

file.load('sites/config.json', function (err, body) {
  settings = JSON.parse(body)
  sorted = utils.sort(settings)
})

// storage and reload
// chrome.storage.sync.get(function (data) {
//   settings.data = data
//   settings.sort()
// })


// inject

chrome.extension.onMessage.addListener(function (req, sender, res) {
  a[req.message](req, sender, res)
  return true
})

// action

var a = {
  onload: function (req, sender, res) {
    var tab = sender.tab
      , url = utils.parseUrl(tab.url)
    utils.inject(url, function (err, code) {
      if (err) return res({message: 'error'})
      res({message: 'inject', code: code})
    })
  }
}
