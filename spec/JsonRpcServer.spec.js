import JsonRpcServer from "../src/utils/JsonRpcServer.js";

describe("JsonRpcServer",()=>{
	it("can handle requests",async ()=>{
		class Handler {
			async addone(val) {
				return val+1;
			}
		}

		let handler=new Handler();
		let server=new JsonRpcServer(handler);
		let response=await server.handleRequest(new Request("http://example.com",{
	        method: 'POST',
	        headers: {
	            'Content-Type': 'application/json'
	        },
	        body: JSON.stringify({
				jsonrpc: "2.0",
				method: "addone",
				params: [5],
				id: 123
	        })
		}));

		let responseJson=await response.json();
		//console.log(responseJson);
		expect(responseJson).toEqual({ jsonrpc: '2.0', id: 123, result: 6 });
	});

	it("can handle requests with a factory",async ()=>{
		class Handler {
			constructor({request, responseHeaders}) {
				this.request=request;
				this.responseHeaders=responseHeaders;
			}

			async addone(val) {
				this.responseHeaders.set("test","something");

				return [val+1,this.request.url];
			}
		}

		let server=new JsonRpcServer(context=>new Handler(context));
		let response=await server.handleRequest(new Request("http://example.com",{
	        method: 'POST',
	        headers: {
	            'Content-Type': 'application/json'
	        },
	        body: JSON.stringify({
				jsonrpc: "2.0",
				method: "addone",
				params: [5],
				id: 123
	        })
		}));

		expect(response.headers.get("test")).toEqual("something");

		let responseJson=await response.json();
		//console.log(responseJson);
		expect(responseJson).toEqual({ jsonrpc: '2.0', id: 123, result: [6,"http://example.com/"] });
	});
})