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
        wp.data.dispatch('core/editor').editPost({meta: {_gravityflow_reports_form: ''}});
    }

    getSteps() {
        const selectedForm = JSON.parse(this.props.attributes.selectedForm);
        const formId = selectedForm.value;
        let options = [{label: __('All Steps', 'gravityflow'), value: ''}];

        apiFetch({path: 'gf/v2/workflow/forms/' + formId + '/steps'}).then((_steps) => {
            Object.keys(_steps).forEach(function (key, i) {
                options.push({
                    label: _steps[key].name,
                    value: _steps[key].id
                });
            });

            this.props.setState({steps: options});
        });
    }

    render() {
        let {attributes: {range, selectedForm, category, step}, steps, setAttributes, setState} = this.props

        const selectedForms = !selectedForm ? [] : JSON.parse(selectedForm);

        this.getSteps()

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
                            setAttributes({selectedForm: JSON.stringify(selectedForms), category: '', step: ''});
                        }}
                    />
                    {
                        selectedForm && (
                            <SelectControl
                                label={__('Category', 'gravityflowblocks')}
                                value={category}
                                onChange={(category) => {
                                    setAttributes({category: category, step: ''});
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
                                    setAttributes({step: step});
                                }}
                                options={steps}
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
        steps: {}
    }
)(Edit);