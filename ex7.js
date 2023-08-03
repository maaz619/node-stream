#!/usr/bin/env node

"use strict";

var util = require("util");
var childProc = require("child_process")


// ************************************

const HTTP_PORT = 8039;
const MAX_CHILDREN = 1500;

var delay = util.promisify(setTimeout);


main().catch(console.error);


// ************************************

async function main() {
	console.log(`Load testing http://localhost:${HTTP_PORT}...`);

	while (true) {

		process.stdout.write(`Sending ${MAX_CHILDREN} request `)

		let children=[]

		for (var i = 0; i < MAX_CHILDREN; i++) {
			children.push(childProc.spawn("node",["ex7-child.js"]))
		}

		let resps= children.map(function wait(child){
			return new Promise(function c(res){
				child.on("exit", function(code){
					if(code===0) res(true)
					else res(false)
				})
			})
			
		})

		resps = await Promise.all(resps)

		if(resps.filter(Boolean).length===MAX_CHILDREN) console.log("success!");
		else console.log("Failure!");

		await delay(500)
			
	}
	
}
