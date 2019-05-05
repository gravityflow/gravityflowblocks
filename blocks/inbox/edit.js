/* Copyright (C) 2019 Steven Henty S.L. - All Rights Reserved */

import FormSelect from '../components/form-select';
import DetailPage from '../components/detail-page';
import EntryTable from '../components/entry-table';
const { apiFetch } = wp;
const { addQueryArgs } = wp.url;
const { __ } = wp.i18n;
const { withState } = wp.compose;
const { InspectorControls } = wp.editor;
const {
	PanelBody,
	PanelRow,
	ToggleControl,
	Button, ButtonGroup,
} = wp.components;

class Edit extends wp.element.Component {
	constructor() {
		super( ...arguments );
	}

	componentWillUnmount() {
		// Hack to remove post meta when the block is removed.
		// @todo remove when this is handled correctly in the editor
		wp.data.dispatch( 'core/editor' ).editPost( { meta:{_gravityflow_inbox_forms_json:'', _gravityflow_inbox_fields_json:''} } );
	}

	componentDidMount() {
		this.getInboxEntries( this.props.form_ids, this.props.fields );
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.form_ids != this.props.form_ids || prevProps.fields != this.props.fields ) {
			this.getInboxEntries( this.props.form_ids.map( item => item.value ), this.props.fields.map( item => item.value ) );
		}
	}

	getInboxEntries( form_ids, fields ) {
		apiFetch( {
			path: addQueryArgs(
				'/gf/v2/inbox-entries/',
				{ 'form-ids': form_ids, fields: fields, 'last-updated': true, 'due-date': true, 'actions-column': true }
			),
		} )
			.then( ( entry_data ) => {
				this.props.setState( { entry_data, loaded: true } );
			} )
			.catch( () => {
				this.props.setState( { entry_data: [], loaded: true } );
			} );
	}

	render() {

		let { attributes: { step_highlight, id_column, submitter_column, step_column, actions_column, last_updated, due_date, selected_forms_json, selected_fields_json, timeline, step_status, workflow_info, sidebar, back_link, back_link_text, back_link_url }, setAttributes, setState, current_view, live_data, entry_data } = this.props

		const fields = !selected_fields_json ? [] : JSON.parse( selected_fields_json );
		const form_ids = !selected_forms_json ? [] : JSON.parse( selected_forms_json );
		const isDetail = current_view === 'detail';

		const column_order = [
			'id', 'actions', 'form_title', 'created_by', 'workflow_step', 'date_created', 'fields', 'last_updated', 'due_date'
		];

		return [

			<InspectorControls key={ 'inbox-inspector' }>
				<PanelBody
					title={ __( 'View', 'gravityflow' ) }
				>
					<ButtonGroup>
						<Button
							className={ 'view-toggle-button' }
							isDefault
							onClick={ () => setState( { current_view: 'list' } ) }
							style={ { zIndex: 0 } }
							isPrimary={ !isDetail }>{ __( 'List', 'gravityflow' ) }</Button>
						<Button
							className={ 'view-toggle-button' }
							isDefault
							onClick={ () => setState( { current_view: 'detail' } ) }
							style={ { zIndex: 0 } }
							isPrimary={ isDetail }>Detail</Button>
					</ButtonGroup>
					{ !isDetail &&
					<PanelRow>
						<ToggleControl
							label={ __( 'Preview Live Data', 'gravityflow' ) }
							checked={ live_data }
							onChange={ () => {
								this.getInboxEntries( form_ids.map( item => item.value ), fields.map( item => item.value ) );
								setState( { live_data: !live_data } );
							} }
						/>
					</PanelRow>
					}

				</PanelBody>
				{ !isDetail && (
					<div>
						<PanelBody
							title={ __( 'Display Settings', 'gravityflow' ) }
						>
							<ToggleControl
								label={ __( 'Highlight', 'gravityflow' ) }
								checked={ step_highlight }
								onChange={ () => setAttributes( { step_highlight: !step_highlight } ) }
							/>
							<ToggleControl
								label={ __( 'Entry ID', 'gravityflow' ) }
								checked={ id_column }
								onChange={ () => setAttributes( { id_column: !id_column } ) }
							/>
							<ToggleControl
								label={ __( 'Approval Actions', 'gravityflow' ) }
								checked={ actions_column }
								onChange={ () => setAttributes( { actions_column: !actions_column } ) }
							/>
							<ToggleControl
								label={ __( 'Submitter', 'gravityflow' ) }
								checked={ submitter_column }
								onChange={ () => setAttributes( { submitter_column: !submitter_column } ) }
							/>
							<ToggleControl
								label={ __( 'Step', 'gravityflow' ) }
								checked={ step_column }
								onChange={ () => setAttributes( { step_column: !step_column } ) }
							/>
							<ToggleControl
								label={ __( 'Last updated', 'gravityflow' ) }
								checked={ last_updated }
								onChange={ () => setAttributes( { last_updated: !last_updated } ) }
							/>
							<ToggleControl
								label={ __( 'Due Date', 'gravityflow' ) }
								checked={ due_date }
								onChange={ () => setAttributes( { due_date: !due_date } ) }
							/>

							<FormSelect
								form_ids={ form_ids }
								fields={ fields }
								onFormsChange={ ( form_ids ) => {
									setAttributes( { selected_forms_json: JSON.stringify( form_ids ), fields: '' } );
									let ids = form_ids.map( ( item ) =>  item.value );
									this.getInboxEntries( ids, [] );
								}}
								onFieldsChange={ ( fields ) => {
									setAttributes( { selected_fields_json: JSON.stringify(fields) } );
									let field_ids = fields.map( ( item ) => item.value );
									this.getInboxEntries( form_ids, field_ids );
								}
								}
							/>
						</PanelBody>
					</div>
				)
				}
			</InspectorControls>,
			(!isDetail &&
				<EntryTable key={ 'gravityflow-inbox' } step_highlight={ step_highlight } id_column={ id_column }
				            submitter_column={ submitter_column } step_column={ step_column }
				            actions_column={ actions_column } last_updated={ last_updated } due_date={ due_date }
				            form_ids={ form_ids } fields={ fields } live_data={ live_data } entry_data={ entry_data } column_order={ column_order }/>
			),
			(isDetail &&
				<DetailPage key={ 'gravityflow-detail' } timeline={ timeline } step_status={ step_status } workflow_info={ workflow_info }
				            sidebar={ sidebar } back_link={ back_link } back_link_text={ back_link_text }
				            back_link_url={ back_link_url } setAttributes={ setAttributes }/>)
		]
	}
}

export default withState(
	{
		entry_data: {
			rows: [],
			columns: []
		},

		live_data: false,
		current_view: 'list',

	}
)( Edit );