var http=require("http");
var fs=require("fs");
var path=require("path");
var url=require("url");


var mimeTypes={
	"html":"text/html",
	"text":"text/plain",
	"js":"text/javascript",
	"css":"text/css"

};

http.createServer(function(req,res){
	var uri=url.parse(req.url).pathname;
	var filename=path.join(process.cwd(),unescape(uri));
	console.log("loading .."+ filename);

	var stats;

	try{
		stats=fs.lstatSync(filename);
	}catch(e){
		res.writeHead(404,{'Content-type':'text/plain'});
		res.write("404:not found");
		res.end();
		return;
	}

	if(stats.isFile()){
		var mime=mimeTypes[path.extname(filename).split(".").reverse()[0]];
		console.log(mime);
		res.writeHead(200,{"Content-type":mime});
		 var fstr=fs.createReadStream(filename);
		 fstr.pipe(res);
	}
	else if(stats.isDirectory()){
		res.writeHead(302,{"location":"index.html"});
		res.end();
	}
	else{
		res.writeHead(500,{'Content-type':"text/plain"});
		res.write("500:Internal server error");
		res.end();
	}

}).listen(3000);