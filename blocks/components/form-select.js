/* Copyright (C) 2019 Steven Henty S.L. - All Rights Reserved */

import Select from './select'
const { __ } = wp.i18n

const { Spinner } = wp.components
const { withSelect } = wp.data
import '../store'
class FormSelectView extends wp.element.Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { selectedForms, className, forms, selectedFields, onFieldsChange, onFormsChange, isMulti } = this.props;
		if ( forms === undefined ) {
			return (
				<p className={ className }>
					<Spinner/>
					{ __( 'Loading', 'gravityflow' ) }
				</p>
			)
		}

		if ( forms === 'error' ) {
			return <p>{ __( "Some settings are hidden because you don't have sufficient permissions.", 'gravityflow' ) }</p>

		}

		if ( !forms ) {
			return <p>{ __( 'No forms', 'gravityflow' ) }</p>
		}

		let options = [];

		Object.keys( forms ).forEach( function ( key, i ) {
			options.push( {
				label: forms[key].title,
				value: forms[key].id,
			} );
		} );


		let fieldOptions = [];

		const form = selectedForms.length === 1 ? forms[ selectedForms.map( item => item.value ) ] : false
		if ( form ) {
			Object.keys( form.fields ).forEach( function ( key, i ) {
				const field = form.fields[key];
				if ( field.inputs ) {

					let groupOptions = field.inputs.map( function ( item ) {
						return {
							label: item['label'],
							value: item['id'],
						};
					} );

					fieldOptions.push( {
						label: field.label,
						options: groupOptions,
					} );
				} else {

					fieldOptions.push( {
						label: field.label,
						value: field.id.toString(),
					} );

				}

			} );
		}

		return (
			<div key={ 'workflow-form-selector' }>
				<Select
					isMulti={isMulti === undefined ? true : isMulti}
					label={ __( 'Filter Forms', 'gravityflow' ) }
					value={selectedForms}
					onChange={onFormsChange}
					options={options}
				/>
				{
					form && selectedFields !== undefined &&
					<Select
						isMulti
						label={ __( 'Select Fields', 'gravityflow' ) }
						value={selectedFields}
						onChange={onFieldsChange}
						options={fieldOptions}
					/>
				}
			</div>
		)
	}
}

const FormSelect = withSelect( ( select ) => {
	return {
		forms: select( 'gravityflow/workflow' ).receiveForms(),
	}
} )( FormSelectView )

export default FormSelect;
