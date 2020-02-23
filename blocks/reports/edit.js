import FormSelect from '../components/form-select';

const { __ } = wp.i18n

const { InspectorControls } = wp.editor
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
        wp.data.dispatch( 'core/editor' ).editPost( { meta:{_gravityflow_reports_form:''} } );
    }

    render() {
        let { attributes: { range, selectedForm, category }, setAttributes, setState } = this.props

        return [
            <InspectorControls key={ 'inbox-inspector' }>
                <PanelBody
                    title={ __( 'Filter Settings', 'gravityflowblocks' ) }
                >
                    <SelectControl
                        label={ __( 'Range', 'gravityflowblocks' ) }
                        value={ range }
                        onChange={ ( range ) => {
                            setAttributes( { range: range } );
                        }}
                        options={ [
                            { value: 'last-12-months', label: __( 'Last 12 months', 'gravityflowblocks' ) },
                            { value: 'last-6-months', label: __( 'Last 6 months', 'gravityflowblocks' ) },
                            { value: 'last-3-months', label: __( 'Last 3 months', 'gravityflowblocks' ) },
                        ] }
                    />
                    <FormSelect
                        isMulti={false}
                        selectedForms={ [selectedForm] }
                        onFormsChange={ ( selectedForms ) => {
                            setAttributes( { selectedForm: selectedForms.value.toString() } );
                        }}
                    />
                    {
                        selectedForm && (
                            <SelectControl
                                label={ __( 'Category', 'gravityflowblocks' ) }
                                value={ category }
                                onChange={ ( category ) => {
                                    setAttributes( { category: category } );
                                }}
                                options={ [
                                    { value: 'month', label: __( 'Month', 'gravityflowblocks' ) },
                                    { value: 'assignee', label: __( 'Assignee', 'gravityflowblocks' ) },
                                    { value: 'step', label: __( 'Step', 'gravityflowblocks' ) },
                                ] }
                            />
                        )
                    }
                </PanelBody>
            </InspectorControls>,
            <div>reports</div>
        ];
    }
}

export default Edit;