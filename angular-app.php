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


	/**
	 * Setup plugin
	 */
	public function __construct() {

		// Define vars
		$this->plugin_dir = plugin_dir_path( __FILE__ );

		// Define routes
		add_filter( 'do_parse_request', array( $this, 'routing' ), 1, 3 );
	}


	/**
	 * Intercept WP Router
	 *
	 * Super basic way to intercept WordPress rewrites and serve a
	 * static HTML page. For more advanced use cases I suggest something
	 * like [klein-php](https://github.com/klein/klein.php).
	 */
	public function routing( $continue, WP $wp, $extra_query_vars ) {

		// Conditions for url path
		$path = '/wordpress-angular-plugin/';
		$url_match = ( substr( $_SERVER['REQUEST_URI'], 0, strlen( $path ) ) === $path );
		if ( ! $url_match ) 
			return $continue;

		// Serve HTML
		ob_start();
		include_once( $this->plugin_dir . 'dist/index.html' );
		$html = ob_get_clean();
		die( $html );
	}

} // class ngApp

new ngApp();