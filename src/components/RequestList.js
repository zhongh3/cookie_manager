import {List, ListItem, ListItemText} from '@material-ui/core';
import React from "react"

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

export default RequestList