/**
 * Angular.js App: mainApp
 */

// =require ../vendor/lodash.js
// =require ../vendor/angular.js
// =require ../vendor/angular-resource.js
// =require ../vendor/angular-sanitize.js
// =require ../vendor/angular-animate.js
// =require ../vendor/angular-ui-router.js

var mainApp = angular.module( "mainApp", [
	'ng',
	'ngResource',
	'ngSanitize',
	'ui.router',
	'ngAnimate'
] );

/**
 * Lodash Support
 */
mainApp.constant( '_', window._ );
mainApp.constant( 'WP', {
	plugin_url: '/wp-content/plugins/angular-app'
} );

/**
 * HTML5 pushState Routing
 */
mainApp.config( function( $urlRouterProvider, $locationProvider ) {
	$locationProvider.html5Mode( true );
	$urlRouterProvider.otherwise( '/' );
} );

/**
 * Define Route(s)
 */
mainApp.config( function( $stateProvider, $urlRouterProvider, WP ) {

	$stateProvider
		.state( {
			name: 'home',
			url: '/',
			templateUrl: WP.plugin_url + '/views/home.html',
			controller: 'homeCtrl'
		} )
		.state( {
			name: 'two',
			url: '/two/',
			templateUrl: WP.plugin_url + '/views/two.html',
			controller: 'twoCtrl'
		} )
		.state( {
			name: 'three',
			url: '/three/',
			templateUrl: WP.plugin_url + '/views/three.html',
			controller: 'threeCtrl'
		} )
		.state( {
			name: 'four',
			url: '/four/',
			templateUrl: WP.plugin_url + '/views/four.html',
			controller: 'fourCtrl'
		} );
} ).run( function run( $rootScope ) {
	$rootScope.$on( "$stateChangeError", console.error.bind( console, '$stateChangeError' ) );
} )

/**
 * Run events
 */
mainApp.run( function( $rootScope, _ ) {

	// Routing $scope variables
	$rootScope.$on( '$stateChangeStart', function( event, toState, toParams, fromState, fromParams, options ) {
		$rootScope.toState = toState;
		$rootScope.fromState = fromState;
	} );

	// Global lodash
	$rootScope._ = window._;

} );

/**
 * Master parent controller
 */
mainApp.controller( 'masterCtrl', function( $scope ) {} );

/**
 * UI Router controllers
 */
mainApp.controller( 'homeCtrl', function( $scope ) {} );
mainApp.controller( 'twoCtrl', function( $scope ) {} );
mainApp.controller( 'threeCtrl', function( $scope ) {} );
mainApp.controller( 'fourCtrl', function( $scope ) {} );