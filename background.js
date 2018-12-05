// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';


// var viewTabId = 0;
// chrome.browserAction.onClicked.addListener(function() {
//   var n = chrome.extension.getURL("cookie.html");
//   if (viewTabId != 0)
//     try {
//       chrome.tabs.remove(viewTabId, function() {})
//     } catch (t) {
//       console.log(t)
//     }
//   chrome.tabs.create({
//     url: n
//   })
// });

function focusOrCreateTab(url) {
	chrome.windows.getAll({"populate":true}, function(windows) {
		var existing_tab = null;
		for (var i in windows) {
			var tabs = windows[i].tabs;
			for (var j in tabs) {
				var tab = tabs[j];
				if (tab.url == url) {
					existing_tab = tab;
					break;
				}
			}
		}
		if (existing_tab) {
			chrome.tabs.update(existing_tab.id, {"selected":true});
		} else {
			chrome.tabs.create({"url":url, "selected":true});
		}
	});
}

chrome.browserAction.onClicked.addListener(function(tab) {
	//open the tab
	var manager_url = chrome.extension.getURL("cookie.html");
	focusOrCreateTab(manager_url);
});

