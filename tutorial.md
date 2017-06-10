# Angular.js WordPress Tutorial: Building Microsites & SPA's in a Plugin

The tutorial will show you how to setup Angular.js inside of a WordPress plugin to create a stand-alone, API powered, Angular.js micro site or app.

* [Live Demo](https://www.kevinleary.net/wordpress-angular-plugin/)
* [GitHub Source](https://github.com/Kevinlearynet/wordpress-angular-plugin)

## Table of Contents

1. Concept Overview
1. WordPress Plugin
	1. Routing
	1. Why a WordPress plugin and not a theme or separate site entirely?
1. Front-end
1. Gulp Build
	1. Auto-versioning for CSS/JS
	1. Concat & minify
	1. ng-annotate 
1. Routing
1. Securing with CORS

## Concept Overview

This WordPress Angular.js tutorial should help you grasp a few key things about working with Angular.js inside of WordPress, specifically when using a self-installed WordPress install as a backend API service for serving HTTP requests to an Angular.js client on the front-end. The [sample plugin on GitHub](https://github.com/Kevinlearynet/wordpress-angular-plugin) demonstrations the following concept I commonly come accross when building microservices with this approach:

1. Setup HTML5 pushState routing
2. Create custom API endpoints that are consumed by Angular's `$resource` service
3. Build LESS, JS and dynamic HTML with a gulp build
4. Auto-version CSS and JS inside of a dynamic HTML template (using Gulp)
5. How to handle it all inside of an isolated WordPress plugin

If there's a common scenario you would like me to add to this tutorial please let me know in the [blog post comments at kevinleary.net](https://www.kevinleary.net/blog/).

## WordPress Plugin

To begin we need to start with a fresh WordPress plugin, which I'm assuming you know how to setup. If not then I recommend reading the [detailed plugin guidelines](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/) provided on WordPress.org.

### Routing

The PHP source in the plugin will primarily handle routing for us. This includes the following:

1. Add routing rules to WordPress for serving custom API endpoints
2. Add routing rules to WordPress to load an HTML file at `/wordpress-angular-plugin/` that will support HTML5 pushState routing in our Angular app
3. Process and cache HTTP API requests to third-party providers on the server-side (i.e. the US National Weather Service)

Although the third-party API we request on the server-side in this plugin is not secured in anyway, this approach can be handy when you need to authentication with another API.

### Why a plugin and not a theme, or separate site entirely?

In my opinion there are a few key benefits to doing this inside of a WordPress plugin:

1. **Simplicity:** I don't have to support two separate servers, one for a WordPress backend API and another for serving the Angular.js app's HTML. With this approach I can easily do both from one environment.
2. **Access to WP:** I've found that it's useful to have easy server-side access to WordPress when working with it as a backend. A few scenarios include processing Gravity Forms submissions, passing values from server-side to client-side with `wp_localize_script()` when users are logged in, and various other things.

## Angular App

The Angular.js app is currently using Angular 1. Most of the project I work on at the moment are still using Angular 1, only a few have made the switch to 2. Because some of this code is directly pulled from those projects I found it easier to work with Angular 1. **In the future I will update this to Angular 2 on another branch.**

### HTML5 Routing

Routing is handled by the popular [ui-router](https://ui-router.github.io/) module, and we've specifically setup the index.html route in our WordPress plugin to support it. UI router is responsible for handling every route underneath the main `/wordpress-angular-plugin/` path.

### API Requests to WordPress

The demo app makes an API request to an endpoint defined in our plugin to retreive the weather for a users location. This provides a basic demonstration of how to write a PHP backend service that processes input from our Angular app.

## Gulp

The plugin uses [Gulp](http://gulpjs.com/) to compile our CSS/JS and also prepares our HTML, with a few smart additions.

### Build Everything

if you've just cloned the repo you can build everything with the `gulp build` command. This will run through every process needed to everything we need to serve our micro app (CSS/JS/HTML).

### JS

The `js-main` gulp task uses a few gulp plugins to compile and prepare our JavaScript files for the app. This part of the turorial is entirely opinionated, it's a set of tasks that I commonly use so I've included them here.

1. Sourcemaps will be generated for easier debugging
1. The [gulp-include](https://www.npmjs.com/package/gulp-include) plugin will provide an interface similar to CodeKit, allowing you to concatenate multiple JS files into a single compiled file
1. The [ng-annotate](https://www.npmjs.com/package/ng-annotate) plugin adds and removes AngularJS dependency injection annotations.
1. Uglify handles minification to compress our source
1. Caching is added to help speed up Uglify minification

### LESS

The `less` task is pretty straight forward. It compiles LESS to CSS, with the following helpful additions:

1. Backwards support to automatically add browser prefixes with autoprefixer
2. Concatenation and minification handled by cleanCSS

### HTML (auto-versioning)

Gulp runs an `html` task that runs a custom local plugin inside of `./build/inject-version.js`. This task will automatically add version strings to CSS and JS assets included in our HTML source so that the latest version of our CSS and JS changes are cached by browsers. 

The `inject-version` plugin will check the modified time of our compiled JS and CSS within the `./dist/` directory. The modified timestamp for each file will then be added to our `./views/index.tmp.html` template, replacing template tags and compiling the HTML we serve for our Angular app to `./dist/index.html`. I put this in the `./dist/` directory to avoid any mistaking it for a file that should be editted. Anything that exists inside of the `./views/` directory can be editted directly and is not changed by the `html` build task.

## Securing with CORS

The final step here is to provide CORS header in order to lock down requests to our domain only. This is something we handle on the server-side inside of our WordPress plugin. The following method inside of our plugin's `ngApp` class handles this for us:

~~~.language-php

~~~