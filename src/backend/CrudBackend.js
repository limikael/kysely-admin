import JsonRpcServer from "../utils/JsonRpcServer.js";
import {kyselyQbeWhere} from "../utils/kysely-util.js";
import {headersSetJwt, headersGetJwt, headersDeleteCookie} from "../utils/headers-util.js";

class CrudBackendHandler {
	constructor({backend, request, responseHeaders}) {
		this.responseHeaders=responseHeaders;
		this.request=request;
		this.backend=backend;
		this.kysely=backend.kysely;
	}

	async loginUsernameAndPassword(username, password) {
		if (!this.backend.adminUsername || 
				!this.backend.adminPassword ||
				username!=this.backend.adminUsername ||
				password!=this.backend.adminPassword)
			throw new Error("Bad username/password");

		await headersSetJwt(this.responseHeaders,this.backend.cookieName,{
			value: {username: username},
			expiresIn: "1h",
			secret: this.backend.serverSecret
		});
	}

	async getUser() {
		let jwt=await headersGetJwt(this.request.headers,this.backend.cookieName,{
			secret: this.backend.serverSecret
		});

		if (!jwt || !jwt.value.username)
			return;

		return jwt.value;
	}

	async logout() {
		headersDeleteCookie(this.responseHeaders,this.backend.cookieName);
	}

	async getSchema() {
		let tables=await this.kysely.introspection.getTables();

		return ({tables});
	}

	async assertLogin() {
		if (!this.backend.adminUsername && 
				!this.backend.adminPassword)
			return;

		let jwt=await headersGetJwt(this.request.headers,this.backend.cookieName,{
			secret: this.backend.serverSecret
		});

		if (!jwt || !jwt.value.username)
			throw new Error("Not logged in");
	}

	async addData({table, set}) {
		await this.assertLogin();
		await this.kysely
			.insertInto(table)
			.values(set)
			.execute();
	}

	async getData({table, where}) {
		await this.assertLogin();
		let query=this.kysely
			.selectFrom(table)
			.selectAll();

		query=kyselyQbeWhere(query,where);
		return await query.execute();
	}

	async deleteData({table, where}) {
		await this.assertLogin();
		let query=this.kysely
			.deleteFrom(table);

		query=kyselyQbeWhere(query,where);
		await query.execute();
	}

	async updateData({table, set, where}) {
		await this.assertLogin();
		let query=this.kysely
			.updateTable(table)
			.set(set);

		query=kyselyQbeWhere(query,where);
		await query.execute();
	}
}

export default class CrudBackend {
	constructor({kysely, pathname, cookieName, serverSecret, adminUsername, adminPassword}) {
		this.adminUsername=adminUsername;
		this.adminPassword=adminPassword;
		this.serverSecret=serverSecret;
		if (!this.serverSecret)
			throw new Error("server secret missing");

		this.cookieName=cookieName;
		if (!this.cookieName)
			this.cookieName="admin";

		this.kysely=kysely;
		this.jsonRpcServer=new JsonRpcServer(this.createHandler,{
			pathname
		});
	}

	createHandler=async (context)=>{
		return new CrudBackendHandler({backend: this, ...context});
	}

	handleRequest=async (request)=>{
		return await this.jsonRpcServer.handleRequest(request);
	}
}