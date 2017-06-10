<?php
/**
 * Plugin Name: Angular.js App Demo
 * Plugin URI: https://www.kevinleary.net/wordpress-angular-plugin/
 * Description: Demo of an Angular.js app setup inside of a WordPress plugin.
 * Author: Kevin Leary
 * Version: 0.0.1
 * Author URI: 	http://www.kevinleary.net
*/

class ngApp
{	
	private $plugin_dir;
	private $html_route;
	private $api_route;


	/**
	 * Setup plugin
	 */
	public function __construct() {

		// General
		$this->plugin_dir = plugin_dir_path( __FILE__ );

		// Routing
		$this->api_route = '^api/weather/(.*)/?'; // Matches /api/weather/{position}
		$this->html_route = '/wordpress-angular-plugin/'; // Matches /wordpress-angular-plugin/
		add_filter( 'do_parse_request', array( $this, 'intercept_wp_router' ), 1, 3 );
		add_filter( 'rewrite_rules_array', array( $this, 'rewrite_rules' ) );
		add_filter( 'query_vars', array( $this, 'query_vars' ) );
		add_action( 'wp_loaded', array( $this, 'flush_rewrites' ) );
		add_action( 'parse_request', array( $this, 'weather_api' ), 1, 3 );
	}


	/**
	 * API Route Handler
	 */
	public function weather_api( $wp ) { 

		// Weather API
		if ( $wp->matched_rule !== $this->api_route )
			return;

		// Validate params
		if ( empty( $wp->query_vars['api_position'] ) ) {
			return wp_send_json_error( 'Missing required position parameters.' );
		}

		// Lookup weather forecast
		$position = esc_attr( $wp->query_vars['api_position'] );
		$coords = explode( ':', $position );
		$lat = round( floatval( $coords[0] ), 4 );
		$long = round( floatval( $coords[1] ), 4 );
		$url = "https://api.weather.gov/points/$lat,$long/forecast";
		$response = wp_remote_get( $url );
		$status = wp_remote_retrieve_response_code( $response );
		$body = wp_remote_retrieve_body( $response );
		$body = json_decode( $body, true );
		
		// Errors
		if ( $status !== 200 ) 
			wp_send_json_error( $body );

		// Success
		$ttl = DAY_IN_SECONDS;
		$ts = gmdate( "D, d M Y H:i:s", time() + $ttl ) . " GMT";
		header( "Expires: $ts" );
		header( "Pragma: cache" );
		header( "Cache-Control: max-age=$ttl" );
		wp_send_json_success( $body );
	}


	// flush_rules() if our rules are not yet included
	public function flush_rewrites() {
		$rules = get_option( 'rewrite_rules' );

		if ( ! isset( $rules[ $this->api_route ] ) ) {
			global $wp_rewrite;
			$wp_rewrite->flush_rules();
		}
	}

	// Add rule for /api/weather/{position}
	public function rewrite_rules( $rules ) {
		$rules[ $this->api_route ] = 'index.php?api_position=$matches[1]';
		return $rules;
	}

	// Adding the id var so that WP recognizes it
	public function query_vars( $vars ) {
		array_push( $vars, 'api_position' );
		return $vars;
	}


	/**
	 * Intercept WP Router
	 *
	 * Intercept WordPress rewrites and serve a 
	 * static HTML page for our angular.js app.
	 */
	public function intercept_wp_router( $continue, WP $wp, $extra_query_vars ) {

		// Conditions for url path
		$url_match = ( substr( $_SERVER['REQUEST_URI'], 0, strlen( $this->html_route ) ) === $this->html_route );
		if ( ! $url_match ) 
			return $continue;

		// Serve HTML
		ob_start();
		include_once( $this->plugin_dir . 'dist/index.html' );
		$html = ob_get_clean();
		die( $html );
	}

	/**
	 * Weather Lookup
	 */
	public function weather_forecast() {
		
	}

} // class ngApp

new ngApp();