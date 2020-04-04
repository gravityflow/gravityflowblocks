<?php
if ( ! class_exists( 'GFForms' ) ) {
	die();
}


class Gravity_Flow_REST_Reports_Controller extends WP_REST_Controller {

	/**
	 * Endpoint namespace.
	 *
	 * @since 0.2
	 *
	 * @var string
	 */
	protected $namespace = 'gf/v2';

	/**
	 * @since 0.2
	 *
	 * @var string
	 */
	public $rest_base = 'workflow/reports';

	/**
	 * Register the routes for the objects of the controller.
	 *
	 * @since 0.2
	 *
	 */
	public function register_routes() {

		$namespace = $this->namespace;

		$base = $this->rest_base;

		register_rest_route( $namespace, '/' . $base, array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'                => $this->get_collection_params(),
			),
		) );
	}

	/**
	 * Get a collection of entries
	 *
	 * @since 0.2
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		require_once( gravity_flow()->get_base_path() . '/includes/pages/class-reports.php' );

		$defaults = array(
			'display_filter' => true,
			'check_permission' => true,
		);

		$args = wp_parse_args( array(), $defaults );

		return rest_ensure_response( Gravity_Flow_Reports::report_all_forms( $args, 'json' ) );
	}


	/**
	 * Check if a given request has access to get items
	 *
	 * @since 0.1
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function get_items_permissions_check( $request ) {

		return GFAPI::current_user_can_any( array( 'gravityflow_reports' ) );
	}
}
