import { AppShell, Group, Title, Burger, Button, Container, Table, MantineProvider} from '@mantine/core';
import {useAsyncMemo, isLoading} from "../utils/use-async-memo.jsx";
import { Center, Loader } from '@mantine/core';
import CrudNavBar from "./CrudNavBar.jsx";
import {useState, useMemo} from "react";
import CrudMain from "./CrudMain.jsx";
import JsonRpcClient from "../utils/JsonRpcClient.js";
import '@mantine/core/styles.css';
import CrudAuth from "./CrudAuth.jsx";

function CrudAppLoaded({rpc, schema}) {
    let [selectedTable,setSelectedTable]=useState(schema.tables[0].name);

    return <CrudAuth />;

    return (
        <AppShell header={{ height: 60 }} navbar={{ width: 250, breakpoint: 'sm' }}
                padding="md">
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Title order={3}>My application</Title>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <CrudNavBar rpc={rpc} schema={schema}
                    selected={selectedTable}
                    onSelect={setSelectedTable}/>
            </AppShell.Navbar>

            <AppShell.Main>
                <CrudMain rpc={rpc} schema={schema}
                        tableName={selectedTable}
                        key={selectedTable}/>
            </AppShell.Main>
        </AppShell>
    );
}

export default function CrudApp({url}) {
    let rpc=useMemo(()=>new JsonRpcClient(url),[]);
    let schema=useAsyncMemo(()=>rpc.getSchema(),[]);

    if (isLoading(schema)) {
        return (
            <MantineProvider>
                <Center h="100vh">
                    <Loader />
                </Center>
            </MantineProvider>
        );
    }

    return (
        <MantineProvider>
            <CrudAppLoaded rpc={rpc} schema={schema}/>
        </MantineProvider>
    );
}
