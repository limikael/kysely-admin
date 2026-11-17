import {defineConfig} from 'vite';
import path from "path";
import assets from "../dist/assets.js";
import {Kysely, SqliteDialect} from 'kysely';
import Database from 'better-sqlite3';
import CrudBackend from "../src/backend/CrudBackend.js";
import {reconcileSchema} from "reconcile-schema";
import MemoryAssetHandler from "../src/utils/MemoryAssetHandler.js";
import {viteRequestHandlerPlugin} from "../src/utils/vite-request-handler-plugin.js";

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
    let backend=new CrudBackend({
        kysely: db, 
        pathname: "admin",
        serverSecret: "hello",
        adminUsername: "admin",
        adminPassword: "admin123",
        assetHandler: new MemoryAssetHandler({assets}),
    });

    return ({
        plugins: [
//            react(),
            viteRequestHandlerPlugin(backend.handleRequest)
        ],
    });
});
