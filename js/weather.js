/**
 * Weather View
 */

// Route
mainApp.config( function( $stateProvider, WP ) {
	$stateProvider.state( {
		name: 'weather',
		url: '/weather/',
		templateUrl: WP.plugin_url + '/views/weather.html',
		controller: 'weatherCtrl'
	} );
} );

// API Connection
mainApp.factory( 'Weather', [ '$resource', function( $resource ) {
	return $resource( '/api/weather/:position', {}, {
		get: {
			method: 'GET',
			cache: true
		}
	} );
} ] );

// Controller
mainApp.controller( 'weatherCtrl', function( $scope, $q, Weather ) {
	var cacheKey = 'weather-position';

	// Find user location
	var getUserLocation = function() {
		var deferred = $q.defer();
		var ttl = 86400 * 1000; // 1 day

		navigator.geolocation.getCurrentPosition( function( position ) {
			deferred.resolve( position );
		}, function( error ) {
			deferred.reject( error );
		}, {
			maximumAge: ttl,
			enableHighAccuracy: false
		} );

		return deferred.promise;
	};

	// Request forecast
	$scope.lookupWeather = function() {

		// Serve from cache
		var cache = sessionStorage.getItem( cacheKey );
		if ( cache ) {
			$scope.forecast = JSON.parse( cache );
			return;
		}

		// Find current geolocation
		$scope.loading = true;

		getUserLocation().then( function( position ) {
			Weather.get( {
				position: position.coords.latitude + ':' + position.coords.longitude
			} ).$promise.then( function( result ) {
				sessionStorage.setItem( cacheKey, JSON.stringify( result.data ) );
				$scope.forecast = result.data;
				$scope.loading = false;
			} );
		} ).catch( function( err ) {
			console.warn( err );
		} );
	};
} );