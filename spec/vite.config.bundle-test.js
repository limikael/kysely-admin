import {defineConfig} from 'vite';
import path from "path";
import {Kysely, SqliteDialect} from 'kysely';
import Database from 'better-sqlite3';
import {reconcileSchema} from "reconcile-schema";

//import {viteRequestHandlerPlugin} from "../src/utils/vite-request-handler-plugin.js";
//import MemoryAssetHandler from "../src/utils/MemoryAssetHandler.js";
//import CrudBackend from "../src/backend/CrudBackend.js";
//import assets from "../dist/assets.js";
//import {kyselyAdmin} from "../src/backend/kysely-admin.js";
import {kyselyAdminVitePlugin} from "../src/backend/kysely-admin-vite-plugin.js";

let schemaSql=`
    CREATE TABLE users (
        id integer not null primary key auto_increment,
        name text not null
    );
`;

export default defineConfig(async ()=>{
    const db=new Kysely({
        dialect: new SqliteDialect({
            database: new Database('./dev.sqlite')
        })
    });

    await reconcileSchema({kysely: db, sql: schemaSql, log: console.log, destructive: true});

    return ({
        root: path.join(import.meta.dirname,"bundle-test"),
        plugins: [
            kyselyAdminVitePlugin({
                kysely: db, 
                pathname: "admin",
                serverSecret: "hello",
                adminUsername: "admin",
                adminPassword: "admin123",
            }),
        ],
    });
});
