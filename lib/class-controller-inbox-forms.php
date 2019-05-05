<?php
if ( ! class_exists( 'GFForms' ) ) {
	die();
}


class Gravity_Flow_REST_Inbox_Forms_Controller extends GF_REST_Controller {

	/**
	 * @since 0.1
	 *
	 * @var string
	 */
	public $rest_base = 'workflow/forms';

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

		$form_details = array();

		$form_ids = gravity_flow()->get_workflow_form_ids();
		$forms = GFFormsModel::get_form_meta_by_id( $form_ids );
		foreach ( $forms as $form ) {
			$field_data = array();
			foreach ( $form['fields'] as $field ) {
				/** @var GF_Field $field */
				$field_data[ $field->id ] = array(
					'id'     => $field->id,
					'label'  => $field->label,
					'inputs' => $field->get_entry_inputs(),
				);
			}
			$form_details[ $form['id'] ] = array( 'id' => $form['id'], 'title' => $form['title'], 'fields' => $field_data );
		}

		$response = rest_ensure_response( $form_details );

		return $response;
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

		return GFAPI::current_user_can_any( array( 'gravityflow_view_all' ) );
	}
}
