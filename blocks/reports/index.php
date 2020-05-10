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
 *
 * @return void|string
 */
function gravityflow_render_reports( $attributes, $content ) {

	if ( is_admin() ) {
		return;
	}

	$form = json_decode( $attributes['selectedFormJson'], true );
	if ( rgar( $form, 'value' ) ) {
		$attributes['form'] = $form['value'];
	}

	if ( ! rgar( $attributes, 'displayFilter' ) ) {
		$attributes['display_filter'] = false;
	}

	$shortcode_atts = array();
	foreach ( $attributes as $key => $value ) {
		// Convert camel to snake
		$snake_key                    = strtolower( preg_replace( '/(?<!^)[A-Z]/', '_$0', $key ) );
		$shortcode_atts[ $snake_key ] = $value;
	}

	$shortcode_atts = shortcode_atts( gravity_flow()->get_shortcode_defaults(), $shortcode_atts );


	return gravity_flow()->get_shortcode_reports_page( $shortcode_atts );
}
