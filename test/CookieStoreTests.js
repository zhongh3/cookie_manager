// import sinon from "sinon"
import assert from "assert"
import {convertCookieStrToObj} from "../src/util/CookieStore"

describe("test example", () => {
	it("test rawCookieText to obj", () => {
		let obj = convertCookieStrToObj(
			"SIDCC=ABtHo-FCTr6gs1_0uL50MW2q8yuJ6FsHTOrnTpXAyRSsSdqUJ41IiGZBLHCpbj8IPbdNYjaTJiNP; " +
			"expires=Fri, 22-Feb-2019 11:51:12 GMT; path=/; " +
			"domain=.google.com; priority=high")
		assert.equal("ABtHo-FCTr6gs1_0uL50MW2q8yuJ6FsHTOrnTpXAyRSsSdqUJ41IiGZBLHCpbj8IPbdNYjaTJiNP", obj["SIDCC"])
		assert.equal("Fri, 22-Feb-2019 11:51:12 GMT", obj["expires"])
		assert.equal("/", obj["path"])
		assert.equal(".google.com", obj["domain"])
		assert.equal("high", obj["priority"])
	})
})