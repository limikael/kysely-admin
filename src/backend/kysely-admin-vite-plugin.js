import {kyselyAdmin} from "./kysely-admin.js";
import {viteRequestHandlerPlugin} from "../utils/vite-request-handler-plugin.js";

export function kyselyAdminVitePlugin(options) {
	return viteRequestHandlerPlugin(kyselyAdmin(options),{name: "kysely-admin"});
}