
# Styler / Chrome Extension

Styler lets you inject `.css` and `.js` files into web sites you visit


## Install

1. Pull this repository
2. Navigate to `chrome://extensions`
3. Make sure that the `Developer mode` checkbox in the top right corner is checked
4. Click on the `Load unpacked extension ...` button and select the folder where you downloaded this repository


## Configuration

```js
{
  "github": {
    "enabled": true,
    "domains": [
      "github.com",
      "gist.github.com"
    ],
    "inject": {
      "css": [
        "github-general-fixes.css",
        "github-dark.css",
        "github-pygments.css"
      ]
    }
  },

  "youtube": {
    "enabled": true,
    "domains": [
      "www.youtube.com"
    ],
    "inject": {
      "css": ["youtube.css"],
      "js": ["some.js"]
    }
  }
}
```

```
sites/
├── config.json
├── github
│   ├── github-dark.css
│   ├── github-general-fixes.css
│   └── github-pygments.css
└── youtube
    ├── some.js
    └── youtube.css

```

1. Create a folder called `sites` under the root folder of this extension
2. Copy the above configuration in `sites/config.json`
3. Create two separate directories: `sites/github` and `sites/youtube`, and place your styles and scripts there
4. Each time you make changes to the configuration or the styles, you have to click the `Reload (Ctrl+R)` link of the Styler extension under `chrome://extensions`
