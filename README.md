#Styler (WIP)

Styler is a chrome extension that enables you to inject custom `.css` and `.js` files to the sites you visit. It also come with auto refresh feature for use while developing.
It's for experienced users so no user friendly interface here.

##Installation
- Fire up chrome and navigate to `about:extensions`
- Click on `Load unpacked extension ...` and select the folder of this repository
- Then do the same for the `sites` directory

By default you get the [Monokai Theme for GitHub code view and Gist](https://gist.github.com/3716262).

##Adding a site
- Create directory for your site inside `sites/` and put your files there
- Add your sites in `sites/manifest.json` inside `content_scripts` like the github example
- Then in `/manifest.json` add your site's host name under `content_scripts/matches` and in `permissions`

For more information checkout [Google Chrome Extensions](http://developer.chrome.com/extensions/getstarted.html) page.

##Auto reloading on file changed

Make sure you set up your server configuration in `config/client.json` if you plan to use this feature.
    
    var server = {
        host: 'localhost',
        port: 3000
    }

Check your server side configuration too in `config/server.json`

    {
        "host": "localhost",
        "port": 3000,
        "path": "/absolute/path/to/styler/sites"
    }
    
Run it.

    $ node server.js
    
You need to refresh your site at least once after running the server to establish the connection.
