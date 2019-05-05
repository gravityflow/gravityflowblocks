/* Copyright (C) 2019 Steven Henty S.L. - All Rights Reserved */

import './editor.scss'
import lock from './lock';
import check from './check';
import times from './times';
import Filters from './filters'
const { __ } = wp.i18n

const { Spinner } = wp.components


class EntryTable extends wp.element.Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { step_highlight, id_column, submitter_column, step_column, actions_column, last_updated, due_date, className, form_ids, fields, entry_data, live_data, column_order, display_filters } = this.props

		if ( entry_data === undefined || entry_data.rows === undefined ) {
			return (
				<p className={ className }>
					<Spinner/>
					{ __( 'Loading', 'gravityflow' ) }
				</p>
			)
		}
		const columnMappings = {
			id: { enabled: id_column, title: __( 'ID', 'gravityflow' ) },
			actions: { enabled: actions_column, title: '' },
			form_title: { enabled: form_ids.length === 0 || form_ids.length > 1, title: __( 'Form', 'gravityflow' ) },
			created_by: { enabled: submitter_column, title: __( 'Submitter', 'gravityflow' ) },
			workflow_step: { enabled: step_column, title: __( 'Step', 'gravityflow' ) },
			workflow_final_status: { enabled: true, title: __( 'Status', 'gravityflow' ) },
			date_created: { enabled: true, title: __( 'Submitted', 'gravityflow' ) },
			fields: fields,
			last_updated: { enabled: last_updated, title: __( 'Last Updated', 'gravityflow' ) },
			due_date: { enabled: due_date, title: __( 'Due date', 'gravityflow' ) }
		};

		const orderedColumns = [];
		column_order.forEach(function(key) {
			orderedColumns[key] = columnMappings[key];
		});
		let columns = [];
		Object.keys( orderedColumns ).map(function( key ){
			if ( key === 'fields' ) {
				fields.map( function ( field ) {
					columns.push( { key: field.value, title: field.label } );
				} )
			} else if ( orderedColumns[key].enabled ) {
				columns.push( { key: key, title: orderedColumns[key].title } );
			}
		} );


		if ( !live_data ) {
			let row = {};
			columns.forEach( function ( column, i ) {
				row[column.key] = (
					<div style={ { width: 'auto', backgroundColor: '#eee', height: '10px' } }>&nbsp;</div>
				)
			} );
			entry_data.rows = [...Array( 10 )].map( ( _, i ) => {
					let newRow = {};
					Object.assign( newRow, row );
					newRow.id = i + 1;
					if ( i === 0 ) {
						newRow.step_highlight = 'red'
					}
					return newRow
				}
			);
		}

		return (
			<div>
				{ display_filters && <Filters forms_count={ form_ids.length }/> }
				<table className={ 'gravityflow-entry-table' }>
					<thead>
					<tr>
						{ columns.map( column => {
							const key = column.key
							return (
								<th key={ key }>
									{ column.title }
								</th>
							)
						} )
						}
					</tr>
					</thead>

					<tbody>
					{ entry_data.rows.map( row => {
						const highlightColor = step_highlight ? row.step_highlight : '';
						return (
							<tr key={ row.id } style={ { borderColor: highlightColor } }>
								{ columns.map( column => {
									const key = column.key;
									const val = key === 'actions' ?
										<div className={ 'gravityflow-actions' }>{ lock } { check } { times }</div> : row[key];
									return (
										<td key={ key }>
											{ val }
										</td>
									)
								} )
								}

							</tr>
						)
					} ) }

					</tbody>
				</table>
			</div>
		)
	}
}


export default EntryTable;