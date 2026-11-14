export default class JsonRpcClient {
    constructor(url, options = {}) {
        this.url = url;
        this.fetch = options.fetch ?? globalThis.fetch.bind(globalThis);

        return new Proxy(this, {
            get: (target, property) => {
                if (property in target) {
                    const value = target[property];

                    return typeof value === 'function'
                        ? value.bind(target)
                        : value;
                }

                return (...params) => target.call(property, params);
            }
        });
    }

    async call(method, params) {
        const request = new Request(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method,
                params,
                id: 1
            })
        });

        const response = await this.fetch(request);
        const data = await response.json();

        if (data.error) {
            const error = new Error(data.error.message);
            error.code = data.error.code;
            error.data = data.error.data;
            throw error;
        }

        return data.result;
    }
}