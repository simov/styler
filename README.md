#Styler

Styler is a chrome extension that enables you to:

##Features
- Inject custom `.css` and `.js` files into the pages you visit.
- Auto reload web pages on file changed.
- Auto reload chrome extensions on file changed.

##Installation
- Navigate to the Styler's directory.

    `$ bower install`

    `$ npm install`
- Fire up chrome and navigate to `chrome://extensions`
- Click on `Load unpacked extension ...` and select the folder of this repository.

##Settings
- Navigate to `chrome://extensions`
- Find Styler in extensions list and click on the `Options` link.

##Inject files
- Create directory for your site inside `sites/` and put your files there.

By default you get the [Monokai Theme for GitHub code view and Gist](https://gist.github.com/3716262).

##Auto reload on file changed

- Check the server's configuration file in `config/server.json`

    `{"host": "localhost", "port": 3000}`
- Run the server.

    `$ node lib/server/`
- Reload the extension.
- Reload the pages.

##Wiki
Make sure you check out the [wiki](https://github.com/simov/styler/wiki).