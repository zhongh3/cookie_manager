import * as constants from "../constants"
const initialState = {
	selectedRequest: {},
	requestList: []
}

const requestHistory = (state = initialState, action) => {
	switch (action.type){
		case constants.ADD_REQUEST:
			let requestList = [...state.requestList, action.data]
			return {...state, requestList}
		case constants.SELECT_REQUEST:
			console.log("============= select request")
			console.log(action.data)
			let selectedRequest = state.requestList.find(item => item.id === action.data)
			console.log(selectedRequest)
			return {...state, selectedRequest}
		default:
			return state
	}
}

export default requestHistory