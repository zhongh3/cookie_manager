import {List, ListItem, ListItemText} from '@material-ui/core';
import React from "react"
import { connect } from 'react-redux'
import cookieStore from "../util/CookieStore"

class RequestList extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			requestHistory: []
		}
	}
	
	componentDidMount(){
		let self = this
		chrome.webRequest.onBeforeSendHeaders.addListener(
			function(details){
				// console.log(JSON.stringify(details));
				// processRequest(details);
				self.state.requestHistory.push(details.url);
				self.forceUpdate();
			},
			{
				urls: ["http://karlie.000webhostapp.com/*",
					"https://connect.facebook.net/*",
					"https://www.facebook.com/*",
					"http://*/*"
				],
				// urls: ["<all_urls>"],
				types: ["main_frame", "sub_frame", "stylesheet", "script", "image",
					"font", "object", "xmlhttprequest", "media", "other"]
			},
			["blocking", "requestHeaders"]
		);
		
		chrome.webRequest.onHeadersReceived.addListener(
			function(details){
				// console.log(JSON.stringify(details));
				console.log(details);
				cookieStore.processResponse(details);
			},
			{
				urls: ["http://karlie.000webhostapp.com/*",
					"https://connect.facebook.net/*",
					"https://www.facebook.com/*"],
				// urls: ["<all_urls>"],
				types: ["main_frame", "sub_frame", "stylesheet", "script", "image",
					"font", "object", "xmlhttprequest", "media", "other"]
			},
			["blocking", "responseHeaders"]
		);
		
	}
	
	render(){
		return (
			<List>
				{this.state.requestHistory.map((url, index) => {
					return (
						<ListItem key={index} divider>
							<ListItemText>{url.substring(0, 40)}</ListItemText>
						</ListItem>
					)
				})}
			</List>
		)
	}
}

const mapStateToProps = state => ({
	policy1On: state.policy.policy1On,
	policy2On: state.policy.policy2On,
	policy3On: state.policy.policy3On,
	policy4On: state.policy.policy4On
})

export default connect(mapStateToProps, null)(RequestList)