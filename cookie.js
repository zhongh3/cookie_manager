chrome.webRequest.onSendHeaders.addListener(
  function(details){
    console.log(details)
  },
  {
    urls: ["http://karlie.000webhostapp.com/*", "https://connect.facebook.net/*", "https://www.facebook.com/*"],
    // urls: ["<all_urls>"],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image",
      "font", "object", "xmlhttprequest", "media", "other"]
  },
  ["requestHeaders"]
);

chrome.webRequest.onHeadersReceived.addListener(
  function(details){
    console.log(details)
  },
  {
    urls: ["http://karlie.000webhostapp.com/*", "https://connect.facebook.net/*", "https://www.facebook.com/*"],
    // urls: ["<all_urls>"],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image",
      "font", "object", "xmlhttprequest", "media", "other"]
  },
  ["blocking", "responseHeaders"]
);
