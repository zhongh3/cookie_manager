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
	
	modifyRequestCookie(request, afterCookie){
		request.requestHeaders.forEach(function(element){
			if(element.name.toLowerCase() === "cookie"){
				element.value = afterCookie
			}
		})
	}
	
	processRequest(request, policy1On, policy2On, policy3On, policy4On){
		let self = this
		let cookies = []
		let t = parseURL(request.url)
		request.requestHeaders.forEach(function(element){
			if(element.name.toLowerCase() === "cookie"){
				console.log(request);
				cookies = element.value.trim().split(";").map(cookieStr => {
					let name = cookieStr.split("=")[0].trim()
					let value = cookieStr.split("=")[1].trim()
					return [name, value]
				});
			}
		})
		if(cookies.length === 0)
			return
		
		if(policy1On){
			let cookie = this.getByNameValue(cookies[0][0], cookies[0][1]);
			if(t.protocol === ProtoEnum.HTTPS){
				// console.log(store)
				// console.log(cookies)
				// let key = cookies[0].join("");
				let httpsCookie = null
				let httpCookie = null
				if(cookie && cookie.protocol === ProtoEnum.HTTP){ //if http, need to check whether https cookie exists or not
					httpCookie = cookie
					httpsCookie = this.getByHostName(t.host, cookie.name, cookie.value)
					// console.log(httpsCookie)
				}
				let beforeCookie = httpCookie? httpCookie.name + "=" + httpCookie.value: ""
				let afterCookie = httpsCookie? httpsCookie.name + "=" + httpsCookie.value: ""
				self.modifyRequestCookie(request, afterCookie)
				return {
					beforeCookie, afterCookie
				}
			}else{
				if(cookie && cookie.protocol === ProtoEnum.HTTPS){
					let beforeCookie = cookie.name + "=" + cookie.value
					let afterCookie = ""
					self.modifyRequestCookie(request, afterCookie)
					return {
						beforeCookie, afterCookie
					}
				}
			}
		}
		if(policy2On){
			let cookie = this.getByNameValue(cookies[0][0], cookies[0][1]);
			let beforeCookie = cookie.name + "=" + cookie.value
			let afterCookie = ("http://"+cookie.host+"/"+cookie.path !== cookie.responseUrl)? "": beforeCookie
			self.modifyRequestCookie(request, afterCookie)
			return {
				beforeCookie,
				afterCookie
			}
		}
		if(policy3On){
			let beforeCookie = cookies.map(cookie => {
				return cookie[0] + "=" + cookie[1]
			}).join("; ")
			
			let afterCookie = cookies.map(cookie => self.getByNameValue(cookie[0], cookie[1]))
				.filter(cookieObj => cookieObj && t.host === cookieObj.host)
				.map(cookieObj => {
					return cookieObj.name + "=" + cookieObj.value
				}).join("; ")
			
			self.modifyRequestCookie(request, afterCookie)
			return {
				beforeCookie, afterCookie
			}
		}
		if(policy4On){
			let beforeCookie = cookies.map(cookie => {
				return cookie[0] + "=" + cookie[1]
			}).join("; ")
			
			let afterCookie = cookies.map(cookie => self.getByNameValue(cookie[0], cookie[1]))
				.filter(cookieObj => !!cookieObj)
				.map(cookieObj => {
					return cookieObj.name + "=" + cookieObj.value
				}).join("; ")
			
			self.modifyRequestCookie(request, afterCookie)
			return {
				beforeCookie, afterCookie
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
		cookieObj.responseUrl = response.url
		
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