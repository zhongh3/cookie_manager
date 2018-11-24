chrome.webRequest.onHeadersReceived.addListener(
	function(details){
		console.log(JSON.stringify(details));
		// processResponse(details);
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
