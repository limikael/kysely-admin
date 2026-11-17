import MemoryAssetHandler from "../src/utils/MemoryAssetHandler.js";

describe("MemoryAssetHandler",()=>{
	it("can serve assets",async ()=>{
		let handler=new MemoryAssetHandler({pathname: "/test/"});
		handler.addAsset("hello.txt","hello world");
		let response=await handler.handleRequest(new Request("http://localhost/test/hello.txt"));
		let body=await response.text();
		expect(body).toEqual("hello world");
	});
})