import {NavLink, Stack} from '@mantine/core';
import {normalizeTitle} from "../utils/js-util.js";

export default function CrudNavBar({schema, rpc, onSelect, selected}) {
//                    leftSection={<Icon size={18} />}

    return (
        <Stack gap={4}>
            {schema.tables.map(table => (
                <NavLink
                    key={table.name}
                    label={normalizeTitle(table.name)}
                    active={selected===table.name}
                    onClick={() => onSelect(table.name)}
                />
            ))}
        </Stack>
    );
}