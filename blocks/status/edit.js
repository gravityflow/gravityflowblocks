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
		let { attributes: { step_highlight, id_column, submitter_column, step_column, last_updated, due_date, selected_forms_json, selected_fields_json, timeline, step_status, workflow_info, sidebar, back_link, back_link_text, back_link_url, display_all, allow_anonymous }, setAttributes, setState, current_view, liveData } = this.props

		const fields = !selected_fields_json ? [] : JSON.parse( selected_fields_json );
		const form_ids = !selected_forms_json ? [] : JSON.parse( selected_forms_json );
		const isDetail = current_view === 'detail';

		const column_order = [
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

						</PanelBody>
						<FormSelect
							form_ids={ form_ids }
							fields={ fields }
							onFormsChange={ ( form_ids ) => {
								setAttributes( { selected_forms_json: JSON.stringify( form_ids ), fields: '' } );
							}}
							onFieldsChange={ ( fields ) => {
								setAttributes( { selected_fields_json: JSON.stringify( fields ) } );
							}
							}
						/>
						<PanelBody
							title={ __( 'Danger Zone', 'gravityflow' ) }
							initialOpen={ false }
						>
							<ToggleControl
								label={ __( 'Display All Entries', 'gravityflow' ) }
								checked={ display_all }
								onChange={ () => setAttributes( { display_all: !display_all } ) }
								help={ __( "Displays all entries to all logged in users regardless of their permissions.", 'gravityflow' ) }
							/>
							{ display_all && <ToggleControl
								label={ __( 'Make all entries public', 'gravityflow' ) }
								checked={ allow_anonymous }
								onChange={ () => setAttributes( { allow_anonymous: !allow_anonymous } ) }
								help={ __( 'Displays all entries to all site visitors, including anonymous. This will also allow search engines to index the entries.', 'gravityflow' ) }
							/>}
						</PanelBody>
					</div>
				) }
			</InspectorControls>,
			(!isDetail &&
				<EntryTable key={ 'gravityflow-status' } step_highlight={ step_highlight } id_column={ id_column }
				            submitter_column={ submitter_column } step_column={ step_column }
				            last_updated={ last_updated } due_date={ due_date }
				            form_ids={ form_ids } fields={ fields } liveData={ liveData } entry_data={ { rows: [] } } column_order={ column_order } display_filters={ true }/>
			),
			(isDetail &&
				<DetailPage key={ 'gravityflow-detail' } timeline={ timeline } step_status={ step_status } workflow_info={ workflow_info }
				            sidebar={ sidebar } back_link={ back_link } back_link_text={ back_link_text }
				            back_link_url={ back_link_url } setAttributes={ setAttributes }/>)
		]
	}
}

export default withState(
	{ current_view: 'list' }
)( Edit );
