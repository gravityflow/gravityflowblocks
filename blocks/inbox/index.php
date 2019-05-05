<?php

add_action( 'plugins_loaded','register_inbox_dynamic_block' );
/**
 * Register the dynamic block.
 *
 * @since 2.1.0
 *
 * @return void
 */
function register_inbox_dynamic_block() {

	// Only load if Gutenberg is available.
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	// Hook server side rendering into render callback
	register_block_type( 'gravityflow/inbox', [
		'render_callback' => 'render_inbox',
	] );

}

/**
 * Server rendering for inbox
 */
function render_inbox( $attributes, $content ) {

	$saved_form_ids_json = get_post_meta( get_the_ID(), '_gravityflow_inbox_form_ids', true );
	$saved_form_ids = json_decode( $saved_form_ids_json, true );
	$form_ids = is_array( $saved_form_ids ) ? wp_list_pluck( $saved_form_ids, 'value' ) : array();
	$attributes['form'] = join( ',', $form_ids );
	$saved_field_ids_json = get_post_meta( get_the_ID(), '_gravityflow_inbox_fields', true );
	$saved_field_ids = json_decode( $saved_field_ids_json, true );
	$fields = is_array( $saved_field_ids ) ? wp_list_pluck( $saved_field_ids, 'value' ) : array();
	$attributes['fields'] = join( ',', $fields );
	$attributes           = shortcode_atts( gravity_flow()->get_shortcode_defaults(), $attributes );

	return gravity_flow()->get_shortcode_inbox_page( $attributes );
}

function gravityflow_register_inbox_fields() {
	register_meta( 'post', '_gravityflow_inbox_fields_json', array(
		'show_in_rest' => true,
		'single' => true,
		'type' => 'string',
		'auth_callback' => function() {
			return GFAPI::current_user_can_any( 'gravityflow_view_all' );
		}
	) );
	register_meta( 'post', '_gravityflow_inbox_forms_json', array(
		'show_in_rest' => true,
		'single' => true,
		'type' => 'string',
		'auth_callback' => function() {
			return GFAPI::current_user_can_any( 'gravityflow_view_all' );
		}
	) );
}
add_action( 'init', 'gravityflow_register_inbox_fields' );


//add_filter( 'rest_pre_insert_page', 'gravityflow_block_attribute_validation', 10, 2 );
function gravityflow_block_attribute_validation ( $prepared_post, $request ) {
	$current_post = get_post( $prepared_post->ID );

	$current_post->post_content;

	$current_blocks = parse_blocks( $prepared_post->post_content );

	foreach( $current_blocks as $block ) {
		if( $block['blockName'] == 'gravityflow/inbox' && rgars( $block, 'attrs/fields' ) ) {
			$fields = rgars( $block, 'attrs/fields' );
			if ( ! empty( $fields ) ) {
				return new WP_Error( 'my_error', 'Bye!' );
			}

		}
	}

	return $prepared_post;
}
function my_test_allowed_block_types( $allowed_block_types, $post ) {
	if ( $post->post_type === 'post' ) {
		return $allowed_block_types;
	}
	return $allowed_block_types;
}

//add_filter( 'allowed_block_types', 'my_test_allowed_block_types', 10, 2 );