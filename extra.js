var fs = require("fs");
var {Transform}= require("stream");

fs.createReadStream(process.argv[2]).
	pipe(new Transform({
		transform(buf,enc,callback){
			this.push(buf.toString().toUpperCase())
			callback()
		}
	})).
	pipe(process.stdout)
