
var match

file()('sites/config.json', (err, config) => {
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
