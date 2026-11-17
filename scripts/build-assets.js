#!/usr/bin/env node

import fs from "fs";
import path from "path";
import {dirnameFromImportMeta} from "../src/utils/node-util.js";

let __dirname=dirnameFromImportMeta(import.meta);

let dir=path.join(__dirname,"..","dist");
let assets={};
for (const entry of fs.readdirSync(dir, { withFileTypes: true, recursive: true })) {
	if (entry.isFile() && entry.name!="assets.js") {
		let name=path.relative(dir,path.join(entry.parentPath,entry.name));
		assets[name]=fs.readFileSync(path.join(dir,name),"utf8");
	}
}

fs.writeFileSync(path.join(dir,"assets.js"),`
	export default (${JSON.stringify(assets,null,2)});
`);

//console.log(assets);