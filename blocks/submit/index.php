<?php

add_action( 'plugins_loaded', 'gravityflow_register_submit_block' );
/**
 * Register the status block.
 *
 * @since 0.1
 */
function gravityflow_register_submit_block() {

	// Only load if Gutenberg is available.
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	// Hook server side rendering into render callback
	register_block_type( 'gravityflow/submit', [
		'render_callback' => 'gravityflow_render_submit',
	] );

}

/**
 * Server rendering for status
 */
function gravityflow_render_submit( $attributes, $content ) {

	$saved_form_ids_json = get_post_meta( get_the_ID(), '_gravityflow_submit_forms_json', true );
	$saved_form_ids      = json_decode( $saved_form_ids_json, true );
	$form_ids            = is_array( $saved_form_ids ) ? wp_list_pluck( $saved_form_ids, 'value' ) : array();

	ob_start();
	gravity_flow()->submit_page( false, $form_ids );
	$html = ob_get_clean();

	return $html;
}

function gravityflow_register_submit_fields() {

	if ( ! GFAPI::current_user_can_any( 'gravityflow_status_view_all' ) ) {
		return;
	}

	register_meta( 'post', '_gravityflow_submit_forms_json', array(
		'show_in_rest'  => true,
		'single'        => true,
		'type'          => 'string',
		'auth_callback' => function () {
			return GFAPI::current_user_can_any( 'gravityflow_view_all' );
		},
	) );
}

add_action( 'init', 'gravityflow_register_submit_fields' );
