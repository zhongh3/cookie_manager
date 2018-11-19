chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details){
    console.log(details)
    processRequest(details)
  },
  {
    urls: ["http://karlie.000webhostapp.com/*", "https://connect.facebook.net/*", "https://www.facebook.com/*"],
    // urls: ["<all_urls>"],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image",
      "font", "object", "xmlhttprequest", "media", "other"]
  },
  ["blocking", "requestHeaders"]
);

chrome.webRequest.onHeadersReceived.addListener(
  function(details){
    console.log(details)
    processResponse(details)
  },
  {
    urls: ["http://karlie.000webhostapp.com/*", "https://connect.facebook.net/*", "https://www.facebook.com/*"],
    // urls: ["<all_urls>"],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image",
      "font", "object", "xmlhttprequest", "media", "other"]
  },
  ["blocking", "responseHeaders"]
);


function processRequest(request){
  //TODO
}

function processResponse(response){
  if (response.initiator){
    console.log('[Response] initiator = ' + response.initiator)
  }

  response.responseHeaders.forEach(function(element){
    if(element.name.toLowerCase() === "set-cookie")
    {
      console.log('[Response] set-cookie = ' + element.value)
      saveCookie(response)
    }
  })
}

function saveCookie(response){
  //TODO
}




