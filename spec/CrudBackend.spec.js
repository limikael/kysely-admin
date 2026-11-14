import CrudBackend from "../src/backend/CrudBackend.js";
import {Kysely} from 'kysely';
import initSqlJs from 'sql.js';
import {SqlJsDialect} from 'kysely-wasm';
import {reconcileSchema} from "reconcile-schema";
//import {getKyselyTablesEx} from "../src/utils/kysely-introspection-ex.js";
import JsonRpcClient from "../src/utils/JsonRpcClient.js";

describe("CrudBackend",()=>{
	it("can get schema",async ()=>{
		let SQL=await initSqlJs();
        let db=new Kysely({
            dialect: new SqlJsDialect({
                database: new SQL.Database(),
            }),
        });

        let schemaDefSql=`
        	CREATE TABLE users (id INTEGER NOT NULL PRIMARY KEY, name TEXT);
        `;

        await reconcileSchema({kysely: db, sql: schemaDefSql});

		let backend=new CrudBackend({kysely: db});
		let rpc=new JsonRpcClient("http://test",{fetch: backend.handleRequest});
		let schema=await rpc.getSchema();
		expect(schema.tables[0].name).toEqual("users");

		await rpc.addData({table: "users", set: {name: "micke"}});
		await rpc.addData({table: "users", set: {name: "micke2"}});
		let data;
		data=await rpc.getData({table: "users"});
		//console.log(data);
		expect(data).toEqual([ { id: 1, name: 'micke' }, {id: 2, name: "micke2"} ]);

		data=await rpc.getData({table: "users", where: {name: "micke"}});
		//console.log(data);
		expect(data).toEqual([ { id: 1, name: 'micke' }]);

		await rpc.deleteData({table: "users", where: {name: "micke2"}});

		data=await rpc.getData({table: "users"});
		expect(data).toEqual([ { id: 1, name: 'micke' }]);
	});
})