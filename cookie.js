chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details){
//     console.log(details);
    processRequest(details);
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
//     console.log(details);
    processResponse(details);
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
  request.requestHeaders.forEach(function(element){
    if(element.name.toLowerCase() === "cookie"){
      let cookies = element.value.trim().split(";");
      console.log(request);
      console.log('[Requst] cookie = ' + element.value);

      for (let i = 0; i < cookies.length; i++){
        validateCookie(cookies[i].trim(), request)
      }
    }
  })
}

function processResponse(response){
  response.responseHeaders.forEach(function(element){
    if(element.name.toLowerCase() === "set-cookie"){
      console.log(response);
      console.log('[Response] set-cookie = ' + element.value);
      saveCookie(element.value, response);
    }
  })
}

function saveCookie(cookieInfo, response){
  let record = new CookieRecord(cookieInfo, response);
  record.saveRecord();
}

function validateCookie(cookieId, request){
  let record = CookieRecord.getRecord(cookieId);
  if (record){
    console.log("cookie record is found: ", record)
  } else{
    console.log("cookie record is not found: ", cookieId)
  }

  //TODO: Policies
}

let ProtoEnum = Object.freeze({"HTTP":1, "HTTPS":2, "UNKNOWN":3});

class CookieRecord{
  constructor(cookieInfo, response){

    // e.g. (1)
    // set-cookie = fr=02JHXdX9jTlB089Zd..Bb9SKL...1.0.Bb9SKL.; expires=Tuesday, 19-Feb-2019 09:16:59 GMT;
    // path=/; domain=.facebook.com; HttpOnly; secure

    // e.g. (2)
    // set-cookie = PHPSESSID=ovtcs8saap5jpbm0sbv2b6radt; path=/

    let x = cookieInfo.trim().split(";");
    let t = parseURL(response.url);

    this.id = x[0];  // name=value
    this.name = x[0].trim().split("=")[0];
    this.value = x[0].trim().split("=")[1];

    // default values
    this.protocol = t.protocol;
    this.host = t.host;
    this.expires = null;    // set-cookie - convert date to timestamp
    this.creatTime = response.timeStamp;  // TODO: which one to use?
    this.initiator = null;
    this.path = t.path;
    this.domain = this.host;  // TODO: if there's no domain info in set-cookie, set the domain to host? how about path?
    this.secure = false;    // set-cookie
    this.httpOnly = false;  // set-cookie
    this.sameSite = false;  // set-cookie
    this.isSession = true;  // set-cookie

    for (let i = 1; i < x.length; i++){
      let para = x[i].trim().split("=");
      switch(para[0].toLowerCase()){
        case "expires":
          this.expires = Date.parse(para[1].toLowerCase());
          this.isSession = false;
          break;
        case "path":
          this.path = para[1].toLowerCase();
          break;
        case "domain":
          this.domain = para[1].toLowerCase();
          break;
        case "httponly":
          this.httpOnly = true;
          break;
        case "secure":
          this.secure = true;
          break;
        case "samesite":
          this.sameSite = true;
          break;
        default:
          console.log('New parameter in "set-cookie": ', x[i]);
      }
    }

    if (response.initiator){
      console.log('[Response] initiator = ' + response.initiator);
      this.initiator = response.initiator;
    }
  }

  saveRecord() {
    localStorage.setItem(this.id, JSON.stringify(this));
  }

  static getRecord(key){
    return JSON.parse(localStorage.getItem(key));
  }
}


function parseURL(n) {
  let t = {};
  let i = n.match(/^([^:]+):\/\/([^\/:]*)(?::([\d]+))?(?:(\/[^#]*).*)?$/i);

  t.protocol = ProtoEnum.UNKNOWN;

  if (i){
    switch(i[1].toLowerCase()){
      case "http":
        t.protocol = ProtoEnum.HTTP;
        break;
      case "https":
        t.protocol = ProtoEnum.HTTPS;
        break;
      default:
        console.log('Unknown protocol from: ', i.input);
        t.protocol = ProtoEnum.UNKNOWN;
    }

    t.host = i[2];
    t.port = i[3];
    t.path = i[4] || "/";
  }

  return t;
}