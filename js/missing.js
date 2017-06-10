/**
 * 404 / Page Not Found
 */

// Route
mainApp.config( function( $stateProvider, WP ) {
	$stateProvider.state( {
		name: 'missing',
		url: '/not-found/',
		templateUrl: WP.plugin_url + '/views/missing.html',
		controller: 'missingCtrl'
	} );
} );

// Controller
mainApp.controller( 'missingCtrl', function( $scope ) {
	$scope.currentUrl = window.location.href;
} );