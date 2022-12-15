
var cache

var load = (path) => fetch(chrome.runtime.getURL(`${path}?preventCache=${Date.now()}`))
  .then((res) => res.text())

load('sites/config.json').then((config) => {
  cache = JSON.parse(config)
    .filter(({enable, domain, inject}) => enable && domain && inject)
    .map(({domain, folder, inject}) => ({
      domain,
      folder,
      css: inject.filter((file) => /\.css$/.test(file)),
      js: inject.filter((file) => /\.js$/.test(file)),
    }))
    .flatMap(({domain, ...rest}) => domain.map((domain) => ({domain, ...rest})))
    .reduce((all, {domain, ...rest}) => (all[domain] = rest, all), {})
})

var inject = ({domain, tab}) => {
  var {css, js, folder} = cache[domain]

  if (css.length) {
    chrome.scripting.insertCSS({
      target: {tabId: tab},
      files: css.map((file) => folder ? `/sites/${folder}/${file}` : `/sites/${file}`)
    })
  }

  if (js.length) {
    chrome.scripting.executeScript({
      target: {tabId: tab},
      files: js.map((file) => folder ? `/sites/${folder}/${file}` : `/sites/${file}`),
    })
  }
}

var debounce = () => new Promise((resolve) => {
  ;(function debounce () {
    clearTimeout(timeout)
    var timeout = setTimeout(() => {
      if (!cache) {
        debounce()
      }
      else {
        clearTimeout(timeout)
        resolve()
      }
    }, 50)
  })()
})

chrome.runtime.onMessage.addListener(async (req, sender, res) => {
  if (!cache) {
    await debounce()
  }
  if (req.message === 'check') {
    if (cache['*']) {
      if (!cache['*']?.ignore.includes(req.location.host)) {
        inject({domain: '*', tab: sender.tab.id})
      }
    }
    if (cache[req.location.host]) {
      inject({domain: req.location.host, tab: sender.tab.id})
    }
  }
})
