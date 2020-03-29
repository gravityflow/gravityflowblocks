import FormSelect from '../components/form-select';

const {__} = wp.i18n

const {InspectorControls} = wp.editor
const {apiFetch} = wp
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
        wp.data.dispatch('core/editor').editPost({meta: {_gravityflow_reports_form_json: '', _gravityflow_reports_range: '', _gravityflow_reports_category: '', _gravityflow_reports_step: '', _gravityflow_reports_assignee: ''}});
    }

    componentDidMount() {
        this.getSteps();
    }

    componentDidUpdate( prevProps ) {

    }

    getSteps() {
        const selectedFormJson = this.props.attributes.selectedFormJson;

        if (! selectedFormJson) {
            return;
        }

        const selectedForm = JSON.parse(selectedFormJson);
        const formId = selectedForm.value;
        let options = [{label: __('All Steps', 'gravityflow'), value: ''}];
        let assignees = [];

        apiFetch({path: 'gf/v2/workflow/forms/' + formId + '/steps'}).then((_steps) => {
            Object.keys(_steps).forEach(function (key, i) {
                options.push({
                    label: _steps[key].name,
                    value: _steps[key].id
                });

                assignees[_steps[key].id] = [{label: __('All Assignees', 'gravityflow'), value: ''}];
                if(_steps[key].assignees.length) {
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

    render() {
        let {attributes: {range, selectedFormJson, category, step, assignee}, steps, assignees, setAttributes, setState} = this.props

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
            <div>reports</div>
        ];
    }
}

export default withState(
    {
        steps: [],
        assignees: []
    }
)(Edit);