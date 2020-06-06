const { Button } = wp.components
const { __ } = wp.i18n;
import {Fragment} from "react";

class DummyFilters extends wp.element.Component {
    constructor() {
        super( ...arguments );
    }

    render() {

        return (
            <Fragment>
                <select disabled key='range'>
                    <option>{ __( 'Last 12 month', 'gravityflowblocks' ) }</option>
                </select>
                <select disabled key='form'>
                    <option>{ __( 'Select A Workflow Form', 'gravityflowblocks' ) }</option>
                </select>
                <Button disabled key='filter' isSecondary>Filter</Button>
            </Fragment>
        )
    }
}

export default DummyFilters;