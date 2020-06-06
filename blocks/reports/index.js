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
            multiple: true,
            html: false,
            anchor: true,
        },
        attributes: {
            displayFilter: {
                type: 'boolean',
                default: false,
            },
            range: {
                type: 'string',
                default: 'last-12-months',
            },
            selectedFormJson: {
                type: 'string',
                default: '',
            },
            category: {
                type: 'string',
                default: '',
            },
            stepId: {
                type: 'string',
                default: '',
            },
            assignee: {
                type: 'string',
                default: '',
            }
        },
        edit: Edit,
        save: () => null,
    } );
