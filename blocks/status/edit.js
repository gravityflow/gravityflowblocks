import FormSelect from '../components/form-select';
import DetailPage from '../components/detail-page';
import EntryTable from '../components/entry-table';

const { __ } = wp.i18n

const { InspectorControls } = wp.editor
const {
	PanelBody,
	FormToggle,
	ToggleControl,
	Button, ButtonGroup,
} = wp.components


const { withState } = wp.compose;

class Edit extends wp.element.Component {
	constructor() {
		super( ...arguments );
	}

	componentWillUnmount() {
		// Hack to remove post meta when the block is removed.
		// @todo remove when this is handled correctly in the editor - https://github.com/WordPress/gutenberg/issues/5626
		wp.data.dispatch( 'core/editor' ).editPost( { meta:{_gravityflow_status_fields_json:'', _gravityflow_status_forms_json:''} } );
	}

	render() {
		let { attributes: { idColumn, submitterColumn, stepColumn, lastUpdated, dueDate, selectedFormsJson, selectedFieldsJson, timeline, stepStatus, workflowInfo, sidebar, backLink, backLinkText, backLinkUrl, displayAll, allowAnonymous }, setAttributes, setState, currentView, liveData } = this.props

		const selectedFields = !selectedFieldsJson ? [] : JSON.parse( selectedFieldsJson );
		const selectedForms = !selectedFormsJson ? [] : JSON.parse( selectedFormsJson );
		const isDetail = currentView === 'detail';

		const columnOrder = [
			'id', 'date_created', 'form_title', 'created_by', 'workflow_step', 'workflow_final_status', 'fields', 'last_updated', 'due_date'
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

				</PanelBody>
				{ !isDetail && (
					<div>

						<PanelBody
							title={ __( 'Display Settings', 'gravityflow' ) }
						>
							<ToggleControl
								label={ __( 'Entry ID', 'gravityflow' ) }
								checked={ idColumn }
								onChange={ () => setAttributes( { idColumn: !idColumn } ) }
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

						</PanelBody>
						<FormSelect
							selectedForms={ selectedForms }
							selectedFields={ selectedFields }
							onFormsChange={ ( selectedForms ) => {
								setAttributes( { selectedFormsJson: JSON.stringify( selectedForms ), selectedFieldsJson: '' } );
							}}
							onFieldsChange={ ( selectedFields ) => {
								setAttributes( { selectedFieldsJson: JSON.stringify( selectedFields ) } );
							}
							}
						/>
						<PanelBody
							title={ __( 'Danger Zone', 'gravityflow' ) }
							initialOpen={ false }
						>
							<ToggleControl
								label={ __( 'Display All Entries', 'gravityflow' ) }
								checked={ displayAll }
								onChange={ () => setAttributes( { displayAll: !displayAll } ) }
								help={ __( "Displays all entries to all logged in users regardless of their permissions.", 'gravityflow' ) }
							/>
							{ displayAll && <ToggleControl
								label={ __( 'Make all entries public', 'gravityflow' ) }
								checked={ allowAnonymous }
								onChange={ () => setAttributes( { allowAnonymous: !allowAnonymous } ) }
								help={ __( 'Displays all entries to all site visitors, including anonymous. This will also allow search engines to index the entries.', 'gravityflow' ) }
							/>}
						</PanelBody>
					</div>
				) }
			</InspectorControls>,
			(!isDetail &&
				<EntryTable key={ 'gravityflow-status' } idColumn={ idColumn }
				            submitterColumn={ submitterColumn } stepColumn={ stepColumn }
				            lastUpdated={ lastUpdated } dueDate={ dueDate }
				            selectedForms={ selectedForms } selectedFields={ selectedFields } liveData={ liveData } entryData={ { rows: [] } } columnOrder={ columnOrder } displayFilters={ true }/>
			),
			(isDetail &&
				<DetailPage key={ 'gravityflow-detail' } timeline={ timeline } stepStatus={ stepStatus } workflowInfo={ workflowInfo }
				            sidebar={ sidebar } backLink={ backLink } backLinkText={ backLinkText }
				            backLinkUrl={ backLinkUrl } setAttributes={ setAttributes }/>)
		]
	}
}

export default withState(
	{ currentView: 'list' }
)( Edit );
