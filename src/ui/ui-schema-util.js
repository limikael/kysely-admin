export function columnsGetListable(columns) {
	return columns.filter(c=>!c.pk && !c.isAutoIncrementing);
}

export function columnsGetEditable(columns) {
	return columns.filter(c=>!c.pk && !c.isAutoIncrementing);
}

export function columnsGetPkColumn(columns) {
	let column;

	column=columns.find(c=>c.pk);
	if (!column)
		column=columns.find(c=>c.isAutoIncrementing);

	if (!column)
		throw new Error("No primary key column");

	return column;
}

export function itemGetId(item, table) {
	let pkColumn=columnsGetPkColumn(table.columns);
	//console.log(pkColumn, item);

	return item[pkColumn.name];
}