import {Group, Title, ActionIcon, Button, Table, Modal, Container, Space} from '@mantine/core';
import {IconSearch, IconFilter, IconEdit, IconTrash} from '@tabler/icons-react';
import {pluralize, singularize} from "inflekt";
import {normalizeTitle} from "../utils/js-util.js";
import {useAsyncMemo, isLoading, useRefresh} from "../utils/use-async-memo.jsx";
import {Center, Loader} from '@mantine/core';
import {columnsGetListable, itemGetId, columnsGetPkColumn} from "./ui-schema-util.js";
import {useState} from "react";

function CrudListHeader({rcp, schema, tableName, onNew}) {
	return (
		<Group justify="space-between" align="center">
			<Title order={3}>{normalizeTitle(tableName)}</Title>
			<Group gap="xs">
				<Button size="sm" onClick={onNew}>
					New {normalizeTitle(singularize(tableName))}
				</Button>
			</Group>
		</Group>
	);
}

export default function CrudList({rpc, schema, tableName, onEdit, onNew}) {
    let refresh=useRefresh();
	let table=schema.tables.find(t=>t.name==tableName);
	let items=useAsyncMemo(()=>rpc.getData({table: tableName}),[tableName,refresh]);
    let [deleteId,setDeleteId]=useState();
    let [deleteLoading,setDeleteLoading]=useState();

    async function handleDeleteConfirm() {
        let pkColumn=columnsGetPkColumn(table.columns);

        setDeleteLoading(true);
        await rpc.deleteData({table: tableName, where: {
            [pkColumn.name]: deleteId
        }});
        setDeleteId(undefined);
        setDeleteLoading(undefined);
        refresh();
    }

    if (isLoading(items)) {
        return (
            <Center h="50vh">
                <Loader />
            </Center>
        );
    }

	return (<>
        <Modal opened={!!deleteId} title="Confirm"
                onClose={()=>setDeleteId(undefined)}>
            Delete the item?
            <Space h="md" />
            <Group justify="center">
                <Button variant="default" onClick={()=>setDeleteId(null)}>Cancel</Button>
                <Button loading={deleteLoading} onClick={handleDeleteConfirm}>Delete</Button>
            </Group>
        </Modal>
		<CrudListHeader rpc={rpc} schema={schema} tableName={tableName} onNew={onNew}/>
        <Table>
            <Table.Thead>
                <Table.Tr>
                	{columnsGetListable(table.columns).map(c=>
	                    <Table.Th key={c.name}>{normalizeTitle(c.name)}</Table.Th>
                	)}
                	<Table.Th w="1%"/>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {items.map(item=>
                	<Table.Tr key={itemGetId(item,table)}>
 	                	{columnsGetListable(table.columns).map(c=>
		                    <Table.Td key={c.name}>{item[c.name]}</Table.Td>
	                	)}
 		              	<Table.Th style={{ whiteSpace: 'nowrap' }}>
                           	<ActionIcon variant="subtle" color="gray"
                           			onClick={()=>onEdit(itemGetId(item,table))}>
                                <IconEdit size={16} />
                            </ActionIcon>

                            <ActionIcon variant="subtle" color="red"
                                    onClick={()=>setDeleteId(itemGetId(item,table))}>
                                <IconTrash size={16} />
                            </ActionIcon>
        	        	</Table.Th>
                	</Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    </>);
}