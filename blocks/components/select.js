/* Copyright (C) 2019 Steven Henty S.L. - All Rights Reserved */

import ReactSelect from 'react-select';
const {BaseControl} = wp.components;

const { withState } = wp.compose;


class Select extends wp.element.Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { isMulti, setState, options, value, label, id, help, className, onChange } = this.props;

		const handleChange = ( selectedValues ) => {
			setState( { value: selectedValues } );
			onChange( selectedValues );
		};

		return (
			<BaseControl label={ label } id={ id } help={ help } className={ className }>
				<ReactSelect
					isMulti={ isMulti }
					value={ value }
					onChange={ handleChange }
					menuPlacement={ 'auto' }
					options={ options }
					styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
					menuPortalTarget={document.body}
				/>
			</BaseControl>
		)
	}
}

export default withState()( Select );

