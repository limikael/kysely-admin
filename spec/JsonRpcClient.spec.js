import JsonRpcClient from "../src/utils/JsonRpcClient.js";
import JsonRpcServer from "../src/utils/JsonRpcServer.js";

describe("JsonRpcClient",()=>{
	it("can handle requests",async ()=>{
		class Handler {
			async addone(val) {
				return val+1;
			}
		}

		let handler=new Handler();
		let server=new JsonRpcServer(handler);
		let client=new JsonRpcClient("http://bla",{fetch: server.handleRequest});
		let result=await client.addone(7);
		expect(result).toEqual(8);
	});
})