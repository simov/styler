
var cache

var wait = (time) => new Promise((resolve) => setTimeout(resolve, time))

var debounce = () => new Promise((resolve) =>
  wait(50).then(() => !cache ? debounce() : resolve())
)

var load = (path) =>
  fetch(chrome.runtime.getURL(`${path}?preventCache=${Date.now()}`))
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
  return Promise.all([
    css.length &&
      chrome.scripting.insertCSS({
        target: {tabId: tab},
        files: css.map((file) => folder ? `/sites/${folder}/${file}` : `/sites/${file}`)
      }),
    js.length &&
      chrome.scripting.executeScript({
        target: {tabId: tab},
        files: js.map((file) => folder ? `/sites/${folder}/${file}` : `/sites/${file}`)
      })
  ].filter(Boolean))
}

chrome.tabs.onUpdated.addListener(async (id, info, tab) => {
  if (info.status === 'loading') {
    if (!cache) {
      await debounce()
    }
    if (/https?:\/\/(.*?)\//.test(tab.url)) {
      var [,host] = /https?:\/\/(.*?)\//.exec(tab.url)
      if (cache['*']) {
        if (!cache['*']?.ignore.includes(host)) {
          await inject({domain: '*', tab: id})
        }
      }
      if (cache[host]) {
        await inject({domain: host, tab: id})
      }
    }
  }
})
