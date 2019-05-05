/* Copyright (C) 2019 Steven Henty S.L. - All Rights Reserved */

import icon from './icon'
import './editor.scss'
import Edit from './edit'
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;


registerBlockType(
	'gravityflow/inbox',
	{
		title: __( 'Workflow Inbox', 'gravityflow' ),
		description: __( 'Displays the workflow inbox.', 'gravityflow' ),
		icon: {
			src: icon,
		},
		category: 'widgets',
		supports: {
			multiple: false,
			html: false,
			anchor: true,
		},
		attributes: {
			step_highlight: {
				type: 'boolean',
				default: true,
			},
			id_column: {
				type: 'boolean',
				default: true,
			},
			submitter_column: {
				type: 'boolean',
				default: true,
			},
			step_column: {
				type: 'boolean',
				default: true,
			},
			actions_column: {
				type: 'boolean',
				default: false,
			},
			last_updated: {
				type: 'boolean',
				default: false,
			},
			due_date: {
				type: 'boolean',
				default: false,
			},
			selected_forms_json: {
				type: 'string',
				source: 'meta',
				meta: '_gravityflow_inbox_forms_json',
				default: '',
			},
			selected_fields_json: {
				type: 'string',
				source: 'meta',
				meta: '_gravityflow_inbox_fields_json',
				default: '',
			},
			timeline: {
				type: 'boolean',
				default: true,
			},
			step_status: {
				type: 'boolean',
				default: true,
			},
			workflow_info: {
				type: 'boolean',
				default: true,
			},
			sidebar: {
				type: 'boolean',
				default: true,
			},
			back_link: {
				type: 'boolean',
				default: false,
			},
			back_link_text: {
				type: 'string',
				default: __( 'Back to Inbox', 'gravityflow' ),
			},
			back_link_url: {
				type: 'string',
				default: '',
			},
		},
		edit: Edit,
		save() {
			return (
				null
			);
		},
	} );
