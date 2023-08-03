#!/usr/bin/env node

"use strict"

var path= require("path")
var fs= require("fs")
var zlib= require("zlib")
var Transform = require("stream").Transform;

var args = require("minimist")(process.argv.slice(2),{
	boolean:["help","in","out","compress"],
	string:["file"]
})

var BASE_PATH=path.resolve(
	process.env.BASE_PATH||__dirname
)

var OUTFILE= path.join(BASE_PATH,"out.txt");


if(args.help){
	printHelp()
}
else if(args.in||args._.includes("-")){
	processFile(process.stdin)
}
else if(args.file){
	let stream =fs.createReadStream(path.join(BASE_PATH,args.file))
	processFile(stream)
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

function processFile(inStream){
	var outStream = inStream;
	var targetStream;

	if(args.uncompress){
		var unzipStream= zlib.createGunzip();
		outStream=outStream.pipe(unzipStream)
	}

	var upperStream = new Transform({
		transform(chunk,enc,callBack){
			this.push(chunk.toString().toUpperCase())
			callBack()
		}
	})

	outStream=outStream.pipe(upperStream)

	if(args.compress){
		OUTFILE=`${OUTFILE}.gz`
		let gzipStream = zlib.createGzip();
		outStream=outStream.pipe(gzipStream)
	}
	
	if (args.out) {
		targetStream=process.stdout
	}
	else {
		targetStream=fs.createWriteStream(OUTFILE);
	}

	outStream.pipe(targetStream)
}


function error(message,includeHelp=false){
	console.error(message)
	includeHelp&&printHelp()
}

function printHelp(){
	console.log("ex2 usage:")
	console.log("	 ex2.js --file={FILENAME}    ")
	console.log("")
	console.log("--help             	print this help.")
	console.log("--file={FILENAME}      process the file.")
	console.log("--in                   process stdin.")
	console.log("--out                  print to stdout.")
	console.log("--compress             compress the file to gzip")
	console.log("--uncompress           uncompress the file from gzip")
	console.log("")
}
