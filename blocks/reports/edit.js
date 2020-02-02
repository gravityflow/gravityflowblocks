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
        super(...arguments);
    }

    render() {

    }
}

export default withState(
    { currentView: 'list' }
)( Edit );