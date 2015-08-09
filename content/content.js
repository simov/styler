
var inject = {
  style: function (string) {
    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = string
    document.head.appendChild(style)
  },
  script: function (string) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.charset = 'utf-8'
    script.innerHTML = string
    document.head.appendChild(script)
  },
  css: function (path) {
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = chrome.extension.getURL(path)
    document.head.appendChild(link)
  },
  js: function (path) {
    var script = document.createElement('script')
    script.charset = 'utf-8'
    script.type = 'text/javascript'
    script.src = chrome.extension.getURL(path)
    document.head.appendChild(script)
  }
}


chrome.extension.sendMessage({
  message:'onload',
  location:window.location
}, function (res) {
  if (res.message == 'inject') {
    inject.style(res.code.css)
    inject.script(res.code.js)
  }
})
