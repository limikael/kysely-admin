import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import {viteRequestHandlerPlugin} from "./src/utils/vite-request-handler-plugin.js";
import {Kysely, SqliteDialect} from 'kysely';
import Database from 'better-sqlite3';
import {reconcileSchema} from "reconcile-schema";
import CrudBackend from "./src/backend/CrudBackend.js";

let schemaSql=`
    CREATE TABLE users (
        id integer not null primary key auto_increment,
        name text not null
    );
`;

export default defineConfig(async ({command})=>{
    if (command=="build") {
        return {
            base: './',
            plugins: [
                react(),
            ],
        };
    }

    const db=new Kysely({
        dialect: new SqliteDialect({
            database: new Database('./dev.sqlite')
        })
    });

    await reconcileSchema({kysely: db, sql: schemaSql, log: console.log, destructive: true});
    let backend=new CrudBackend({
        kysely: db, 
//        pathname: "/api", 
        serverSecret: "hello",
        adminUsername: "admin",
        adminPassword: "admin"
    });

    return ({
//        base: './',
        plugins: [
            react(),
            viteRequestHandlerPlugin(backend.handleRequest)
        ],
    })
})
