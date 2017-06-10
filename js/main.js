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
mainApp.constant( 'WP', {
	plugin_url: '/wp-content/plugins/wordpress-angular-plugin'
} );

// Routing
mainApp.config( function( $urlRouterProvider, $locationProvider ) {
	$locationProvider.html5Mode( true );
	$urlRouterProvider.otherwise( '/' );
} );

// Boot
mainApp.run( function( $rootScope, _ ) {

	// Routing $scope variables
	$rootScope.$on( '$stateChangeStart', function( event, toState, toParams, fromState, fromParams, options ) {
		$rootScope.toState = toState;
		$rootScope.fromState = fromState;
	} );

	// Logging for errors
	$rootScope.$on( "$stateChangeError", console.error.bind( console, '$stateChangeError' ) );

	// Global lodash
	$rootScope._ = window._;
} );

// =require home.js
// =require weather.js