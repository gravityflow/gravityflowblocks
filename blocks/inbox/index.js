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
		keywords: [ __( 'Gravity Flow' ), __( 'Gravity' ) ],
		category: 'widgets',
		supports: {
			multiple: false,
			html: false,
			anchor: true,
		},
		attributes: {
			stepHighlight: {
				type: 'boolean',
				default: true,
			},
			idColumn: {
				type: 'boolean',
				default: true,
			},
			submitterColumn: {
				type: 'boolean',
				default: true,
			},
			stepColumn: {
				type: 'boolean',
				default: true,
			},
			actionsColumn: {
				type: 'boolean',
				default: false,
			},
			lastUpdated: {
				type: 'boolean',
				default: false,
			},
			dueDate: {
				type: 'boolean',
				default: false,
			},
			selectedFormsJson: {
				type: 'string',
				source: 'meta',
				meta: '_gravityflow_inbox_forms_json',
				default: '',
			},
			selectedFieldsJson: {
				type: 'string',
				source: 'meta',
				meta: '_gravityflow_inbox_fields_json',
				default: '',
			},
			timeline: {
				type: 'boolean',
				default: true,
			},
			stepStatus: {
				type: 'boolean',
				default: true,
			},
			workflowInfo: {
				type: 'boolean',
				default: true,
			},
			sidebar: {
				type: 'boolean',
				default: true,
			},
			backLink: {
				type: 'boolean',
				default: false,
			},
			backLinkText: {
				type: 'string',
				default: __( 'Return to list', 'gravityflow' ),
			},
			backLinkUrl: {
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
