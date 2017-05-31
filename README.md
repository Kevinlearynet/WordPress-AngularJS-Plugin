# WordPress Angular.js Plugin Demo

A simple demonstration of an Angular.js powered WordPress plugin with HTML5 pushState routing.

## Setup

Make sure you havethe `node`, `npm`, and `gulp` packages installed globally.

1. Clone the report to your `/wp-content/plugins/` directory
2. Change to the directory and install Node packages: `npm install`
3. Build the Gulp assets: `gulp build`

## Build

Gulp is used to compile, concatenate, and minify LESS and JS for the plugin.

### Tasks

* `gulp` - Compiles all JS/CSS then starts watch tasks that will compile when JS/LESS/HTML files change in real-time
* `gulp build` - Compiles all JS/CSS/HTML then exits.

### Auto-versioning

`*.tmp.html` files serve as a templates that compile to `/dist/*.min.html`. Variable strings are replaced by the `html` gulp task during the compile process. Each file's mtime is checked by Node, and the date is used to generate an md5 hash that becomes the query string `?v={hash}`.