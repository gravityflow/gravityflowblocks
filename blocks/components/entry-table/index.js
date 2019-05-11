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
		const { stepHighlight, idColumn, submitterColumn, stepColumn, actionsColumn, lastUpdated, dueDate, className, selectedForms, selectedFields, entryData, liveData, columnOrder, displayFilters } = this.props

		if ( entryData === undefined || entryData.rows === undefined ) {
			return (
				<p className={ className }>
					<Spinner/>
					{ __( 'Loading', 'gravityflow' ) }
				</p>
			)
		}
		const columnMappings = {
			id: { enabled: idColumn, title: __( 'ID', 'gravityflow' ) },
			actions: { enabled: actionsColumn, title: '' },
			form_title: { enabled: selectedForms.length === 0 || selectedForms.length > 1, title: __( 'Form', 'gravityflow' ) },
			created_by: { enabled: submitterColumn, title: __( 'Submitter', 'gravityflow' ) },
			workflow_step: { enabled: stepColumn, title: __( 'Step', 'gravityflow' ) },
			workflow_final_status: { enabled: true, title: __( 'Status', 'gravityflow' ) },
			date_created: { enabled: true, title: __( 'Submitted', 'gravityflow' ) },
			fields: selectedFields,
			last_updated: { enabled: lastUpdated, title: __( 'Last Updated', 'gravityflow' ) },
			due_date: { enabled: dueDate, title: __( 'Due date', 'gravityflow' ) }
		};

		const orderedColumns = [];
		columnOrder.forEach(function(key) {
			orderedColumns[key] = columnMappings[key];
		});
		let columns = [];
		Object.keys( orderedColumns ).map(function( key ){
			if ( key === 'fields' ) {
				selectedFields.map( function ( field ) {
					columns.push( { key: field.value, title: field.label } );
				} )
			} else if ( orderedColumns[key].enabled ) {
				columns.push( { key: key, title: orderedColumns[key].title } );
			}
		} );


		if ( !liveData ) {
			let row = {};
			columns.forEach( function ( column, i ) {
				row[column.key] = (
					<div style={ { width: 'auto', backgroundColor: '#eee', height: '10px' } }>&nbsp;</div>
				)
			} );
			entryData.rows = [...Array( 10 )].map( ( _, i ) => {
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
				{ displayFilters && <Filters formsCount={ selectedForms.length }/> }
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
					{ entryData.rows.map( row => {
						const highlightColor = stepHighlight ? row.step_highlight : '';
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