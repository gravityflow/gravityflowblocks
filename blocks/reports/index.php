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

	$form = get_post_meta( get_the_ID(), '_gravityflow_reports_form_json', true );
	$form = json_decode( $form, true );
	if ( rgar( $form, 'value' ) ) {
		$attributes['form'] = $form['value'];
	}

	$attributes['range']    = get_post_meta( get_the_ID(), '_gravityflow_reports_range', true );
	$attributes['category'] = get_post_meta( get_the_ID(), '_gravityflow_reports_category', true );
	$attributes['step_id']  = get_post_meta( get_the_ID(), '_gravityflow_reports_step', true );
	$attributes['assignee']  = get_post_meta( get_the_ID(), '_gravityflow_reports_assignee', true );

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

	$metas = array(
		'_gravityflow_reports_range',
		'_gravityflow_reports_form_json',
		'_gravityflow_reports_category',
		'_gravityflow_reports_step',
		'_gravityflow_reports_assignee',
	);

	foreach ( $metas as $meta ) {
		register_meta( 'post', $meta, array(
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'string',
			'auth_callback' => function () {
				return GFAPI::current_user_can_any( 'gravityflow_view_all' );
			},
		) );
	}
}

add_action( 'init', 'gravityflow_register_reports_fields' );
