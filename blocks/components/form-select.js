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
		const { form_ids, className, forms, fields, onFieldsChange, onFormsChange } = this.props
		if ( forms === undefined ) {
			return (
				<p className={ className }>
					<Spinner/>
					{ __( 'Loading', 'gravityflow' ) }
				</p>
			)
		}

		if ( forms === 'error' ) {
			return <p>{ __( 'You don\'t have permission to set the forms and fields', 'gravityflow' ) }</p>

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

		const form = form_ids.length === 1 ? forms[ form_ids.map( item => item.value ) ] : false
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
					isMulti
					label={ __( 'Filter Form(s)', 'gravityflow' ) }
					value={form_ids}
					onChange={onFormsChange}
					options={options}
				/>
				{
					form && fields !== undefined &&
					<Select
						isMulti
						label={ __( 'Select Fields', 'gravityflow' ) }
						value={fields}
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