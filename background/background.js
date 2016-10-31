
var config

file()('sites/config.json', (err, body) => {
  config = JSON.parse(body)
})

chrome.extension.onMessage.addListener((req, sender, res) => {
  if (req.message === 'inject') {
    var site = utils.find(req.location, config)
    if (!site) {
      res({message: 'error', body: req.location.host + ' not configured'})
      return
    }

    utils.load(site, (err, code) => (
      err
      ? res({message: 'error', body: err.message})
      : res({message: 'inject', body: code})
    ))
  }
  return true
})
