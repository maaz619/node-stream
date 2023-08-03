#!/usr/bin/env node

"use strict"

var path= require("path")
var fs= require("fs")
var getSdtin = require("get-stdin")
var args = require("minimist")(process.argv.slice(2),{
	boolean:["help","in"],
	string:["file"]
})

var BASE_PATH=path.resolve(
	process.env.BASE_PATH||__dirname
)
console.log(BASE_PATH)

if(args.help){
	printHelp()
}
else if(args.in||args._.includes("-")){
	getSdtin().then(processFile).catch(error)
}
else if(args.file){
	fs.readFile(path.join(BASE_PATH,args.file),function readFile(err,content){
		if(err){
			console.log(err.toString())
		}
		else{
			processFile(content)
		}
	})

}
else{
	error("incorrect usage",true)
}

/* ********************************** */

//synchronous fs method

// function processFile(filepath){
// 	let fileContent= fs.readFileSync(filepath)
// 	console.log(fileContent)
// 	process.stdout.write(fileContent)
// }

//Asynchronous fs method

function processFile(content){
	let contents=content.toString();
	console.log(contents.toUpperCase())
}


function error(message,includeHelp=false){
	console.error(message)
	includeHelp&&printHelp()
}

function printHelp(){
	console.log("ex1 usage:")
	console.log("	 ex1.js --file={FILENAME}    ")
	console.log("")
	console.log("--help             	print this help.")
	console.log("--file={FILENAME}      process the file.")
	console.log("--in                   process stdin.")
	console.log("")
}
