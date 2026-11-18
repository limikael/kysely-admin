import {createRequest, sendResponse} from '@mjackson/node-fetch-server';

export function viteRequestHandlerPlugin(requestHandler, options={}) {
    let name=options.name;
    if (!name)
        name='vite-request-handler';

    async function handler(req, res, next) {
        try {
            const request = createRequest(req, res);
            const response = await requestHandler(request);
            if (response === undefined)
                return next();

            await sendResponse(res, response);
        }

        catch (error) {
            next(error);
        }
    }

    return {
        name,

        configureServer(server) {
            server.middlewares.use(handler);
        },

        configurePreviewServer(server) {
            server.middlewares.use(handler);
        }
    };
}