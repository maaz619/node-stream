"use strict";

var fetch = require("node-fetch");


// ************************************

const HTTP_PORT = 8039;


main().catch(() => 1);


// ************************************

async function main() {
	try {
		let res = await fetch("http://localhost:8039/get-records");
		if(res && res.ok){
			let records = await res.json()
			if(records && records.length>0){
				process.exitCode=0;
				console.log(records);
				return
			}
		} 
	} catch(e) {
		// statements
		console.log(e);
	}
}
