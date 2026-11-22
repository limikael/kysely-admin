import {kyselyAdminFetchHandler} from "./kysely-admin-fetch-handler.js";
import {viteRequestHandlerPlugin} from "../utils/vite-request-handler-plugin.js";

export function kyselyAdminVitePlugin(options) {
	return viteRequestHandlerPlugin(kyselyAdminFetchHandler(options),{name: "kysely-admin"});
}