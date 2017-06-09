# WordPress Angular.js Plugin Demo

A simple demonstration of an Angular.js powered WordPress plugin with HTML5 pushState routing.

## Setup

Make sure you have `node`, `npm`, and `gulp` packages installed globally then:

1. Clone the repo to your `/wp-content/plugins/` directory
2. Install Node packages for the build process: `npm install`
3. Run the Gulp build: `gulp build`

## Build

Gulp is used to compile, concatenate, and minify LESS and JS for the plugin.

### Tasks

* `gulp` - Compiles all JS/CSS then starts watch tasks that will compile when JS/LESS/HTML files change in real-time
* `gulp build` - Compiles all JS/CSS/HTML then exits.

### Auto-versioning

`*.tmp.html` files serve as a templates that compile to `/dist/*.min.html`. Variable strings are replaced by the `html` gulp task during the compile process. Each file's mtime is checked by Node, and the date is used to generate an md5 hash that becomes the query string `?v={hash}`.

## Notes

For a detailed write-up visit the original blog post

