import {createRequest, sendResponse} from '@mjackson/node-fetch-server';

export function viteRequestHandlerPlugin(requestHandler) {
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
        name: 'vite-request-handler',

        configureServer(server) {
            server.middlewares.use(handler);
        },

        configurePreviewServer(server) {
            server.middlewares.use(handler);
        }
    };
}