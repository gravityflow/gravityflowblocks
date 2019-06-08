<?php

add_action( 'plugins_loaded', 'gravityflow_register_inbox_dynamic_block' );
/**
 * Register the dynamic block.
 *
 * @since 2.1.0
 *
 * @return void
 */
function gravityflow_register_inbox_dynamic_block() {

	// Only load if Gutenberg is available.
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	// Hook server side rendering into render callback
	register_block_type( 'gravityflow/inbox', [
		'render_callback' => 'gravityflow_render_inbox',
	] );

}

/**
 * Server rendering for inbox
 */
function gravityflow_render_inbox( $attributes, $content ) {

	$saved_form_ids_json  = get_post_meta( get_the_ID(), '_gravityflow_inbox_forms_json', true );
	$saved_form_ids       = json_decode( $saved_form_ids_json, true );
	$form_ids             = is_array( $saved_form_ids ) ? wp_list_pluck( $saved_form_ids, 'value' ) : array();
	$attributes['form']   = join( ',', $form_ids );
	$saved_field_ids_json = get_post_meta( get_the_ID(), '_gravityflow_inbox_fields_json', true );
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


	return gravity_flow()->get_shortcode_inbox_page( $shortcode_atts );
}

function gravityflow_register_inbox_fields() {
	
	if ( ! GFAPI::current_user_can_any( 'gravityflow_status_view_all' ) ) {
		return;
	}
	
	register_meta( 'post', '_gravityflow_inbox_fields_json', array(
		'show_in_rest'  => true,
		'single'        => true,
		'type'          => 'string',
		'auth_callback' => function () {
			return GFAPI::current_user_can_any( 'gravityflow_view_all' );
		},
	) );
	register_meta( 'post', '_gravityflow_inbox_forms_json', array(
		'show_in_rest'  => true,
		'single'        => true,
		'type'          => 'string',
		'auth_callback' => function () {
			return GFAPI::current_user_can_any( 'gravityflow_view_all' );
		},
	) );
}

add_action( 'init', 'gravityflow_register_inbox_fields' );


