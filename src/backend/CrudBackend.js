import JsonRpcServer from "../utils/JsonRpcServer.js";
import {kyselyQbeWhere} from "../utils/kysely-util.js";

class CrudBackendHandler {
	constructor(context) {
		this.kysely=context.backend.kysely;
	}

	async getSchema() {
		let tables=await this.kysely.introspection.getTables();

		return ({tables});
	}

	async addData({table, set}) {
		await this.kysely
			.insertInto(table)
			.values(set)
			.execute();
	}

	async getData({table, where}) {
		let query=this.kysely
			.selectFrom(table)
			.selectAll();

		query=kyselyQbeWhere(query,where);
		return await query.execute();
	}

	async deleteData({table, where}) {
		let query=this.kysely
			.deleteFrom(table);

		query=kyselyQbeWhere(query,where);
		await query.execute();
	}

	async updateData({table, set, where}) {
		let query=this.kysely
			.updateTable(table)
			.set(set);

		query=kyselyQbeWhere(query,where);
		await query.execute();
	}
}

export default class CrudBackend {
	constructor({kysely, pathname}) {
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