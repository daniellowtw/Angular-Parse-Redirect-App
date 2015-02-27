# Angular-parse redirect app

## What is this
This is a simple web app that allows you to write redirect links easily.

If you have a server, installing this to a directory (e.g. r) will allow you to create new redirect links of the form `http://<your-server>/r/<short_code>`.

## Installation
1. Register for a [parse](www.parse.com) account and get your api and javascript key for a new app.
2. Fill them in `r/config.default.js`.
3. Open gen.html and enter a passphrase. This will be used to control the creation of new links.
4. Copy the hash to `r/config.default.js`.
5. Rename `r/config.default.js` to `r/config.js`.
6. If you are installing this in a different directory name, e.g. `rdr`, then change the following:
	- `r/index.html`: `<base href="/r/">` to `<base href="/rdr/">`
	- `r/.htaccess`: `RewriteBase /r` to `RewriteBase /rdr`
7. Copy the `r` directory to your server.

## Usage

* Create a new redirect by going to `/r/add` and fill in the secret code you used to initialise the app. For example fill in `test`, `http://google.com`, `myCode`
* Use the redirect by going to `/r/test`
* Delete the redirect by going to `/r/delete/<name>` and enter the *secret code*. For e.g. go to `/r/delete/test` and enter `myCode`