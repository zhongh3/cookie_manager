import {ProtoEnum} from "../constants"

export function parseURL(n) {
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