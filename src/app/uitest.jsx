import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import CrudApp from '../ui/CrudApp.jsx'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import {objectWhereMatch} from "../utils/js-util.js";
import LocalRpcDb from "../utils/LocalRpcDb.js";

let rpc=new LocalRpcDb({
    schema: {
        tables: [
            {
                name: "users",
                columns: [{
                    name: "id",
                    pk: true,
                    autoIncrement: true,
                },{
                    name: "firstname"
                },{
                    name: "lastname"
                }]
            },
            {
                name: "things",
                columns: [
                    {
                        name: "thingname"
                    },
                ]
            },
            {
                name: "other",
                columns: [
                    {
                        name: "othername"
                    }
                ]
            }
        ]
    }
});

await rpc.addData({table: "users", set: {firstname: "test1", lastname: "last1"}});
await rpc.addData({table: "users", set: {firstname: "test2", lastname: "last2"}});
await rpc.addData({table: "users", set: {firstname: "test3", lastname: "last3"}});
await rpc.addData({table: "users", set: {firstname: "test4", lastname: "last4"}});
await rpc.addData({table: "users", set: {firstname: "test5", lastname: "last5"}});
await rpc.addData({table: "users", set: {firstname: "test6", lastname: "last6"}});
await rpc.addData({table: "users", set: {firstname: "test7", lastname: "last7"}});
await rpc.addData({table: "users", set: {firstname: "test8", lastname: "last8"}});
await rpc.addData({table: "users", set: {firstname: "test9", lastname: "last9"}});
await rpc.addData({table: "users", set: {firstname: "test10", lastname: "last10"}});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <CrudApp rpc={rpc}/>
    </StrictMode>
)
