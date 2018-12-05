import {combineReducers} from 'redux'
import policy from './policy'
import requestHistory from './request-history'

const cookieMgmt = combineReducers({
	policy,
	requestHistory
})

export default cookieMgmt