<?php

add_action( 'init', 'gravityflow_register_reports_dynamic_block' );
/**
 * Register the dynamic block.
 *
 * @since 0.3
 *
 * @return void
 */
function gravityflow_register_reports_dynamic_block() {

	// Only load if Gutenberg is available.
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	// Hook server side rendering into render callback
	register_block_type( 'gravityflow/reports', [
		'render_callback' => 'gravityflow_render_reports',
	] );

}

/**
 * Server rendering for reports
 */
function gravityflow_render_reports( $attributes, $content ) {

	$saved_form_ids_json  = get_post_meta( get_the_ID(), '_gravityflow_reports_forms_json', true );
	$saved_form_ids       = json_decode( $saved_form_ids_json, true );
	$form_ids             = is_array( $saved_form_ids ) ? wp_list_pluck( $saved_form_ids, 'value' ) : array();
	$attributes['form']   = join( ',', $form_ids );
	$saved_field_ids_json = get_post_meta( get_the_ID(), '_gravityflow_reports_fields_json', true );
	$saved_field_ids      = json_decode( $saved_field_ids_json, true );
	$fields               = is_array( $saved_field_ids ) ? wp_list_pluck( $saved_field_ids, 'value' ) : array();
	$attributes['fields'] = join( ',', $fields );

	$shortcode_atts = array();
	foreach ( $attributes as $key => $value ) {
		// Convert camel to snake
		$snake_key                    = strtolower( preg_replace( '/(?<!^)[A-Z]/', '_$0', $key ) );
		$shortcode_atts[ $snake_key ] = $value;
	}

	$shortcode_atts = shortcode_atts( gravity_flow()->get_shortcode_defaults(), $shortcode_atts );


	return gravity_flow()->get_shortcode_reports_page( $shortcode_atts );
}

function gravityflow_register_reports_fields() {

	if ( ! GFAPI::current_user_can_any( 'gravityflow_status_view_all' ) ) {
		return;
	}

	register_meta( 'post', '_gravityflow_reports_fields_json', array(
		'show_in_rest'  => true,
		'single'        => true,
		'type'          => 'string',
		'auth_callback' => function () {
			return GFAPI::current_user_can_any( 'gravityflow_view_all' );
		},
	) );
	register_meta( 'post', '_gravityflow_reports_forms_json', array(
		'show_in_rest'  => true,
		'single'        => true,
		'type'          => 'string',
		'auth_callback' => function () {
			return GFAPI::current_user_can_any( 'gravityflow_view_all' );
		},
	) );
}

add_action( 'init', 'gravityflow_register_reports_fields' );
