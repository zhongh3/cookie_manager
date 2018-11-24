import React from 'react'
import RequestList from './RequestList'
import { connect } from 'react-redux'
import * as actions from "../actions/toggle-policy-actions"

import {AppBar, Toolbar, Typography,
	Switch, FormGroup, FormControlLabel, withStyles} from '@material-ui/core';

const styles = {
	root: {
		marginLeft: "100px"
	}
}

const App = (props) => (
	<div>
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6" color="inherit">
					Cookie Manager
				</Typography>
				
				<FormGroup row className={props.classes.root}>
					<FormControlLabel
						control={
							<Switch
								checked={props.policy1On}
								onChange={props.togglePolicy1}
							/>
						}
						label={<span style={{color: "white"}}>Policy 1</span>}
					/>
					<FormControlLabel
						control={
							<Switch
								checked={props.policy2On}
								onChange={props.togglePolicy2}
							/>
						}
						label={<span style={{color: "white"}}>Policy 2</span>}
					/>
					<FormControlLabel
						control={
							<Switch
								checked={props.policy3On}
								onChange={props.togglePolicy3}
							/>
						}
						label={<span style={{color: "white"}}>Policy 3</span>}
					/>
					<FormControlLabel
						control={
							<Switch
								checked={props.policy4On}
								onChange={props.togglePolicy4}
							/>
						}
						label={<span style={{color: "white"}}>Policy 4</span>}
					/>
				</FormGroup>
			</Toolbar>
		</AppBar>
		
		<div style={{display: "flex"}}>
			<div style={{"width": "30%"}}>
				<RequestList/>
			</div>
			<div style={{width: "70%", border: "1px solid rgba(0, 0, 0, 0.12)"}}>
				<p>Before: {props.selectedRequest.beforeCookie}</p>
				<p>After: {props.selectedRequest.afterCookie}</p>
			</div>
		</div>
	</div>
)

const mapStateToProps = state => ({
	policy1On: state.policy.policy1On,
	policy2On: state.policy.policy2On,
	policy3On: state.policy.policy3On,
	policy4On: state.policy.policy4On,
	selectedRequest: state.requestHistory.selectedRequest
})


export default connect(mapStateToProps, actions)(withStyles(styles)(App))