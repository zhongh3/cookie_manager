import React from 'react'
import RequestList from './RequestList'
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
								// checked={this.state.checkedA}
								// onChange={this.handleChange('checkedA')}
								value="checkedA"
							/>
						}
						label={<span style={{color: "white"}}>Policy 1</span>}
					/>
					<FormControlLabel
						control={
							<Switch
								// checked={this.state.checkedA}
								// onChange={this.handleChange('checkedA')}
								value="checkedA"
							/>
						}
						label={<span style={{color: "white"}}>Policy 2</span>}
					/>
					<FormControlLabel
						control={
							<Switch
								// checked={this.state.checkedA}
								// onChange={this.handleChange('checkedA')}
								value="checkedA"
							/>
						}
						label={<span style={{color: "white"}}>Policy 3</span>}
					/>
					<FormControlLabel
						control={
							<Switch
								// checked={this.state.checkedA}
								// onChange={this.handleChange('checkedA')}
								value="checkedA"
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
				test
			</div>
		</div>
	</div>
)

export default withStyles(styles)(App)