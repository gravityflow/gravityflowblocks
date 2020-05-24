import ReportsFilter from '../components/reports-filter';
import DummyFilters from './dummy-filters';

const { __ } = wp.i18n

const { InspectorControls } = wp.editor
const { apiFetch } = wp
const { addQueryArgs } = wp.url;
const { withState } = wp.compose;
const {
	PanelBody,
	ToggleControl,
	Spinner
} = wp.components

class Edit extends wp.element.Component {
	constructor() {
		super( ...arguments );
	}

	componentDidMount() {
		this.getSteps();
		this.getReports();
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.attributes.range !== this.props.attributes.range || prevProps.attributes.selectedFormJson !== this.props.attributes.selectedFormJson || prevProps.attributes.category !== this.props.attributes.category || prevProps.attributes.stepId !== this.props.attributes.stepId || prevProps.attributes.assignee !== this.props.attributes.assignee ) {
			this.getReports( this.props );
		}
	}

	getSelectedForm() {
		const selectedFormJson = this.props.attributes.selectedFormJson;

		if ( !selectedFormJson ) {
			return '';
		}

		const selectedForm = JSON.parse( selectedFormJson );

		return selectedForm.value;
	}

	getSteps( formId ) {
		if ( formId === undefined ) {
			formId = this.getSelectedForm();
		}
		let options = [{ label: __( 'All Steps', 'gravityflow' ), value: '' }];
		let assignees = [];

		if ( formId === '' ) {
			return;
		}

		apiFetch( { path: 'gf/v2/workflow/forms/' + formId + '/steps' } ).then( ( _steps ) => {
			Object.keys( _steps ).forEach( function ( key, i ) {
				options.push( {
					label: _steps[key].name,
					value: _steps[key].id
				} );

				assignees[_steps[key].id] = [{ label: __( 'All Assignees', 'gravityflow' ), value: '' }];
				if ( _steps[key].assignees.length ) {
					_steps[key].assignees.forEach( function ( k, j ) {
						assignees[_steps[key].id].push( {
							label: k.name,
							value: k.key
						} );
					} )
				}
			} );

			this.props.setState( { steps: options, assignees: assignees } );
		} );
	}

	getReports( props ) {
		const formId = this.getSelectedForm();

		if ( typeof props === 'undefined' ) {
			props = this.props;
		}

		// Reset reports to get the spinner.
		this.props.setState( { reports: {} } );

		apiFetch(
			{
				path: addQueryArgs(
					'/gf/v2/workflow/reports/',
					{
						'form': formId,
						'range': props.attributes.range === '' ? 'last-12-months' : props.attributes.range,
						'category': props.attributes.category,
						'step-id': props.attributes.stepId,
						'assignee': props.attributes.assignee
					}
				)
			}
		).then( reports => {
				this.props.setState( { reports: reports } );

				if ( reports.hasOwnProperty( 'table' ) ) {
					var data = google.visualization.arrayToDataTable( JSON.parse( reports.table ) );

					var options = JSON.parse( reports.options );

					var chartType = 'Bar';

					var chart = new google.charts[chartType]( document.querySelector( '[data-block="' + this.props.clientId + '"] .gravityflow_chart' ) );

					chart.draw( data, options );
				}
			}
		);
	}

	render() {
		let { attributes: { range, selectedFormJson, category, stepId, assignee, displayFilter }, steps, assignees, reports, setAttributes } = this.props

		const Filter = ( props ) => {
			return (
				<ReportsFilter
					name={ props.name }
					range={ range }
					onRangeChange={ ( range ) => {
						setAttributes( { range: range } );
					} }
					selectedFormJson={ selectedFormJson }
					onFormsChange={ ( selectedForms ) => {
						setAttributes( {
							selectedFormJson: JSON.stringify( selectedForms ),
							category: '',
							stepId: ''
						} );
					} }
					category={ category }
					onCategoryChange={ ( category ) => {
						setAttributes( { category: category, stepId: '', assignee: '' } );
						if ( category === 'step' ) {
							this.getSteps( this.getSelectedForm() );
						}
					} }
					stepId={ stepId }
					onStepChange={ ( stepId ) => {
						setAttributes( { stepId: stepId, assignee: '' } );
					} }
					steps={ steps }
					assignee={ assignee }
					onAssigneeChange={ ( assignee ) => {
						setAttributes( { assignee: assignee } );
					} }
					assignees={ assignees[stepId] }
				/>
			)
		};

		return [
			<InspectorControls key={ 'inbox-inspector' }>
				<PanelBody
					title={ __( 'Display Settings', 'gravityflowblocks' ) }
				>
					<ToggleControl
						label={ __( 'Display filters', 'gravityflowblocks' ) }
						checked={ displayFilter }
						onChange={ () => setAttributes( { displayFilter: !displayFilter } ) }
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Filter Settings', 'gravityflowblocks' ) }
				>
					<Filter name={ 'panel-body-filter' }/>
				</PanelBody>
			</InspectorControls>,
			displayFilter && <DummyFilters key={ 'block-content-filter' }/>,
			typeof reports !== 'string' && !reports.hasOwnProperty( 'table' ) && (
				<div key={ 'gravityflow_chart_loading' } className={ 'gravityflow_chart' }>
					<Spinner/>
					{ __( 'Loading', 'gravityflow' ) }
				</div>
			),
			reports.hasOwnProperty( 'table' ) && (
				<div key={ 'gravityflow_chart_top_level' } className={ 'gravityflow_chart' }/>
			),
			typeof reports === 'string' && (
				<div key={ 'gravityflow_chart_no_data' }
				     className={ 'gravityflow_chart' }>{ __( 'No data to display', 'gravityflowblocks' ) }</div>
			)
		];
	}
}

export default withState(
	{
		steps: [],
		assignees: [],
		reports: {}
	}
)( Edit );