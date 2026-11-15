import {headersSetCookie, headersGetCookie, headersSetJwt, headersGetJwt} from "../src/utils/headers-util.js";

describe("headers-util",()=>{
	it("can get and set a cookie",async ()=>{
		let responseHeaders = new Headers();
		headersSetCookie(responseHeaders, "hello", { value: "test" });

		let requestHeaders = new Headers();
		requestHeaders.set('Cookie', responseHeaders.get('Set-Cookie').split(';')[0]);

		let c = headersGetCookie(requestHeaders, "hello");
		//console.log(c);
		expect(c).toEqual({ name: 'hello', value: 'test' });
	});

	it("can set jwt",async ()=>{
		let responseHeaders=new Headers();
		await headersSetJwt(responseHeaders,"hello",{
			value: {user: "test"},
			expiresIn: "1h",
			secret: "hello world"
		});

		let requestHeaders = new Headers();
		requestHeaders.set('Cookie', responseHeaders.get('Set-Cookie').split(';')[0]);

		let jwt=await headersGetJwt(requestHeaders,"hello",{
			secret: "hello world"
		});

		//console.log(jwt);
		expect(jwt.value.user).toEqual("test");
	});
});