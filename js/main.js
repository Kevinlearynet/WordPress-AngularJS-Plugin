/**
 * Angular.js App: mainApp
 */

// =require ../vendor/lodash.js
// =require ../vendor/angular.js
// =require ../vendor/angular-resource.js
// =require ../vendor/angular-sanitize.js
// =require ../vendor/angular-animate.js
// =require ../vendor/angular-ui-router.js

// App module
var mainApp = angular.module( "mainApp", [
	'ng',
	'ngResource',
	'ngSanitize',
	'ui.router',
	'ngAnimate'
] );

// Third-party support
mainApp.constant( '_', window._ );
mainApp.constant( 'WP', window.WP );


// Routing
mainApp.config( function( $urlRouterProvider, $locationProvider ) {
	$locationProvider.html5Mode( true );
	$urlRouterProvider.otherwise( '/not-found/' );
} );

// Boot
mainApp.run( function( $rootScope, _ ) {

	// Log routing errors
	$rootScope.$on( "$stateChangeError", console.error.bind( console, '$stateChangeError' ) );

	// Global lodash
	$rootScope._ = window._;
} );

/**
 * Individual Routes/Views/Controllers
 */

// =require home.js
// =require weather.js
// =require missing.js