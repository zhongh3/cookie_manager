// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';


var viewTabId = 0;
chrome.browserAction.onClicked.addListener(function() {
  var n = chrome.extension.getURL("cookie.html");
  if (viewTabId != 0)
    try {
      chrome.tabs.remove(viewTabId, function() {})
    } catch (t) {
      console.log(t)
    }
  chrome.tabs.create({
    url: n
  })
});

