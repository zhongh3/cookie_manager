import React from 'react'
import {render} from 'react-dom'
import App from './components/App'
import listeners from './listeners'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import cookieMgmt from './reducers'

let store = createStore(cookieMgmt)

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('cookies')
)
