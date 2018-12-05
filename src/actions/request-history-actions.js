import * as constants from "../constants"

export const addRequest = (request) => ({
	type: constants.ADD_REQUEST,
	data: {
		id: request.requestId,
		url: request.url,
		beforeCookie: request.beforeCookie,
		afterCookie: request.afterCookie
	}
})

export const selectRequest = id => ({
	type: constants.SELECT_REQUEST,
	data: id
})