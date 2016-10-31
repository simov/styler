
# Styler / Chrome Extension

Styler lets you inject `.css` and `.js` files into web sites you visit


## Install

1. Pull this repository
2. Navigate to `chrome://extensions`
3. Make sure the `Developer mode` checkbox in the top right corner is checked
4. Click on the `Load unpacked extension ...` button and select the folder containing this repository


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
        "github-dark.css",
        "pygments.css",
        "fixes.css"
      ]
    }
  },

  "youtube": {
    "enabled": true,
    "domains": [
      "www.youtube.com"
    ],
    "inject": {
      "css": [
        "fixes.css"
      ],
      "js": [
        "ads.js"
      ]
    }
  }
}
```

```
sites/
├── config.json
├── github
│   ├── fixes.css
│   ├── github-dark.css
│   └── pygments.css
└── youtube
    ├── ads.js
    └── fixes.css

```

1. Create a folder called `sites` under the root directory of this extension
2. Copy the above configuration in `sites/config.json`
3. Create two separate directories: `sites/github` and `sites/youtube`, and place your styles and scripts there
4. Repeat step `3.` for each web site you want to style

Each time you make changes to the configuration data structure, you have to click on the `Reload (Ctrl+R)` link of the Styler extension in `chrome://extensions`
