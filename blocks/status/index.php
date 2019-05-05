<?php

add_action( 'plugins_loaded','register_status_block' );
/**
 * Register the status block.
 *
 * @since 0.1
 */
function register_status_block() {

	// Only load if Gutenberg is available.
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	// Hook server side rendering into render callback
	register_block_type( 'gravityflow/status', [
		'render_callback' => 'render_status',
	] );

}

/**
 * Server rendering for status
 */
function render_status( $attributes, $content ) {

	$saved_form_ids_json  = get_post_meta( get_the_ID(), '_gravityflow_status_forms_json', true );
	$saved_form_ids       = json_decode( $saved_form_ids_json, true );
	$form_ids             = is_array( $saved_form_ids ) ? wp_list_pluck( $saved_form_ids, 'value' ) : array();
	$attributes['form']   = join( ',', $form_ids );
	$saved_field_ids_json = get_post_meta( get_the_ID(), '_gravityflow_status_fields_json', true );
	$saved_field_ids      = json_decode( $saved_field_ids_json, true );
	$fields               = is_array( $saved_field_ids ) ? wp_list_pluck( $saved_field_ids, 'value' ) : array();
	$attributes['fields'] = join( ',', $fields );

	$attributes['display_all'] = get_post_meta( get_the_ID(), '_gravityflow_status_display_all', true );

	$attributes['allow_anonymous'] = get_post_meta( get_the_ID(), '_gravityflow_status_allow_anonymous', true );

	$attributes = shortcode_atts( gravity_flow()->get_shortcode_defaults(), $attributes );

	wp_enqueue_script( 'gravityflow_entry_detail' );
	wp_enqueue_script( 'gravityflow_status_list' );

	$html = '';
	if ( rgget( 'view' ) || ! empty( $entry_id ) ) {
		$html .= gravity_flow()->get_shortcode_status_page_detail( $attributes );
	} elseif ( is_user_logged_in() || ( $attributes['display_all'] && $attributes['display_all'] ) ) {
		$html .= gravity_flow()->get_shortcode_status_page( $attributes );
	}

	return $html;
}

function gravityflow_register_status_fields() {
	register_meta( 'post', '_gravityflow_status_fields_json', array(
		'show_in_rest' => true,
		'single' => true,
		'type' => 'string',
		'auth_callback' => function() {
			return GFAPI::current_user_can_any( 'gravityflow_view_all' );
		}
	) );
	register_meta( 'post', '_gravityflow_status_forms_json', array(
		'show_in_rest' => true,
		'single' => true,
		'type' => 'string',
		'auth_callback' => function() {
			return GFAPI::current_user_can_any( 'gravityflow_view_all' );
		}
	) );
	register_meta( 'post', '_gravityflow_status_display_all', array(
		'show_in_rest' => true,
		'single' => true,
		'type' => 'boolean',
		'auth_callback' => function() {
			return GFAPI::current_user_can_any( 'gravityflow_view_all' );
		}
	) );
	register_meta( 'post', '_gravityflow_status_allow_anonymous', array(
		'show_in_rest' => true,
		'single' => true,
		'type' => 'boolean',
		'auth_callback' => function() {
			return GFAPI::current_user_can_any( 'gravityflow_view_all' );
		}
	) );
}
add_action( 'init', 'gravityflow_register_status_fields' );