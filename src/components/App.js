import React from 'react'
import RequestList from './RequestList'

const App = () => (
	<div style={{display: "flex"}}>
		<div style={{"width": "30%"}}>
			<RequestList/>
		</div>
		<div style={{width: "70%", border: "1px solid rgba(0, 0, 0, 0.12)"}}>
			test
		</div>
	</div>
)

export default App