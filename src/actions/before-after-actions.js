import * as constants from "../constants"

export const setBeforeAfterPolicy1 = (beforeAfterCookie) => ({
	type: constants.SET_BEFORE_AFTER_POLICY1,
	data: beforeAfterCookie
})

export const togglePolicy2 = () => ({
	type: TOGGLE_POLICY2
})

export const togglePolicy3 = () => ({
	type: TOGGLE_POLICY3
})

export const togglePolicy4 = () => ({
	type: TOGGLE_POLICY4
})