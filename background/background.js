// chrome.storage.sync.clear();

file.load('sites/config.json', function (err, body) {
  var config = JSON.parse(body)
  chrome.storage.sync.set(config)
})

// events

chrome.extension.onMessage.addListener(function (req, sender, res) {
  a[req.message](req, sender, res)
  return true
})

// action

var a = {
  inject: function (req, sender, res) {
    chrome.storage.sync.get(function (config) {
      var site = utils.find(req.location, config)
      if (!site) return res({message:'error'})

      utils.load(site, function (err, code) {
        if (err) return res({message:'error'})
        res({message:'inject', code:code})
      })
    })
  }
}
