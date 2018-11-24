import sha256 from "js-sha256"
import {parseURL} from "./util"
import {ProtoEnum} from "../constants"

let store = {}

class CookieStore {
	save(cookieObj){
		let host = cookieObj.host
		let name = cookieObj.name
		let value = cookieObj.value
		
		store[name + value] = cookieObj
		if(!store[host + name])
			store[host + name] = {}
		store[host + name][value] = cookieObj
	}
	
	getByNameValue(name, value){
		return store[name + value]
	}
	
	getByHostName(host, name, httpCookieValue){
		let cookies = store[host + name]
		let entry = Object.entries(cookies).find(entry => entry[1].value !== httpCookieValue)
		return entry? entry[1]: null
	}
	
	processRequest(request, policy1On, policy2On, policy3On){
		let cookies = []
		let t = parseURL(request.url)
		request.requestHeaders.forEach(function(element){
			if(element.name.toLowerCase() === "cookie"){
				let cookie = element.value.trim().split(";")[0];
				console.log(request);
				// console.log('[Requst] cookie = ' + element.value);
				let name = cookie.split("=")[0].trim()
				let value = cookie.split("=")[1].trim()
				cookies.push([name, value])
			}
		})
		if(policy1On){
			if(t.protocol === ProtoEnum.HTTPS){
				console.log(store)
				console.log(cookies)
				if(cookies.length === 0) //no cookie is there
					return {}
				// let key = cookies[0].join("");
				let cookie = this.getByNameValue(cookies[0][0], cookies[0][1]);
				let httpsCookie = null
				let httpCookie = null
				if(cookie && cookie.protocol === ProtoEnum.HTTP){ //if http, need to check whether https cookie exists or not
					httpCookie = cookie
					httpsCookie = this.getByHostName(t.host, cookie.name, cookie.value)
					console.log(httpsCookie)
				}
				return {
					beforeCookie: httpCookie? httpCookie.name + "=" + httpCookie.value: "",
					afterCookie: httpsCookie? httpsCookie.name + "=" + httpsCookie.value: ""
				}
			}
		}
	}
	
	processResponse(response){
		let self = this
		// console.log(response);
		response.responseHeaders.forEach(element => {
			if(element.name.toLowerCase() === "set-cookie"){
				// console.log('[Response] set-cookie = ' + element.value);
				let cookieObj = self.extractCookie(element.value, response);
				self.save(cookieObj)
			}
		})
	}
	
	extractCookie(rawCookieText, response){
		let x = rawCookieText.trim().split(";");
		let rawCookieObj = convertCookieStrToObj(rawCookieText);
		let t = parseURL(response.url);
		let cookieObj = {}
		
		cookieObj.name = x[0].trim().split("=")[0];
		cookieObj.value = x[0].trim().split("=")[1];
		
		// default values
		cookieObj.protocol = t.protocol;
		cookieObj.host = t.host;
		cookieObj.expires = null;    // set-cookie - convert date to timestamp
		cookieObj.creatTime = response.timeStamp;  // TODO: which one to use?
		cookieObj.initiator = response.initiator;
		cookieObj.path = rawCookieObj.path || "/";
		cookieObj.domain = rawCookieObj.domain || t.host;  // TODO: if there's no domain info in set-cookie, set the domain to host? how about path?
		cookieObj.secure = false;    // set-cookie
		cookieObj.httpOnly = false;  // set-cookie
		cookieObj.sameSite = false;  // set-cookie
		cookieObj.isSession = true;  // set-cookie
		
		for (let i = 1; i < x.length; i++){
			let para = x[i].trim().split("=");
			switch(para[0].toLowerCase()){
				case "expires":
					cookieObj.expires = Date.parse(para[1].toLowerCase());
					cookieObj.isSession = false;
					break;
				case "path":
					cookieObj.path = para[1].toLowerCase();
					break;
				case "domain":
					cookieObj.domain = para[1].toLowerCase();
					break;
				case "httponly":
					cookieObj.httpOnly = true;
					break;
				case "secure":
					cookieObj.secure = true;
					break;
				case "samesite":
					cookieObj.sameSite = true;
					break;
				default:
					console.log('New parameter in "set-cookie": ', x[i]);
			}
		}
		
		return cookieObj
	}
}

export const convertCookieStrToObj = (rawCookieText) => {
	return rawCookieText.split(';').reduce((prev, current) => {
		const [name, value] = current.trim().split('=');
		prev[name] = value;
		return prev
	}, {});
}


export default new CookieStore()