<?php
if ( ! class_exists( 'GFForms' ) ) {
	die();
}


class Gravity_Flow_REST_Inbox_Entries_Controller extends WP_REST_Controller {

	/**
	 * Endpoint namespace.
	 *
	 * @since 0.1
	 *
	 * @var string
	 */
	protected $namespace = 'gf/v2';

	/**
	 * @since 0.1
	 *
	 * @var string
	 */
	public $rest_base = 'inbox-entries';

	/**
	 * Register the routes for the objects of the controller.
	 *
	 * @since 0.1
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
	 * @since 0.1
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		require_once( gravity_flow()->get_base_path() . '/includes/pages/class-inbox.php' );

		$form_ids = $request->get_param( 'form-ids' );
		if ( is_array( $form_ids ) && count( $form_ids ) == 1 ) {
			$form_ids = $form_ids[0];
		}
		$args = array(
			'id_column'      => $request->get_param( 'id-column' ),
			'actions_column' => $request->get_param( 'actions-column' ),
			'last_updated'   => $request->get_param( 'last-updated' ),
			'due_date'       => $request->get_param( 'due-date' ),
			'form_id'        => $form_ids,
			'field_ids'      => GFAPI::current_user_can_any( 'gravityflow_status_view_all' ) ? $request->get_param( 'fields' ) : '',
		);
		$args = gravity_flow()->booleanize_shortcode_attributes( $args );
		$args = wp_parse_args( $args, Gravity_Flow_Inbox::get_defaults() );

		$entries  = Gravity_Flow_API::get_inbox_entries( $args, $total_count );

		$form_titles = array();

		$form_ids = wp_list_pluck( $entries, 'form_id' );

		$forms = GFFormsModel::get_forms();
		foreach ( $forms as $form ) {
			if ( isset( $form_ids[ $form->id ] ) ) {
				$form_titles[ $form->id ] = $form->title;
			}
		}

		$columns = Gravity_Flow_Inbox::get_columns( $args );
		$columns['form_id'] = __( 'Form ID', 'gravityforms' );

		$rows = array();

		foreach ( $entries as $entry ) {
			$row = array();
			$form      = GFAPI::get_form( $entry['form_id'] );
			foreach ( $columns as $id => $label ) {
				$row[ $id ] = Gravity_Flow_Inbox::get_column_value( $id, $form, $entry, $columns );
			}
			$rows[] = $row;
		}

		// JavaScript doesn't guarantee the order of object keys so deliver as numeric array
		$columns_numeric_array = array();
		foreach ( $columns as $key => $value ) {
			$columns_numeric_array[] = array(
				'key' => $key,
				'title' => $value,
			);
		}

		$data = array(
			'total_count' => $total_count,
			'rows'     => $rows,
			'columns'      => $columns_numeric_array,
			'form_titles' => $form_titles,
		);
		$response = rest_ensure_response( $data );

		return $response;
	}

	/**
	 * Check if a given request has access to get items
	 *
	 * @since 2.4-beta-1
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function get_items_permissions_check( $request ) {
		// Permissions are checked in the Gravity Flow API
		return true;
	}

	/**
	 * Get the query params for collections
	 *
	 * @todo
	 *
	 * @since 2.4-beta-1
	 *
	 * @return array
	 */
	public function get_collection_params() {
		return array();
	}

}
