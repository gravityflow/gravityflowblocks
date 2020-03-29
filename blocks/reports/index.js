/* Copyright (C) 2019 Steven Henty S.L. - All Rights Reserved */

import icon from './icon'
import './editor.scss'
import Edit from './edit'
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;


registerBlockType(
    'gravityflow/reports',
    {
        title: __( 'Workflow Reports', 'gravityflow' ),
        description: __( 'Displays the workflow reports.', 'gravityflow' ),
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
            range: {
                type: 'string',
                source: 'meta',
                meta: '_gravityflow_reports_range',
                default: '',
            },
            selectedForm: {
                type: 'string',
                source: 'meta',
                meta: '_gravityflow_reports_form',
                default: '',
            },
            category: {
                type: 'string',
                source: 'meta',
                meta: '_gravityflow_reports_category',
                default: '',
            },
            step: {
                type: 'string',
                source: 'meta',
                meta: '_gravityflow_reports_step',
                default: '',
            },
            assignee: {
                type: 'string',
                source: 'meta',
                meta: '_gravityflow_reports_assignee',
                default: '',
            }
        },
        edit: Edit,
        save: () => null,
    } );
