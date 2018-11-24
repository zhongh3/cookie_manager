import React from 'react'
import RequestList from './RequestList'
import {AppBar, Toolbar, Typography} from '@material-ui/core';

const App = () => (
	<div>
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6" color="inherit">
					Cookie Manager
				</Typography>
			</Toolbar>
		</AppBar>
		
		<div style={{display: "flex"}}>
			<div style={{"width": "30%"}}>
				<RequestList/>
			</div>
			<div style={{width: "70%", border: "1px solid rgba(0, 0, 0, 0.12)"}}>
				test
			</div>
		</div>
	</div>
)

export default App