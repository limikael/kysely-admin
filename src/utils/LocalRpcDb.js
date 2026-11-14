import {objectWhereMatch} from "./js-util.js";

export default class LocalRpcDb {
	constructor({schema}) {
		this.schema=schema;
		this.data={};
		this.autoId=1;

		for (let table of this.schema.tables)
			this.data[table.name]=[];
	}

	async getSchema() {
		return this.schema;
	}

    async getData({table, where}) {
    	await new Promise(r=>setTimeout(r,250));
        let data=this.data[table];
        data=data.filter(item=>objectWhereMatch(item,where));

        return data;
    }

    getTable(tableName) {
    	for (let table of this.schema.tables)
    		if (table.name==tableName)
    			return table;
    }

    async addData({table, set}) {
    	let columns=this.getTable(table).columns;
    	for (let column of columns)
    		if (column.autoIncrement)
    			set[column.name]=this.autoId++;

    	this.data[table].push(set);
    }

    async updateData({table, set, where}) {
    	this.data[table].forEach(item=>{
    		if (objectWhereMatch(item,where))
    			Object.assign(item,set);
    	});
    }

    async deleteData({table, where}) {
    	await new Promise(r=>setTimeout(r,250));
    	this.data[table]=this.data[table].filter(item=>!objectWhereMatch(item,where));
    }
}