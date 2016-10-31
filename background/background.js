
var config

file()('sites/config.json', (err, body) => {
  config = JSON.parse(body)
})

chrome.extension.onMessage.addListener((req, sender, res) => {
  if (req.message === 'inject') {
    var item = utils.find(req.location, config)

    if (!item) {
      res({message: 'error', body: req.location.host + ' not configured'})
      return
    }

    if (!item.enabled || !item.inject) {
      res({message: 'error', body: site.name + 'not enabled'})
      return
    }

    utils.load(item, (err, result) => (
      err
      ? res({message: 'error', body: err.message})
      : res({message: 'inject', body: result})
    ))
  }
  return true
})
