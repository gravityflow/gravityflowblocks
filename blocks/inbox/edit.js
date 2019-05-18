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
		this.getInboxEntries( this.props.selectedForms, this.props.selectedFields );
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.selectedForms !== this.props.selectedForms || prevProps.selectedFields !== this.props.selectedFields ) {
			this.getInboxEntries( this.props.selectedForms.map( item => item.value ), this.props.selectedFields.map( item => item.value ) );
		}
	}

	getInboxEntries( formIds, fields ) {
		apiFetch( {
			path: addQueryArgs(
				'/gf/v2/inbox-entries/',
				{ 'form-ids': formIds, fields: fields, 'last-updated': true, 'due-date': true, 'actions-column': true }
			),
		} )
			.then( ( entryData ) => {
				this.props.setState( { entryData, loaded: true } );
			} )
			.catch( () => {
				this.props.setState( { entryData: [], loaded: true } );
			} );
	}

	render() {

		let { attributes: { stepHighlight, idColumn, submitterColumn, stepColumn, actionsColumn, lastUpdated, dueDate, selectedFormsJson, selectedFieldsJson, timeline, stepStatus, workflowInfo, sidebar, backLink, backLinkText, backLinkUrl }, setAttributes, setState, currentView, liveData, entryData } = this.props

		const selectedFields = !selectedFieldsJson ? [] : JSON.parse( selectedFieldsJson );
		const selectedForms = !selectedFormsJson ? [] : JSON.parse( selectedFormsJson );
		const isDetail = currentView === 'detail';

		const columnOrder = [
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
							onClick={ () => setState( { currentView: 'list' } ) }
							style={ { zIndex: 0 } }
							isPrimary={ !isDetail }>{ __( 'List', 'gravityflow' ) }</Button>
						<Button
							className={ 'view-toggle-button' }
							isDefault
							onClick={ () => setState( { currentView: 'detail' } ) }
							style={ { zIndex: 0 } }
							isPrimary={ isDetail }>Detail</Button>
					</ButtonGroup>
					{ !isDetail &&
					<PanelRow>
						<ToggleControl
							label={ __( 'Preview Live Data', 'gravityflow' ) }
							checked={ liveData }
							onChange={ () => {
								this.getInboxEntries( selectedForms.map( item => item.value ), selectedFields.map( item => item.value ) );
								setState( { liveData: !liveData } );
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
								checked={ stepHighlight }
								onChange={ () => setAttributes( { stepHighlight: !stepHighlight } ) }
							/>
							<ToggleControl
								label={ __( 'Entry ID', 'gravityflow' ) }
								checked={ idColumn }
								onChange={ () => setAttributes( { idColumn: !idColumn } ) }
							/>
							<ToggleControl
								label={ __( 'Approval Actions', 'gravityflow' ) }
								checked={ actionsColumn }
								onChange={ () => setAttributes( { actionsColumn: !actionsColumn } ) }
							/>
							<ToggleControl
								label={ __( 'Submitter', 'gravityflow' ) }
								checked={ submitterColumn }
								onChange={ () => setAttributes( { submitterColumn: !submitterColumn } ) }
							/>
							<ToggleControl
								label={ __( 'Step', 'gravityflow' ) }
								checked={ stepColumn }
								onChange={ () => setAttributes( { stepColumn: !stepColumn } ) }
							/>
							<ToggleControl
								label={ __( 'Last updated', 'gravityflow' ) }
								checked={ lastUpdated }
								onChange={ () => setAttributes( { lastUpdated: !lastUpdated } ) }
							/>
							<ToggleControl
								label={ __( 'Due Date', 'gravityflow' ) }
								checked={ dueDate }
								onChange={ () => setAttributes( { dueDate: !dueDate } ) }
							/>
							<FormSelect
								selectedForms={ selectedForms }
								selectedFields={ selectedFields }
								onFormsChange={ ( selectedForms ) => {
									setAttributes( { selectedFormsJson: JSON.stringify( selectedForms ), selectedFieldsJson: '' } );
									let ids = selectedForms.map( ( item ) =>  item.value );
									this.getInboxEntries( ids, [] );
								}}
								onFieldsChange={ ( selectedFields ) => {
									setAttributes( { selectedFieldsJson: JSON.stringify(selectedFields) } );
									let fieldIds = selectedFields.map( ( item ) => item.value );
									this.getInboxEntries( selectedForms.map( item => item.value ), fieldIds );
								}
								}
							/>
						</PanelBody>
					</div>
				)
				}
			</InspectorControls>,
			(!isDetail &&
				<EntryTable key={ 'gravityflow-inbox' } stepHighlight={ stepHighlight } idColumn={ idColumn }
				            submitterColumn={ submitterColumn } stepColumn={ stepColumn }
				            actionsColumn={ actionsColumn } lastUpdated={ lastUpdated } dueDate={ dueDate }
				            selectedForms={ selectedForms } selectedFields={ selectedFields } liveData={ liveData } entryData={ entryData } columnOrder={ columnOrder }/>
			),
			(isDetail &&
				<DetailPage key={ 'gravityflow-detail' } timeline={ timeline } stepStatus={ stepStatus } workflowInfo={ workflowInfo }
				            sidebar={ sidebar } backLink={ backLink } backLinkText={ backLinkText }
				            backLinkUrl={ backLinkUrl } setAttributes={ setAttributes }/>)
		]
	}
}

export default withState(
	{
		entryData: {
			rows: [],
			columns: []
		},

		liveData: false,
		currentView: 'list',

	}
)( Edit );