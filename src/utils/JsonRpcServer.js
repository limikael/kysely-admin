export default class JsonRpcServer {
    constructor(handler, options={}) {
        this.handler=handler;
        this.methods=options.methods;
        this.pathname=options.pathname;
    }

    handleRequest=async (request)=>{
        let url=new URL(request.url);
        if (this.pathname && this.pathname!=url.pathname)
            return;

        let body;

        try {
            body = await request.json();
        } catch {
            return this.createResponse({
                error: {
                    code: -32700,
                    message: 'Parse error'
                }
            });
        }

        const isBatch = Array.isArray(body);
        const requests = isBatch ? body : [body];

        if (isBatch && requests.length === 0) {
            return this.createResponse({
                error: {
                    code: -32600,
                    message: 'Invalid Request'
                }
            });
        }

        let context={
            request,
            responseHeaders: new Headers({
                'Content-Type': 'application/json'
            })
        };

        const responses = await Promise.all(
            requests.map(rpcRequest => this.handleRpcRequest(rpcRequest, context))
        );

        const filtered = responses.filter(response => response !== null);

        if (filtered.length === 0) {
            return new Response(null, { status: 204 });
        }

        return this.createResponse(
            isBatch ? filtered : filtered[0],
            context.responseHeaders
        );
    }

    async handleRpcRequest(rpcRequest, context) {
        if (
            !rpcRequest ||
            typeof rpcRequest !== 'object' ||
            Array.isArray(rpcRequest) ||
            rpcRequest.jsonrpc !== '2.0' ||
            typeof rpcRequest.method !== 'string' ||
            (rpcRequest.params !== undefined &&
                !Array.isArray(rpcRequest.params) &&
                (typeof rpcRequest.params !== 'object' || rpcRequest.params === null))
        ) {
            return {
                jsonrpc: '2.0',
                id: rpcRequest?.id ?? null,
                error: {
                    code: -32600,
                    message: 'Invalid Request'
                }
            };
        }

        const { id, method, params = [] } = rpcRequest;

        // Notifications must not produce responses.
        const isNotification = !Object.hasOwn(rpcRequest, 'id');

        try {
            if (this.methods && !this.methods.includes(method)) {
                throw {
                    code: -32601,
                    message: 'Method not found: '+method
                };
            }

            let handler=this.handler;
            if (typeof handler=="function")
                handler=await handler(context);
            const handlerMethod = handler[method];

            if (typeof handlerMethod !== 'function') {
                throw {
                    code: -32601,
                    message: 'Method not found'+method
                };
            }

            const result = Array.isArray(params)
                ? await handlerMethod.apply(handler, params)
                : await handlerMethod.call(handler, params);

            if (isNotification) {
                return null;
            }

            return {
                jsonrpc: '2.0',
                id,
                result
            };
        } catch (error) {
            if (isNotification) {
                return null;
            }

            return {
                jsonrpc: '2.0',
                id,
                error: {
                    code: Number.isInteger(error?.code) ? error.code : -32603,
                    message: error?.message || 'Internal error',
                    ...(error?.data !== undefined ? { data: error.data } : {})
                }
            };
        }
    }

    createResponse(body, headers) {
        return new Response(JSON.stringify(body), {
            status: 200,
            headers
        });
    }
}