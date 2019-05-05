/* Copyright (C) 2019 Steven Henty S.L. - All Rights Reserved */

import './editor.scss'

const { __ } = wp.i18n;

class Filters extends wp.element.Component {
	constructor() {
		super( ...arguments );
	}

	render() {

		const { forms_count } = this.props;

		return (
			<div className="gravityflow-filters">
				<div className="gravityflow-id-input">{ __( 'ID', 'gravityflow' ) }</div>
				{ __( 'Start:', 'gravityflow' ) }
				<div className="gravityflow-date-input">{ __( 'yyyy-mm-dd', 'gravityflow' ) }</div>
				 { __( 'End:', 'gravityflow' ) }<div className="gravityflow-date-input">{ __( 'yyyy-mm-dd', 'gravityflow' ) }</div>

				{ forms_count !== 1 &&
				<div className="gravityflow-filter-select">
					{ __( 'Select a Workflow Form', 'gravityflow' ) }
				</div>
				}
				{ forms_count === 1 &&
				<div className="gravityflow-filter-select">
					{ __( 'Select a field', 'gravityflow' ) }
				</div>
				}
				<div className="gravityflow-filter-button">
					{ __( 'Apply', 'gravityflow' ) }
				</div>
			</div>
		)
	}
}


export default Filters;