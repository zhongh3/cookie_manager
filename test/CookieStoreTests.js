// import sinon from "sinon"
import assert from "assert"
import {convertCookieStrToObj} from "../src/util/CookieStore"

describe("test example", () => {
	it("test once", () => {
		assert.equal(1, 1)
	})
	
	it("test rawCookieText to obj", () => {
		let obj = convertCookieStrToObj("policy1-cookie=cookie1;expires=100;path=/")
		assert.equal("cookie1", obj["policy1-cookie"])
		assert.equal("100", obj["expires"])
		assert.equal("/", obj["path"])
	})
})