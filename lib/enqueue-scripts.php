<?php

add_action( 'enqueue_block_editor_assets', 'gravityflow_enqueue_block_editor_assets' );
/**
 * Enqueue block editor only JavaScript and CSS.
 */
function gravityflow_enqueue_block_editor_assets() {
	$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG || isset( $_GET['gform_debug'] ) ? '' : '.min';

	$block_path = "/assets/js/editor.blocks{$min}.js";
	$style_path = '/assets/css/blocks.editor.css';

	// Enqueue the bundled block JS file
	wp_enqueue_script(
		'gravityflow-blocks-js',
		_get_plugin_url() . $block_path,
		[ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' ],
		filemtime( _get_plugin_directory() . $block_path )
	);

	// Enqueue optional editor only styles
	wp_enqueue_style(
		'gravityflow-blocks-editor-css',
		_get_plugin_url() . $style_path,
		[ ],
		filemtime( _get_plugin_directory() . $style_path )
	);

	// Enqueue scripts for Reports.
	wp_enqueue_script( 'google_charts', 'https://www.google.com/jsapi',  array(), gravity_flow()->_version );
}

