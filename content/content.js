
var inject = {
  style: (string) => {
    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = string
    document.head.appendChild(style)
  },
  script: (string) => {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.charset = 'utf-8'
    script.innerHTML = string
    document.head.appendChild(script)
  },
  css: (path) => {
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = chrome.extension.getURL(path)
    document.head.appendChild(link)
  },
  js: (path) => {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.charset = 'utf-8'
    script.src = chrome.extension.getURL(path)
    document.head.appendChild(script)
  }
}


chrome.extension.sendMessage({
  message: 'inject',
  location: window.location
}, (res) => {
  if (res.message === 'inject') {
    inject.style(res.code.css)
    inject.script(res.code.js)
  }
})
