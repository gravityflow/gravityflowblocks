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
				meta: '_gravityflow_status_forms_json',
				default: '',
			},
			selected_fields_json: {
				type: 'string',
				source: 'meta',
				meta: '_gravityflow_status_fields_json',
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
				default: true,
			},
			back_link_text: {
				type: 'string',
				default: __( 'Back to Status List', 'gravityflow' ),
			},
			back_link_url: {
				type: 'string',
				default: '',
			},
			display_all: {
				type: 'boolean',
				source: 'meta',
				meta: '_gravityflow_status_display_all',
				default: false,
			},
			allow_anonymous: {
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
