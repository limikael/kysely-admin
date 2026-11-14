import {Group, Title, ActionIcon, Button, Table, TextInput, Stack} from '@mantine/core';
import {Center, Loader} from '@mantine/core';
import {pluralize, singularize} from "inflekt";
import {normalizeTitle} from "../utils/js-util.js";
import {IconArrowLeft} from '@tabler/icons-react';
import {columnsGetEditable, columnsGetPkColumn} from "./ui-schema-util.js";
import {useAsyncMemo, useAsyncState, isLoading, isError} from "../utils/use-async-memo.jsx";
import {useAsyncClick} from "../utils/mantine-utils.jsx";

export default function CrudDetail({rpc, schema, tableName, onComplete, itemId}) {
	let table=schema.tables.find(t=>t.name==tableName);
    let [item, setItem]=useAsyncState(async ()=>{
        if (!itemId)
            return {};

        let pkColumn=columnsGetPkColumn(table.columns);
        let items=await rpc.getData({table: tableName, where: {
            [pkColumn.name]: itemId
        }});

        return items[0];
    },[itemId]);
    let saveHandler=useAsyncClick(async()=>{
        let pkColumn=columnsGetPkColumn(table.columns);
        if (item[pkColumn.name]) {
            await rpc.updateData({table: tableName, set: item, where: {
                [pkColumn.name]: item[pkColumn.name]
            }});
        }

        else {
            await rpc.addData({table: tableName, set: item});
        }

        onComplete();
    });

    if (isError(item)) {
        console.log(item);
        return;
    }

    if (isLoading(item)) {
        return (
            <Center h="50vh">
                <Loader />
            </Center>
        );
    }

	return (<>
        <Title order={3}>
            <ActionIcon variant="subtle" onClick={onComplete}>
                <IconArrowLeft size={16} />
            </ActionIcon>
            {itemId?"Edit":"New"} {singularize(normalizeTitle(tableName))}
        </Title>
        <Stack>
            {columnsGetEditable(table.columns).map(column=>
                <TextInput label={normalizeTitle(column.name)} key={column.name}
                    value={item[column.name]}
                    onChange={ev=>setItem({...item,[column.name]: ev.target.value})}/>
            )}

            <Group justify="flex-start">
                <Button {...saveHandler}>
                    Save {singularize(normalizeTitle(tableName))}
                </Button>
            </Group>
        </Stack>
    </>);
}