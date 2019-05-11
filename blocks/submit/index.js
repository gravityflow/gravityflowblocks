/* Copyright (C) 2019 Steven Henty S.L. - All Rights Reserved */

import icon from './icon'
import './editor.scss'
import './style.scss'
import Edit from './edit'

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;


registerBlockType(
	'gravityflow/submit',
	{
		title: __( 'Workflow Submit', 'gravityflow' ),
		description: __( 'Display the workflow submit view.', 'gravityflow' ),
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
			selectedFormsJson: {
				type: 'string',
				source: 'meta',
				meta: '_gravityflow_submit_forms_json',
				default: '',
			}
		},
		edit: Edit
		, // end edit
		save() {
			return (
				null
			);
		},
	} )
