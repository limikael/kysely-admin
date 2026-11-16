import {defineConfig} from 'vite';

export default defineConfig(async ()=>{
    /*const db=new Kysely({
        dialect: new SqliteDialect({
            database: new Database('./dev.sqlite')
        })
    });

    await reconcileSchema({kysely: db, sql: schemaSql, log: console.log, destructive: true});
    let backend=new CrudBackend({
        kysely: db, 
        pathname: "/api", 
        serverSecret: "hello",
        adminUsername: "admin",
        adminPassword: "admin"
    });

    return ({
        plugins: [
            react(),
            viteRequestHandlerPlugin(backend.handleRequest)
        ],
    })*/

	return ({
		root: "./bundle-test"
	});
});
