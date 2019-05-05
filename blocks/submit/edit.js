/* Copyright (C) 2019 Steven Henty S.L. - All Rights Reserved */

import FormSelect from '../components/form-select';

const { __ } = wp.i18n

const { InspectorControls } = wp.editor
import '../store'
const { withSelect } = wp.data

class Edit extends wp.element.Component {
	constructor() {
		super( ...arguments );
	}

	componentWillUnmount() {
		// Hack to remove post meta when the block is removed.
		// @todo remove when this is handled correctly in the editor - https://github.com/WordPress/gutenberg/issues/5626
		wp.data.dispatch( 'core/editor' ).editPost( { meta:{_gravityflow_submit_forms_json:''} } );
	}

	render() {
		let { attributes: { selected_forms_json }, forms, setAttributes } = this.props;

		const form_ids = !selected_forms_json ? [] : JSON.parse( selected_forms_json );

		let displayForms = [];
		if ( form_ids.length === 0 ) {
			Object.keys( forms ).forEach( function ( key, i ) {
				displayForms.push( {
					label: forms[key].title,
					value: forms[key].id,
				} );
			} );
		} else {
			displayForms = form_ids;
		}

		const formsList = displayForms.map( (form ) => {
			return <div>{form.label}</div>
		} );

		return [
			<InspectorControls key={ 'inbox-inspector' }>
				<FormSelect
					form_ids={ form_ids }
					onFormsChange={ ( form_ids ) => {
						setAttributes( { selected_forms_json: JSON.stringify( form_ids ) } );
					}
					}
				/>
			</InspectorControls>,
			<div>
			{formsList}
			</div>
		]
	}
};

export default withSelect( ( select ) => {
	return {
		forms: select( 'gravityflow/inbox' ).receiveForms(),
	}
} )( Edit );