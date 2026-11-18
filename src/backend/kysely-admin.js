import CrudBackend from "./CrudBackend.js";
import assets from "../../dist/assets.js";
import MemoryAssetHandler from "../utils/MemoryAssetHandler.js";

export function kyselyAdmin(options={}) {
	let backend=new CrudBackend({
		...options,
        assetHandler: new MemoryAssetHandler({assets}),
	});

	return backend.handleRequest;
}