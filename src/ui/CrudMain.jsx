import CrudList from "./CrudList.jsx";
import {useState} from "react";
import CrudDetail from "./CrudDetail.jsx";

export default function CrudMain({rpc, schema, tableName}) {
	let table=schema.tables.find(t=>t.name==tableName);
	let [editId,setEditId]=useState();
	let [creating,setCreating]=useState();

	function handleComplete() {
		setEditId(undefined);
		setCreating(false);
	}

	if (editId || creating) {
		return (
			<CrudDetail rpc={rpc} schema={schema} tableName={tableName}
					itemId={editId}
					onComplete={handleComplete}/>
		);
	}

	return (
		<CrudList rpc={rpc} schema={schema} tableName={tableName}
				onEdit={id=>setEditId(id)}
				onNew={()=>setCreating(true)}/>
	);
}