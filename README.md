#Styler

Styler is a chrome extension that enables you to add custom `.css` and `.js` files. It also come with auto refresh feature while developing.
It's for experienced users so no user friendly interface here.

##Installation
- Fire up chrome and navigate to `about:extensions`
- Click on `Load unpacked extension ...` and select the folder of this repo

By default you get the [Monokai Theme for GitHub code view and Gist](https://gist.github.com/3716262).

##Adding a site
- Create directory for your site inside `sites/` and put your files there
- Add your sites in `content_scripts` like the github example
- Also add them in `web_accessible_resources` as well
- Finally enable them in `permissions`

For more information checkout [Google Chrome Extensions](http://developer.chrome.com/extensions/getstarted.html) page.

##Auto reloading on file changed

You must add your site in `client/js/client.js`

    'github': {
        css: ['monokai-theme-github-code-view-and-gist'],
        js: ['if any']
    }
    
Make sure you set up your server configuration if you plan to use this feature.
    
    var server = {
        host: 'localhost',
        port: 3000
    }

Check your server side configuration too in `server/config.json`

    {
        "host": "localhost",
        "port": 3000,
        "path": "/absolute/path/to/styler/sites"
    }
    
Run it.

    $ node server.js
    
You need to refresh your site at least once after running the server to establish the connection.

##Future
At this point I don't plan to do anything more than bugfixes.
