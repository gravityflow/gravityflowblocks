<?php
if ( ! class_exists( 'GFForms' ) ) {
	die();
}


class Gravity_Flow_REST_Inbox_Forms_Controller extends WP_REST_Controller {

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

		register_rest_route( $namespace, '/' . $base . '/(?P<id>[\d]+)/steps', array(
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
	 * @since 0.2 Added support for getting steps.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {

		if ( strstr( $request->get_route(), 'steps' ) ) {
			$response = $this->get_steps( $request );
		} else {
			$response = $this->get_forms();
		}

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

		return GFAPI::current_user_can_any( array( 'gravityflow_status_view_all' ) );
	}

	/**
	 * Get all forms with workflow.
	 *
	 * @since 0.2
	 *
	 * @return WP_REST_Response
	 */
	private function get_forms() {
		$form_details = array();

		$form_ids = gravity_flow()->get_workflow_form_ids();
		$forms    = GFFormsModel::get_form_meta_by_id( $form_ids );

		$published_form_ids = gravity_flow()->get_published_form_ids();

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
			$form_details[ $form['id'] ] = array(
				'id'     => $form['id'],
				'title'  => $form['title'],
				'fields' => $field_data,
				'isPublished' => in_array( $form['id'], $published_form_ids )
			);
		}

		return rest_ensure_response( $form_details );
	}

	/**
	 * Get workflow steps by request.
	 *
	 * @since 0.2
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response
	 */
	private function get_steps( $request ) {
		$steps = gravity_flow()->get_steps( $request['id'] );

		$_steps = array();
		foreach ( $steps as $step ) {
			$assignees     = $step->get_assignees();
			$assignee_vars = array();
			foreach ( $assignees as $assignee ) {
				$assignee_id = $assignee->get_id();
				if ( ! empty( $assignee_id ) ) {
					$assignee_vars[] = array(
						'key'  => $assignee->get_key(),
						'name' => $assignee->get_display_name(),
					);
				}
			}
			$_steps[ $step->get_id() ] = array(
				'id'        => $step->get_id(),
				'name'      => $step->get_name(),
				'assignees' => $assignee_vars,
			);
		}

		return rest_ensure_response( $_steps );
	}
}
