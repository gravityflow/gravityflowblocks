/* Copyright (C) 2019 Steven Henty S.L. - All Rights Reserved */

const { registerStore } = wp.data
const { apiFetch } = wp

const actions = {
	setForms( forms ) {
		return {
			type: 'SET_FORMS',
			forms,
		}
	},

	receiveForms( path ) {
		return {
			type: 'RECEIVE_FORMS',
			path,
		}
	},

}

const store = registerStore( 'gravityflow/workflow', {
	reducer( state = { forms: [] }, action ) {
		switch ( action.type ) {
			case 'SET_FORMS':
				return {
					...state,
					forms: action.forms,
				}
		}

		return state
	},

	actions,

	selectors: {
		receiveForms( state ) {
			const { forms } = state
			return forms
		},
	},

	controls: {
		RECEIVE_FORMS( action ) {
			return apiFetch( { path: action.path } )
		},
	},

	resolvers: {
		* receiveForms() {
			let forms;
			try {
				forms = yield actions.receiveForms( '/gf/v2/workflow/forms/' )
			} catch ( e ) {
				forms = 'error'
				console.log( 'error' )
				console.log( e )
			}

			return actions.setForms( forms )
		},
	},
} )
