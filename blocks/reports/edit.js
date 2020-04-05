import FormSelect from '../components/form-select';

const {__} = wp.i18n

const {InspectorControls} = wp.editor
const {apiFetch} = wp
const {addQueryArgs} = wp.url;
const {withState} = wp.compose;
const {
    PanelBody,
    FormToggle,
    ToggleControl,
    Button,
    ButtonGroup,
    SelectControl
} = wp.components

class Edit extends wp.element.Component {
    constructor() {
        super(...arguments);
    }

    componentWillUnmount() {
        // Hack to remove post meta when the block is removed.
        // @todo remove when this is handled correctly in the editor - https://github.com/WordPress/gutenberg/issues/5626
        wp.data.dispatch('core/editor').editPost({
            meta: {
                _gravityflow_reports_form_json: '',
                _gravityflow_reports_range: '',
                _gravityflow_reports_category: '',
                _gravityflow_reports_step: '',
                _gravityflow_reports_assignee: ''
            }
        });
    }

    componentDidMount() {
        this.getSteps();
        this.getReports();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.attributes.range !== this.props.attributes.range || prevProps.attributes.selectedFormJson !== this.props.attributes.selectedFormJson || prevProps.attributes.category !== this.props.attributes.category || prevProps.attributes.step !== this.props.attributes.step || prevProps.attributes.assignee !== this.props.attributes.assignee) {
            this.getReports(this.props);
        }
    }

    getSelectedForm() {
        const selectedFormJson = this.props.attributes.selectedFormJson;

        if (!selectedFormJson) {
            return;
        }

        const selectedForm = JSON.parse(selectedFormJson);

        return selectedForm.value;
    }

    getSteps() {
        const formId = this.getSelectedForm();
        let options = [{label: __('All Steps', 'gravityflow'), value: ''}];
        let assignees = [];

        apiFetch({path: 'gf/v2/workflow/forms/' + formId + '/steps'}).then((_steps) => {
            Object.keys(_steps).forEach(function (key, i) {
                options.push({
                    label: _steps[key].name,
                    value: _steps[key].id
                });

                assignees[_steps[key].id] = [{label: __('All Assignees', 'gravityflow'), value: ''}];
                if (_steps[key].assignees.length) {
                    _steps[key].assignees.forEach(function (k, j) {
                        assignees[_steps[key].id].push({
                            label: k.name,
                            value: k.key
                        });
                    })
                }
            });

            this.props.setState({steps: options, assignees: assignees});
        });
    }

    getReports(props) {
        const formId = this.getSelectedForm();

        if (typeof props === 'undefined') {
            props = this.props;
        }

        apiFetch(
            {
                path: addQueryArgs(
                    '/gf/v2/workflow/reports/',
                    {
                        'form': formId,
                        'range': props.attributes.range === '' ? 'last-12-months' : props.attributes.range,
                        'category': props.attributes.category,
                        'step_id': props.attributes.step,
                        'assignee': props.attributes.assignee
                    }
                )
            }
        ).then(reports => {
            this.props.setState({reports: reports});

            var data = google.visualization.arrayToDataTable(JSON.parse(reports.table));

            var options = JSON.parse(reports.options);

            var chartType = 'Bar';

            var chart = new google.charts[chartType]( document.getElementsByClassName('gravityflow_chart')[0] );

            chart.draw(data, options);
        });
    }

    render() {
        let {attributes: {range, selectedFormJson, category, step, assignee}, steps, assignees, reports, setAttributes, setState} = this.props

        const selectedForms = !selectedFormJson ? [] : JSON.parse(selectedFormJson);

        return [
            <InspectorControls key={'inbox-inspector'}>
                <PanelBody
                    title={__('Filter Settings', 'gravityflowblocks')}
                >
                    <SelectControl
                        label={__('Range', 'gravityflowblocks')}
                        value={range}
                        onChange={(range) => {
                            setAttributes({range: range});
                        }}
                        options={[
                            {value: 'last-12-months', label: __('Last 12 months', 'gravityflowblocks')},
                            {value: 'last-6-months', label: __('Last 6 months', 'gravityflowblocks')},
                            {value: 'last-3-months', label: __('Last 3 months', 'gravityflowblocks')},
                        ]}
                    />
                    <FormSelect
                        isMulti={false}
                        selectedForms={selectedForms}
                        onFormsChange={(selectedForms) => {
                            setAttributes({selectedFormJson: JSON.stringify(selectedForms), category: '', step: ''});
                        }}
                    />
                    {
                        selectedFormJson && (
                            <SelectControl
                                label={__('Category', 'gravityflowblocks')}
                                value={category}
                                onChange={(category) => {
                                    setAttributes({category: category, step: '', assignee: ''});
                                    if (category === 'step') {
                                        this.getSteps();
                                    }
                                }}
                                options={[
                                    {value: 'month', label: __('Month', 'gravityflowblocks')},
                                    {value: 'assignee', label: __('Assignee', 'gravityflowblocks')},
                                    {value: 'step', label: __('Step', 'gravityflowblocks')},
                                ]}
                            />
                        )
                    }
                    {
                        category === 'step' && (
                            <SelectControl
                                label={__('Step', 'gravityflowblocks')}
                                value={step}
                                onChange={(step) => {
                                    setAttributes({step: step, assignee: ''});
                                }}
                                options={steps}
                            />
                        )
                    }
                    {
                        assignees && (
                            <SelectControl
                                label={__('Assignee', 'gravityflowblocks')}
                                value={assignee}
                                onChange={(assignee) => {
                                    setAttributes({assignee: assignee});
                                }}
                                options={assignees[step]}
                            />
                        )
                    }
                </PanelBody>
            </InspectorControls>,
            reports.hasOwnProperty('table') && (
                <div key={'gravityflow_chart_top_level'} className={'gravityflow_chart'} />
            ),
            ! reports.hasOwnProperty('table') && (
                <div key={ 'gravityflow_chart_no_data' }>{__( 'No data to display', 'gravityflowblocks' )}</div>
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
)(Edit);