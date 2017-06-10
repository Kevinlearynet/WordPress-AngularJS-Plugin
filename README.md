# WordPress Angular.js Plugin Demo

A simple demonstration of an Angular.js powered WordPress plugin with HTML5 pushState routing. **For a detailed write-up visit the original blog post: [Building an Angular.js SPA in a WordPress Plugin](https://www.kevinleary.net/angularjs-wordpress-tutorial/)**

## Setup

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