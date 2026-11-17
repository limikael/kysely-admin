import mime from "mime-types";

export default class MemoryAssetHandler {
	constructor({assets, pathname}={}) {
		this.pathname=pathname;
		if (!this.pathname)
			this.pathname="/";

		this.assetsByPathname={};
		if (assets) {
			for (let k in assets) {
				this.addAsset(k,assets[k]);

				if (k=="index.html")
					this.addAsset("",assets[k]);
			}
		}
	}

	setPathname(pathname) {
		this.pathname=pathname;
	}

	addAsset(pathname, asset) {
		//if (!pathname.startsWith("/"))
		//	pathname="/"+pathname;

		//console.log("pathname: "+pathname);

		this.assetsByPathname[pathname]=asset;
	}

	async handleRequest(request) {
		let url=new URL(request.url);
		if (!url.pathname.startsWith(this.pathname))
			return;

		let pathname=url.pathname.slice(this.pathname.length);
		if (request.method=="GET" && this.assetsByPathname[pathname]) {
			let mimeType=mime.lookup(pathname);
			return new Response(this.assetsByPathname[pathname],{
				headers: {
					"Content-type": mimeType
				}
			});
		}
	}
}