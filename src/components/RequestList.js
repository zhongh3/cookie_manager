import {List, ListItem, ListItemText} from '@material-ui/core';
import React from "react"
import { connect } from 'react-redux'
import cookieStore from "../util/CookieStore"
import * as requestHistoryActions from '../actions/request-history-actions'

class RequestList extends React.Component {
	componentDidMount(){
		let self = this
		chrome.webRequest.onBeforeSendHeaders.addListener(
			function(details){
				let result = cookieStore.processRequest(details, self.props.policy1On, self.props.policy2On, self.props.policy3On);
				self.props.addRequest({...details, ...result})
			},
			{
				urls: ["http://karlie.000webhostapp.com/*",
					"https://connect.facebook.net/*",
					"https://www.facebook.com/*",
					"*://www.cs5331.com/*"
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
				cookieStore.processResponse(details);
			},
			{
				urls: ["http://karlie.000webhostapp.com/*",
					"https://connect.facebook.net/*",
					"https://www.facebook.com/*",
					"*://www.cs5331.com/*"
				],
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
				{this.props.requestHistory.requestList.map((request) => {
					return (
						<ListItem key={request.id} divider onClick={() => this.props.selectRequest(request.id)}>
							<ListItemText>{request.url.substring(0, 40)}</ListItemText>
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
	policy4On: state.policy.policy4On,
	requestHistory: state.requestHistory
})

export default connect(mapStateToProps, requestHistoryActions)(RequestList)