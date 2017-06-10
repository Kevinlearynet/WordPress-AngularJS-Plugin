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