import {AppShell, Group, Title, Burger, Button, Container, Table, MantineProvider, ActionIcon,
        Menu, Center, Loader} from '@mantine/core';
import {useAsyncMemo, isLoading, isError, useRefresh} from "../utils/use-async-memo.jsx";
import {useDisclosure} from "@mantine/hooks";
import CrudNavBar from "./CrudNavBar.jsx";
import {useState, useMemo} from "react";
import CrudMain from "./CrudMain.jsx";
import JsonRpcClient from "../utils/JsonRpcClient.js";
import '@mantine/core/styles.css';
import CrudAuth from "./CrudAuth.jsx";
import { IconMenu2 } from '@tabler/icons-react';

function CrudAppLoaded({rpc, schema, onLogout}) {
    let [selectedTable,setSelectedTable]=useState(schema.tables[0].name);
    const [opened, { toggle }] = useDisclosure();

    async function handleLogout() {
        await rpc.logout();
        onLogout();
    }

    return (
        <AppShell header={{ height: 60 }} navbar={{ width: 250, breakpoint: 'sm' }}
                padding="md">
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Title order={3}>My application</Title>
                    <Menu shadow="md" width={200} position="bottom-end" ml="auto">
                        <Menu.Target>
                            <ActionIcon variant="outline" color="gray" size="lg">
                                <IconMenu2 size={18}/>
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

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
    let refresh=useRefresh();
    let rpc=useMemo(()=>new JsonRpcClient(url),[]);
    let schema=useAsyncMemo(()=>rpc.getSchema(),[]);
    let user=useAsyncMemo(()=>rpc.getUser(),[refresh]);

    if (isError(schema) || isError(user))
        return (
            <div>Error: {String(schema)} {String(user)}</div>
        );

    if (isLoading(schema) || isLoading(user)) {
        return (
            <MantineProvider>
                <Center h="100vh">
                    <Loader />
                </Center>
            </MantineProvider>
        );
    }

    if (!user) {
        return (
            <MantineProvider>
                <CrudAuth rpc={rpc} onLogin={refresh}/>
            </MantineProvider>
        )
    }

    return (
        <MantineProvider>
            <CrudAppLoaded rpc={rpc} schema={schema} onLogout={refresh}/>
        </MantineProvider>
    );
}
