
# Styler / Chrome Extension

Styler lets you inject `.css` and `.js` files into web sites you visit.


## Install

1. Pull this repository
2. Navigate to `chrome://extensions`
3. Make sure that the `Developer mode` checkbox in the top right corner is checked
4. Click on the `Load Unpacked` button and select the folder containing this repository


## Configuration

Option     | Defaults | Description
:---       | :--:     | :---
__enable__ | `false`  | Toggle configuration
__domain__ | `[]`     | List of domains to match
__ignore__ | `[]`     | List of domains to ignore
__inject__ | `[]`     | List of files to inject
__folder__ | `''`     | Files location

Set `domain` to `['*']` to inject on all domains.

When `folder` is ommited it defaults to the `sites` folder.

## Example

```js
[
  {
    "enable": true,
    "domain": [
      "*"
    ],
    "ignore": [
      "google.com"
    ],
    "inject": [
      "global-font.css"
    ]
  },
  {
    "enable": true,
    "domain": [
      "github.com",
      "gist.github.com"
    ],
    "folder": "github",
    "inject": [
      "dark-theme.css",
      "fixes.css"
    ]
  },
  {
    "enable": false,
    "domain": [
      "youtube.com"
    ],
    "folder": "youtube",
    "inject": [
      "youtube.css",
      "ads.js"
    ]
  }
]
```

```
sites/
├── config.json
├── global-font.css
├── github
│   ├── fixes.css
│   └── dark-theme.css
└── youtube
    ├── ads.js
    └── youtube.css

```

1. Create a folder called `sites` under the root directory of this extension
2. Copy the above configuration in `sites/config.json`
3. Create two separate directories: `sites/github` and `sites/youtube`, and place your styles and scripts there
4. Repeat step `3.` for each web site you want to style

On every change to the configuration data structure you have to `Reload` the extension from `chrome://extensions`
