The tutorial will show you how to setup and work with Angular.js inside of a WordPress plugin to create a stand-alone, API powered, Angular.js single page app or microsite that is available at a defined path of a WordPress website.

<p><a href="https://www.kevinleary.net/wordpress-angular-plugin/" class="btn btn-primary-outline">Live Demo</a>&nbsp;&nbsp;&nbsp;<a href="https://github.com/Kevinlearynet/wordpress-angular-plugin" class="btn btn-primary-outline">GitHub Source</a></p>

By the end of this tutorial you should grasp a few key things about working with Angular.js inside of WordPress. Using a self-installed WordPress install as a backend API service for serving HTTP requests to a front-end Angular.js client is a powerful combination. If you're an eager beaver you can dive right into the [sample plugin on GitHub](https://github.com/Kevinlearynet/wordpress-angular-plugin) which provides the source for the working demo. This example app should demonstrate the following concepts I commonly come across when building Angular apps in WordPress:

1. How to work with HTML5 pushState routing
1. Creating custom API endpoints that are consumed by Angular's `$resource` service
1. Work with gulp to compile your front-end's LESS, JS and more with a build process
1. Auto-version your CSS and JS includes
1. Setup browser cache rules for `/api/**` routes to reduce requests per second (when it makes sense to)
1. How to handle it all inside of an isolated WordPress plugin

**If there's a common scenario I didn't mention that you would like to recommend please let me know in the [blog post comments](https://www.kevinleary.net/angularjs-wordpress-tutorial/#respond).**

## Table of Contents

1. [WordPress Plugin](#wordpress-plugin)
	1. Why a plugin and not a theme?
	1. Server-side routing
	1. Auto-versioning CSS/JS
	1. API Requests to WordPress
1. [Angular Front-end](#angular-frontend)
	1. Index template
	1. Front-end routing
	1. Concatenating JS includes
	1. HTML5 `pushState` routing
1. [Gulp Build](#gulp-build)
	1. Watch & Build CSS/JS
	1. JS Compile Tasks
	1. LESS Compile Tasks

## <a name="wordpress-plugin"></a>WordPress Plugin

To begin we we'll start by creating a fresh WordPress plugin. I'm assuming you know how to do this already, but if not then I recommend reading the [detailed plugin guidelines](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/) provided on WordPress.org. This plugin will serve as a backend to our angular app, and will handling the following logic for us:

1. Add routing rules to WordPress for serving custom API endpoints
2. Add routing rules to WordPress to load our base app index template at `/wordpress-angular-plugin/**`. The trailing wildcard is critical for supporting HTML5 pushState routing within our Angular app.
3. Process and cache HTTP API requests to third-party providers on the server-side (i.e. the US National Weather Service)

### Why a plugin and not a theme?

There are a few key benefits to building both the backend and front-end inside of a single WordPress plugin:

1. **Simplicity:** I don't have to support two separate servers, one for a WordPress backend API and another for serving the Angular.js app's HTML. With this approach I can easily do both from one environment.
1. **Access to WP:** I've found that it's useful to have easy server-side access to WordPress when working with it as a backend. A few scenarios include processing Gravity Forms submissions, passing values from server-side to client-side with `wp_localize_script()` when users are logged in, and various other things.
1. **Portability** By isolating everything into a WordPress plugin we can easily move our entire app from site to site, enabling and disabling on demand.

All of the logic described in this tutorial could be used within a WordPress theme as well, the same concepts apply.

### Server-side routing

Our WordPress plugin defines the URL where our Angular app will load based on the path of the plugin directory. The `intercept_wp_router()` method is applied to the `do_parse_request` filter to handle this:

~~~.language-php
/**
 * Intercept WP Router
 *
 * Intercept WordPress rewrites and serve a 
 * static HTML page for our angular.js app.
 */
public function intercept_wp_router( $continue, WP $wp, $extra_query_vars ) {

	// Conditions for url path
	$url_match = ( substr( $_SERVER['REQUEST_URI'], 0, strlen( $this->base_href ) ) === $this->base_href );
	if ( ! $url_match ) 
		return $continue;

	// Vars for index view
	$main_js = $this->auto_version_file( 'dist/js/main.js' );
	$main_css = $this->auto_version_file( 'dist/css/main.css' );
	$plugin_url = $this->plugin_url;
	$base_href = $this->base_href;
	$page_title = 'WordPress Angular.js Plugin Demo App | kevinleary.net';

	// Browser caching for our main template
	$ttl = DAY_IN_SECONDS;
	header( "Cache-Control: public, max-age=$ttl" );

	// Load index view
	include_once( $this->plugin_dir . 'views/index.php' );
	exit;
}
~~~

If you want to change the base URL for your app to something custom you'll need to change the value of the public variable `base_href`. This is set in the `__constuct()` method of the `ngApp` Class. That's a mouthful, but basically you would find and modify this line within the plugin:

~~~.language-php
dirname( __FILE__ )
~~~

In the case of this tutorial, our main plugin file is `wordpress-angular-plugin/wordpress-angular-plugin.php` so the Angular app will load at `/wordpress-angular-plugin/` out of the box. **You can change this whatever you like in the plugin to customize the URL.**

Once you load up `https://www.yoursite.com/wordpress-angular-plugin/` you should see the same Angular app demo currently available at:

[kevinleary.net/wordpress-angular-plugin/](https://www.kevinleary.net/wordpress-angular-plugin/)

### Auto-versioning CSS/JS

Google Chrome and other browsers will cache our *.css and *.js for an indefinite period of time. If we make changes to our Angular app's code, or our LESS stylesheet, browsers won't know the file has changed and could serve the old, previously cached version of the file to repeat visitors. For this reason, it's very important that we add version strings to static resources, or in our case the `/dist/js/main.js` and `/dist/css/main.css` files. **This is especially important for single page apps** because we are effectively loading EVERYTHING in the browser.

Luckily, I've included a setup in this plugin that will handle this for you automatically. This is the only thing that PHP is actually used for in the `index.php` template. 

Here's the method that handles this for us:

~~~.language-php
/**
 * Auto-version Assets
 */
public function auto_version_file( $path_to_file ) {
	$file = $this->plugin_dir . $path_to_file;
	if ( ! file_exists( $file ) ) return false;

	$mtime = filemtime( $file );
	$url = $this->plugin_url . $path_to_file . '?v=' . $mtime;

	return $url;
}
~~~

Using PHP's `filemtime()` function we check the modified time of the CSS and JS files, and then we add the timestamp returned to the end of each file as a "version string" like this:

* `/dist/css/main.css?v=1497114238`
* `/dist/js/main.js?v=1497114238`

Now you'll always have up to date assets loading for your users!

### API Requests to WordPress

Now that we have the basic structure for an Angular app setup within a WordPress plugin let's look at how to make requests from client (Angular) to server (WordPress) by defining a few custom HTTP API routes. For demo purposes I've wired together a backend API that will:

1. Handle incoming requests to `/api/weather/{latitude:longitude}/`
2. Lookup a weather forecast for the provided lat/long using the National Weather Service API
3. Return the response body as JSON back to the client

In a real-world scenario we could just do this inside of Angular entirely, but it serves as a good example to cover common situations where:

1. You want to make requests to a secured API without exposing keys on the client-side
2. You want to cache the results of remote API responses locally to server faster responses, and avoid overage costs for API's where you pay by the request
3. You want to serve cached results of remote API requests that have been performed by a worker process (_bonus points for performance_)

In the context of our demo app, an API request is made to the weather API endpoint defined in our plugin to retreive the weather for a users location. This provides a basic demonstration of how to write a PHP backend service that processes input from our Angular app.

**Important Note**

I am deliberately NOT using the official [WP REST API](https://wordpress.org/plugins/json-rest-api/) here. I personally believe in building minimal systems that solve specific problems, I think it make a big difference in terms of maintenance, sustainability and security. This is entirely my own opinion, but I beleive it's better to build your own microservices like this rather than load in the entire WP JSON api for many circumstances.

## <a name="angular-frontend"></a>Angular App Front-end

_The Angular.js app is currently using Angular 1. Most of the project I work on at the moment are still using Angular 1, only a few have made the switch to 2. Because some of this code is directly pulled from those projects I found it easier to work with Angular 1. **In the future I will update this to Angular 2 on another branch.**_

The Angular 1 app in this demo is very basic, but it does handle a few important things well:

1. Concatenates, minifies and proressively enhances LESS and JS using Gulp
1. Provides HTML5 pushState routing - NO hashbangs here (e.g. www.you.com/pathname/#/slug)
1. Handles 404's beneath our plugin's top level URL path
1. Route separation - Individual routes/views/controllers are broken down into separate files. When Angular projects get large and span multiple developers this is very helpful.
1. Uses the `$resource` service to interface with a custom HTTP API we'll define in WordPress
1. **Doesn't rely on the WordPress JSON API in anyway**
1. Provides access to the [Lodash](https://lodash.com/) as an Angular service and template helper

### Index template

Our Angular app is served from a single file: `./views/index.php`. This is where we define our `[ng-app]`, the structure of our HTML doc, and the `<ui-view />` directive provided by [ui-router](https://ui-router.github.io/). This tag will specify where every view inside of our Angular app will load when the URL changes or initially loads.

Using *.php and not *.html allows us to easily pass values from WordPress into Angular by adding them to an inline JSON object before we load `main.js`. This is a similar approadch to using the `wp_localize_script()` function in WordPress to pass PHP values from a plugin or theme into JS.

### Front-end Routing

The Angular app is served from a single file within the plugin: `./views/index.php`. This is where we define our `[ng-app]`, the structure of our HTML doc, and the `<ui-view />` directive provided by [ui-router](https://ui-router.github.io/). This tag will specify where every view inside of our Angular app will load when the URL changes or initially loads **at or below the app path defined by our plugin.**

This means that anything underneath this URL is handled by Angular.js routing and the [ui-router](https://ui-router.github.io/) module. We've specifically setup the way we route to and load in our `/views/index.php` file to support this structure. This will handle the WordPress angular routing in a seamless way so that:

1. If you visit the URL of an Angular defined route directly it will load in the expected route/view/controller configuration
2. When you browse from view-to-view within the app fully qualified URL's will be loaded into the browser using the HTML5 pushState API

It is only possible to do this if **EVERYTHING** underneath our `/wordpress-angular-plugin/` page is handled by Angular and UI router.

UI-Router defines routes for everything served by Angular undereath the `/wordpress-angular-plugin/` directory. Here's what a typical route definition looks like.

~~~.language-javascript
/**
 * Home View
 */

// Route
mainApp.config( function( $stateProvider, WP ) {
	$stateProvider.state( {
		name: 'home',
		url: '/',
		templateUrl: WP.plugin_url + '/views/home.html',
		controller: 'homeCtrl'
	} );
} );

// Controller
mainApp.controller( 'homeCtrl', function( $scope ) {} );
~~~

This is pulled right from the contents of the `/views/home.html` template. The `mainApp` is our main ng module defined in `/js/main.js` with `angular.module()`.

### Concatenating JS Includes

When you look at the source of `/js/main.js` you'll see a number of lines that look like this:

~~~.language-javascript
// =require ../vendor/angular-sanitize.js
// =require ../vendor/angular-animate.js
// =require ../vendor/angular-ui-router.js
~~~

These define external JS files that we want to include in our JS app. These are handled by gulp during the compile process with the help of the [gulp-include](https://www.npmjs.com/package/gulp-include) plugin. For now I find that this approach is straight forward and easier to work with than Webpack or CommonJS, but if you find that your `/dist/js/main.js` file is getting too large then it may be best to work with [Webpack](https://webpack.github.io/) instead.

_More information on the build process can be found in the [compiling with gulp](#gulp-compiling) section._

## <a name="gulp-compiling"></a>Compiling with Gulp

The plugin uses [Gulp](http://gulpjs.com/) to compile our CSS/JS and also prepares our HTML, with a few smart additions.

### Watch & Build CSS/JS

I recommend that you use the watch process to build your CSS/JS on-demand as it changes. This provides a faster web development workflow. To start gulp in watch mode open a Terminal window and go to the directory where you've cloned this plugin. Enter the `gulp` command in your prompt and Gulp will begin watching for JS/CSS changes.

If you've just cloned the repo you can build everything with the `gulp build` command. This will run through every process needed to everything we need to serve our micro app (CSS/JS/HTML).

### JS Compile Task

The `js-main` gulp task uses a few gulp plugins to compile and prepare our JavaScript files for the app. This part of the turorial is entirely opinionated, it's a set of tasks that I commonly use so I've included them here.

1. Sourcemaps will be generated for easier debugging
1. The [gulp-include](https://www.npmjs.com/package/gulp-include) plugin will provide an interface similar to CodeKit, allowing you to concatenate multiple JS files into a single compiled file
1. The [ng-annotate](https://www.npmjs.com/package/ng-annotate) plugin adds and removes AngularJS dependency injection annotations.
1. Uglify handles minification to compress our source
1. Caching is added to help speed up Uglify minification

### LESS Compile Task

The `less` task is pretty straight forward. It compiles LESS to CSS, with the following helpful additions:

1. Backwards support to automatically add browser prefixes with autoprefixer
2. Concatenation and minification handled by cleanCSS

## Conclusion

The combination of an Angular.js front-end and a WordPress API backend provides a powerful framework for building all kinds of find things. Hopefully this tutorial gives you a few ideas about how work with the two technologies in your projects. I do myself all the time. **If you have any questions, comments or feedback please let me know in the comments below.**