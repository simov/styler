
var domains

file()('sites/config.json', (err, body) => {
  var config = JSON.parse(body)

  domains = Object.keys(config)
    .filter((key) => (config[key].enabled && config[key].inject))
    .reduce((map, key) => {
      config[key].domains.forEach((domain) => {
        config[key].key = key
        map[domain] = config[key]
      })
      return map
    }, {})
})

chrome.extension.onMessage.addListener((req, sender, res) => {
  if (req.message === 'inject') {
    var item = domains[req.location.host]

    if (item) {
      if (item.cached && item.code) {
        res({message: 'inject', body: item.code})
      }
      else {
        load(item, (err, code) => {
          if (item.cached) {
            item.code = code
          }
          res({message: 'inject', body: code})
        })
      }
    }
  }
  return true
})
