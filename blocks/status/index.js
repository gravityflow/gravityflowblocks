import icon from './icon'
import './editor.scss'
import './style.scss'
import Edit from './edit'
import '../store'

const { __ } = wp.i18n
const { registerBlockType } = wp.blocks


registerBlockType(
	'gravityflow/status',
	{
		title: __( 'Workflow Status', 'gravityflow' ),
		description: __( 'Display the workflow status list.', 'gravityflow' ),
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
				meta: '_gravityflow_status_forms_json',
				default: '',
			},
			selectedFieldsJson: {
				type: 'string',
				source: 'meta',
				meta: '_gravityflow_status_fields_json',
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
			displayAll: {
				type: 'boolean',
				source: 'meta',
				meta: '_gravityflow_status_display_all',
				default: false,
			},
			allowAnonymous: {
				type: 'boolean',
				source: 'meta',
				meta: '_gravityflow_status_allow_anonymous',
				default: false,
			},
		},
		edit: Edit
		, // end edit
		save() {
			return (
				null
			);
		},
	} )
