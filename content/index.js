
// do not send message for iframes
if (window.location === window.top.location) {
  chrome.runtime.sendMessage({
    message: 'check',
    location: window.location
  })
}
