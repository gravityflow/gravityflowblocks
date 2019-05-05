/* Copyright (C) 2019 Steven Henty S.L. - All Rights Reserved */

import './editor.scss'

const { __ } = wp.i18n
const { InspectorControls } = wp.editor
const {
	PanelBody,
	PanelRow,
	ToggleControl,
	TextControl
} = wp.components

class DetailPage extends wp.element.Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { setAttributes, timeline, step_status, workflow_info, sidebar, back_link, back_link_text, back_link_url } = this.props;

		const dummyValue = <div className={ 'field-value' }/>

		const workflowInfo = (workflow_info &&
			<div  key={ 'gravityflow-workflow-details' } id={ 'gravityflow-workflow-details' }>
				<strong>{ __( 'Workflow', 'gravityflow' ) }</strong>
				<div id={ 'entry-id' }>
					{ __( 'Entry ID:', 'gravityflow' ) } { dummyValue }
				</div>
				<div id={ 'submitted' }>
					{ __( 'Submitted:', 'gravityflow' ) }{ dummyValue }
				</div>
				<div id={ 'created-by' }>
					{ __( 'Submitted by:', 'gravityflow' ) }{ dummyValue }
				</div>
				<div id={ 'status' }>
					{ __( 'Status:', 'gravityflow' ) }{ dummyValue }
				</div>
				<hr style={ { marginTop: '10px' } }/>
			</div>
		)

		const stepStatus = (step_status &&
			<div key={ 'gravityflow-step-status' } id={ 'gravityflow-step-status' }>
				<div key={ 'step-status' } id={ 'step-status' }>
					<strong>{ __( 'Step Name (Status)', 'gravityflow' ) }</strong>
				</div>
				<div key={ 'assignee-status' } id={ 'assignee-status' }>
					{ __( 'Assignee:', 'gravityflow' ) }{ dummyValue } { __( '(status)', 'gravityflow' ) }
				</div>
			</div>
		)

		const timelineItem = ( i ) => (
			<div key={ 'timeline-item-' + i } className={ 'timeline-item' }>
				<div className={ 'timeline-icon' }>
				</div>
				<div className={ 'timeline-details' }>
					<div className={ 'timeline-meta' }>
						<div className={ 'timeline-user' }>
						</div>
						<div className={ 'timeline-date' }>
						</div>
					</div>
					<div className={ 'timeline-note' }>
					</div>
					<div className={ 'timeline-note-half' }>
					</div>
				</div>
			</div>
		);

		const timelinePreview = (timeline &&
			<div key={ 'timeline' }>
				<strong>{ __( 'Timeline', 'gravityflow' ) }</strong>
				<div id={ 'timeline' }>
					{ timelineItem( 1 ) }
					{ timelineItem( 2 ) }
				</div>
			</div>
		);

		const workflowBox = (<div key={ 'workflow-box' }>
				{ workflowInfo }
				{ stepStatus }
			</div>
		);

		const fieldValue = ( i ) => (
			<div key={ 'field-value-' + i }>
				<div className={ 'field-label-container' }>
					<div className={ 'field-label' }>
					</div>
				</div>
				{ dummyValue }
			</div>
		);
		return [
			<InspectorControls key={ 'detail-inspector' }>
				<PanelBody
					title={ __( 'Display Settings', 'gravityflow' ) }
				>
					<ToggleControl
						label={ __( 'Timeline', 'gravityflow' ) }
						checked={ timeline }
						onChange={ () => setAttributes( { timeline: !timeline } ) }
					/>
					<ToggleControl
						label={ __( 'Step Status', 'gravityflow' ) }
						checked={ step_status }
						onChange={ () => setAttributes( { step_status: !step_status } ) }
					/>
					<ToggleControl
						label={ __( 'Workflow Details', 'gravityflow' ) }
						checked={ workflow_info }
						onChange={ () => setAttributes( { workflow_info: !workflow_info } ) }
					/>
					<ToggleControl
						label={ __( 'Sidebar', 'gravityflow' ) }
						checked={ sidebar }
						onChange={ () => setAttributes( { sidebar: !sidebar } ) }
					/>
					<ToggleControl
						label={ __( 'Back Link', 'gravityflow' ) }
						checked={ back_link }
						onChange={ () => setAttributes( { back_link: !back_link } ) }
					/>
					{ back_link && (
						<div>
							<TextControl
								label={ __( 'Back Link Text', 'gravityforms' ) }
								value={ back_link_text }
								onChange={ ( new_back_link_text ) => setAttributes( { back_link_text: new_back_link_text } ) }
							/>
							<TextControl
								label={ __( 'Custom Inbox URL (Optional)', 'gravityforms' ) }
								value={ back_link_url }
								onChange={ ( new_back_link_url ) => setAttributes( { back_link_url: new_back_link_url } ) }
							/>
						</div>
					) }
				</PanelBody>
			</InspectorControls>,
			<div key={ 'detail-view' } id={ 'detail-view' } className={ 'detail-view' }>
				{ back_link && back_link_text }
				<div id={ 'container' }>
					<div key={ 'main' } id={ 'main' }>
						<div id={ 'entry-details' }>
							{ [...Array( 5 )].map( ( _, i ) => fieldValue( i ) ) }
						</div>
						{ !sidebar && workflowBox }
						{ sidebar && timelinePreview }
					</div>
					{ sidebar &&
					<div key={ 'sidebar' } id={ 'sidebar' }>
						{ workflowBox }
					</div>
					}
				</div>
				{ !sidebar && timelinePreview }
			</div>
			]
	}
}


export default DetailPage;