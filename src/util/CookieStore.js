import sha256 from "js-sha256"
import {parseURL} from "./util"

let store = {}

class CookieStore {
	save(cookieObj){
		let domain = cookieObj.domain
		if(!store[domain])
			store.domain = {}
		
		let name = cookieObj.name
		if(!store[domain][name])
			store[domain][name] = {}
		
		let value = cookieObj.value
		if(!store[domain][name][value])
			store[domain][name][value] = {}
		
		
		let hash = this.getHash(cookieObj);
		store[domain][name][value][hash] = cookieObj
	}
	
	get(cookieObj){
		let domain = cookieObj.domain
		if(!store[domain])
			return null
		
		let name = cookieObj.name
		if(!store[domain][name])
			return null
		
		let value = cookieObj.value
		if(!store[domain][name][value])
			return null
		
		let hash = this.getHash(cookieObj);
		return store[domain][name][value][hash]
	}
	
	getHash(cookieObj){
		//hash are generated by removing value and createTime
		let snapshot = Object.assign({}, cookieObj)
		delete snapshot.value
		delete snapshot.createTime
		let hash = sha256(JSON.stringify(snapshot))
		return hash
	}
	
	processResponse(response){
		let self = this
		console.log(response);
		response.responseHeaders.forEach(element => {
			if(element.name.toLowerCase() === "set-cookie"){
				console.log('[Response] set-cookie = ' + element.value);
				let cookieObj = self.extractCookie(element.value, response);
				console.log(cookieObj)
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