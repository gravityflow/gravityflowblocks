import FormSelect from './form-select';
import { Fragment } from 'react';

const { __ } = wp.i18n

const { SelectControl } = wp.components

class ReportsFilter extends wp.element.Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		let { name, range, onRangeChange, selectedFormJson, onFormsChange, category, onCategoryChange, assignee, assignees, onAssigneeChange, step_id, steps, onStepChange } = this.props

		const selectedForms = !selectedFormJson ? [] : JSON.parse( selectedFormJson );

		return [
			<Fragment key={ name }>
				<SelectControl
					label={ __( 'Range', 'gravityflowblocks' ) }
					value={ range }
					onChange={ ( range ) => {
						onRangeChange( range );
					} }
					options={ [
						{ value: 'last-12-months', label: __( 'Last 12 months', 'gravityflowblocks' ) },
						{ value: 'last-6-months', label: __( 'Last 6 months', 'gravityflowblocks' ) },
						{ value: 'last-3-months', label: __( 'Last 3 months', 'gravityflowblocks' ) },
					] }
				/>
				<FormSelect
					isMulti={ false }
					selectedForms={ selectedForms }
					onFormsChange={ ( selectedForms ) => {
						onFormsChange( selectedForms );
					} }
				/>
				{
					selectedForms.value !== '' && (
						<SelectControl
							label={ __( 'Category', 'gravityflowblocks' ) }
							value={ category }
							onChange={ ( category ) => {
								onCategoryChange( category );
							} }
							options={ [
								{ value: 'month', label: __( 'Month', 'gravityflowblocks' ) },
								{ value: 'assignee', label: __( 'Assignee', 'gravityflowblocks' ) },
								{ value: 'step', label: __( 'Step', 'gravityflowblocks' ) },
							] }
						/>
					)
				}
				{
					category === 'step' && (
						<SelectControl
							label={ __( 'Step', 'gravityflowblocks' ) }
							value={ step_id }
							onChange={ ( step_id ) => {
								onStepChange( step_id );
							} }
							options={ steps }
						/>
					)
				}
				{
					assignees && (
						<SelectControl
							label={ __( 'Assignee', 'gravityflowblocks' ) }
							value={ assignee }
							onChange={ ( assignee ) => {
								onAssigneeChange( assignee );
							} }
							options={ assignees }
						/>
					)
				}
			</Fragment>
		];
	}
}

export default ReportsFilter;