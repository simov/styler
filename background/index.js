
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

var send = (tab, domain) => {
  console.log(domain)
  if (domain.cached && domain.code) {
    chrome.tabs.sendMessage(tab.id, {message: 'inject', body: domain.code})
  }
  else {
    load(domain, (err, code) => {
      if (domain.cached) {
        domain.code = code
      }
      chrome.tabs.sendMessage(tab.id, {message: 'inject', body: code})
    })
  }
}

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === 'check') {
    if (domains['*']) {
      send(sender.tab, domains['*'])
    }
    if (domains[req.location.host]) {
      send(sender.tab, domains[req.location.host])
    }
  }
})
