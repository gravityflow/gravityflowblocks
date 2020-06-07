<?php
/**
 * Plugin Name: Gravity Flow Blocks
 * Plugin URI:  https://gravityflow.io
 * Description: Gravity Flow Blocks for the WordPress editor.
 * Version:     0.3
 * Author:      Gravity Flow
 * Text Domain: gravityflow
 * Domain Path: /languages
 * License:     GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

//  Exit if accessed directly.
defined( 'ABSPATH' ) || exit;


add_action( 'gravityflow_loaded', array( 'Gravity_Flow_Blocks_Bootstrap', 'load' ) );

/**
 * Class Gravity_Flow_Bootstrap
 */
class Gravity_Flow_Blocks_Bootstrap {

	/**
	 * Includes the required files and registers the add-on with Gravity Forms.
	 */
	public static function load() {

		if ( ! class_exists( 'GF_REST_API' ) ) {
			require_once GFCommon::get_base_path() . '/includes/webapi/v2/includes/controllers/class-gf-rest-controller.php';
		}

		include __DIR__ . '/lib/class-controller-inbox-entries.php';
		include __DIR__ . '/lib/class-controller-inbox-forms.php';
		include __DIR__ . '/lib/class-controller-reports.php';

		add_action( 'rest_api_init', array( 'Gravity_Flow_Blocks_Bootstrap', 'register_rest_routes' ) );

		// Enqueue JS and CSS.
		include __DIR__ . '/lib/enqueue-scripts.php';
		include __DIR__ . '/blocks/inbox/index.php';
		include __DIR__ . '/blocks/status/index.php';
		include __DIR__ . '/blocks/submit/index.php';
		include __DIR__ . '/blocks/reports/index.php';
	}

	/**
	 * Register REST API routes
	 *
	 * @since 0.1
	 */
	public static function register_rest_routes() {
		$controllers = array(
			'Gravity_Flow_REST_Inbox_Entries_Controller',
			'Gravity_Flow_REST_Inbox_Forms_Controller',
			'Gravity_Flow_REST_Reports_Controller',
		);

		foreach ( $controllers as $controller ) {
			$controller_obj = new $controller();
			$controller_obj->register_routes();
		}
	}

}

/**
 * Gets this plugin's absolute directory path.
 *
 * @since  0.1
 * @ignore
 *
 * @return string
 */
function _get_plugin_directory() {
	return __DIR__;
}

/**
 * Gets this plugin's URL.
 *
 * @since  0.1
 * @ignore
 *
 * @return string
 */
function _get_plugin_url() {
	static $plugin_url;

	if ( empty( $plugin_url ) ) {
		$plugin_url = plugins_url( null, __FILE__ );
	}

	return $plugin_url;
}


