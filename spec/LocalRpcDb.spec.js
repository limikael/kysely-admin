import LocalRpcDb from "../src/utils/LocalRpcDb.js";

describe("LocalRpcDb",()=>{
	it("can work like a database",async ()=>{
		let db=new LocalRpcDb({
			schema: {
	            tables: [
	                {
	                    name: "users",
	                    columns: [
	                        {
	                            name: "id",
	                            pk: true,
	                            autoIncrement: true
	                        },
	                        {
	                            name: "firstname"
	                        },
	                        {
	                            name: "lastname"
	                        }
	                    ]
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

		let data;
		data=await db.getData({table: "users"});
		expect(data).toEqual([]);

		await db.addData({table: "users", set: {
			firstname: "first1",
			lastname: "last1"
		}});

		await db.addData({table: "users", set: {
			firstname: "first2",
			lastname: "last2"
		}});

		data=await db.getData({table: "users"});
		expect(data).toEqual([
			{
				id: 1,
				firstname: "first1",
				lastname: "last1"
			},
			{
				id: 2,
				firstname: "first2",
				lastname: "last2"
			},
		]);

		data=await db.getData({table: "users", where: {firstname: "first1"}});
		expect(data).toEqual([
			{
				id: 1,
				firstname: "first1",
				lastname: "last1"
			},
		]);

		await db.updateData({table: "users", set: {lastname: "lastlast"}, where: {firstname: "first1"}});
		data=await db.getData({table: "users"});
		expect(data).toEqual([
			{
				id: 1,
				firstname: "first1",
				lastname: "lastlast"
			},
			{
				id: 2,
				firstname: "first2",
				lastname: "last2"
			},
		]);

		await db.deleteData({table: "users", where: {lastname: "lastlast"}});
		data=await db.getData({table: "users"});
		expect(data.length).toEqual(1);
	});
})