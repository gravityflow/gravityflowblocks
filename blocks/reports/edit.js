import FormSelect from '../components/form-select';

const { __ } = wp.i18n

const { InspectorControls } = wp.editor
const {
    PanelBody,
    FormToggle,
    ToggleControl,
    Button, ButtonGroup,
} = wp.components

class Edit extends wp.element.Component {
    constructor() {
        super(...arguments);
    }

    componentWillUnmount() {
        // Hack to remove post meta when the block is removed.
        // @todo remove when this is handled correctly in the editor - https://github.com/WordPress/gutenberg/issues/5626
        wp.data.dispatch( 'core/editor' ).editPost( { meta:{_gravityflow_reports_fields_json:'', _gravityflow_reports_forms_json:''} } );
    }

    render() {
        return '<div></div>';
    }
}

export default Edit;