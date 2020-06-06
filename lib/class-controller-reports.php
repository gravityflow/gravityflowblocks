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

		$assignee_key = sanitize_text_field( $request->get_param( 'assignee' ) );
		list( $assignee_type, $assignee_id ) = rgexplode( '|', $assignee_key, 2 );

		$range = sanitize_text_field( $request->get_param( 'range' ) );
		switch ( $range ) {
			case 'last-6-months' :
				$start_date = date( 'Y-m-d', strtotime( '-6 months' ) );
				break;
			case 'last-3-months' :
				$start_date = date( 'Y-m-d', strtotime( '-3 months' ) );
				break;
			default :
				$start_date = date( 'Y-m-d', strtotime( '-1 year' ) );
		}

		$app_settings  = gravity_flow()->get_app_settings();
		$allow_reports = rgar( $app_settings, 'allow_display_reports' );

		$args = array(
			'display_header'    => false,
			'form_id'           => $request->get_param( 'form' ),
			'range'             => $range,
			'start_date'        => $start_date,
			'category'          => $request->get_param( 'category' ),
			'step_id'           => $request->get_param( 'step-id' ),
			'assignee'          => $assignee_key,
			'assignee_type'     => $assignee_type,
			'assignee_id'       => $assignee_id,
			'display_filter'    => $request->get_param( 'display_filter' ),
			'check_permissions' => ! $allow_reports,
		);

		$result = Gravity_Flow_Reports::output_reports( $args, 'json' );

		return rest_ensure_response( $result );
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
