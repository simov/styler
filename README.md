#Styler

Styler is a chrome extension that enables you to inject custom `.css` and `.js` files into the pages you visit. It can auto refresh your pages on file changed as well.

##Installation
Fire up chrome and navigate to `about:extensions`
Click on `Load unpacked extension ...` and select the folder of this repository.

##Inject files
Create directory for your host inside `sites/` and put your files there.
By default you get the [Monokai Theme for GitHub code view and Gist](https://gist.github.com/3716262).

##Configure your hosts
Open the extension's options page and configure your hosts.
![](http://i.imgur.com/WTw72wq.png)

##Auto reload on file changed

Check your server configuration in `config/server.json`

    {
        "host": "localhost",
        "port": 3000
    }
    
Run the server.

    $ node lib/server/index.js
    
Reload the extension.
Refresh your pages.