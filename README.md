# WordPress Angular.js Plugin Demo

Example setup of using Angular.js inside of a WordPress plugin to create a stand-alone, API powered, Angular.js single page app or micro site. The demo app includes the following concepts:

1. Setup HTML5 pushState routing
2. Create custom API endpoints that are consumed by Angular's `$resource` service
3. Build LESS, JS and dynamic HTML with a gulp build
4. Auto-version CSS and JS inside of a dynamic HTML template (using Gulp)
5. How to handle it all inside of an isolated WordPress plugin

## Related

* [Tutorial](https://www.kevinleary.net/angularjs-wordpress-tutorial/)
* [Live Demo](https://www.kevinleary.net/wordpress-angular-plugin/)

## Install

Make sure you have `node`, `npm`, and `gulp` packages installed globally then:

1. Clone the repo to your `/wp-content/plugins/` directory
2. Install Node packages for the build process: `npm install`
3. Run the Gulp build: `gulp build`
4. Activate the **WordPress Angular Plugin Demo** plugin within WordPress

## Build

Gulp is used to compile, concatenate, and minify LESS and JS for the plugin.

### Tasks

* `gulp` - Watch tasks that will compile when JS/LESS files change in real-time
* `gulp build` - Compiles all JS/CSS then exits.