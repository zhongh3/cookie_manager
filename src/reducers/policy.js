import {TOGGLE_POLICY1, TOGGLE_POLICY2, TOGGLE_POLICY3, TOGGLE_POLICY4} from "../constants"

let initialState = {
	policy1On: false,
	policy2On: false,
	policy3On: false,
	policy4On: false
}


const policy = (state = initialState, action) => {
	switch (action.type){
		case TOGGLE_POLICY1:
			return {...state, policy1On: !state.policy1On}
		case TOGGLE_POLICY2:
			return {...state, policy2On: !state.policy2On}
		case TOGGLE_POLICY3:
			return {...state, policy3On: !state.policy3On}
		case TOGGLE_POLICY4:
			return {...state, policy4On: !state.policy4On}
	}
}

export default policy