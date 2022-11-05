var http = require('https');
var fs = require('fs');
var url = require('url');
var path = require('path');
// const requestIp = require('request-ip');

const DEBUG = true;
// console.log(module);

const port = 443;
const options = {
  key: fs.readFileSync('dushyantrawat.com.key'),
  cert: fs.readFileSync('dushyantrawat.com.cer')
};

const CHUNK_SIZE = 10 ** 6;
const httpServer = http.createServer(options,function (req,res) {
  console.log(`remote ip: ${req.headers['x-forwarded-for']} ${req.socket?.remoteAddress}` );
  console.log(`req headers ${req.headers}`);
  // console.log(`ip from request-ip is ${requestIp.getClientIp(req)}`);
  // path.join normalizes the path
 let filePath = path.join(
        __dirname,
        req.url === "/" ? "yt.html" : req.url
    );

 let ext = path.extname(filePath);
 let contentType = 'text/html';

   switch (ext) {
       case '.css':
           contentType = 'text/css';
           break;
       case '.js':
           contentType = 'text/javascript';
           break;
       case '.json':
           contentType = 'application/json';
           break;
       case '.png':
           contentType = 'image/png';
           break;
      case '.mp4':
            contentType = 'video/mp4';
            break;
       case '.jpg':
           contentType = 'image/jpg';
           break;
   }

 console.log('url:' + req.url + '  filePath:' + filePath + '  ext:' + ext + ' contentType:' + contentType);
// directory traversal
// const  pathPattern = /^[a-z0-9]+$/
// const pathCheck = pathPattern.test(req.url);
// if(req.url === '/') {
//
// } else if (^pathCheck) {
//    console.log("directory traversal")
//    res.writeHead(404, { 'content-type': 'text/html' });
//    res.end(`<h1>illegal characte in + ${req.url}</h1>`);
//  }

//full download of .mp4 doesn't work on iphone and ipad

if (ext != ".mp4") {
  fs.readFile(filePath,function(err,data){
    if(err) {
      console.log('type of data:' + typeof data);
      console.log(`error occured in reading file ${filePath}`);
      res.writeHead(404, { 'content-type': 'text/html' });
      res.write('<h1>error loading page</h1>');
    } else {
      res.writeHead(200, { 'content-type': contentType});
      res.write(data);
    }
   res.end();
  });
} else {
  fs.stat(filePath, function(err, stats) {
    if (err) {
      if (err.code === 'ENOENT') {
        // 404 Error if file not found
        return res.sendStatus(404);
      }
    res.end(err);
    }
    var range = req.headers.range;
    if (!range) {
     // 416 Wrong range
     return res.sendStatus(416);
    }
    console.log("range is:" + range);
    var total = stats.size;
    // let positions = range.replace(/bytes=/, "").split("-");
    // let start = parseInt(positions[0], 10);
    // let end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    // const end = Math.min(start + CHUNK_SIZE, total - 1);
    let [start,end] = range.replace(/bytes=/, "").split("-");
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : total - 1;
    if(!isNaN(start) && isNaN(end)){
      start = start;
      end = size -1;

    }
    if(isNaN(start) && !isNaN(end)){
      start = size -end;
      end = size -1;
    }
    console.log(`start: ${start}  end: ${end}`);
    var chunksize = (end - start) + 1;

    res.writeHead(206, {
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    });

    var stream = fs.createReadStream(filePath, { start: start, end: end })
      .on("open", function() {
        stream.pipe(res);
      }).on("error", function(err) {
        res.end(err);
      });
  });
}
});
httpServer.listen(port, "0.0.0.0");

//immediately invoked function expression
console.log = (function(debug) {


  var console_log = console.log;
  // var timeStart = new Date().getTime();

  return function() {
      if(!debug) return;
    // var delta = new Date().getTime() -timeStart ;
    var currTime = new Date().toLocaleString();
    var args = [];
    // args.push((delta / 1000).toFixed(2) + ':');
    args.push('[' + currTime + ']');
    for(var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    console_log.apply(console, args);
  };
})(DEBUG);

// Redirect from http port 80 to https
var http = require('http');
http.createServer(function (req, res) {
    console.log("listening on port 80 and now redirecting to https");
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80, "0.0.0.0");


// var https = require('https');
// var fs = require('fs');
//
// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };
//
// https.createServer(options,function (req,res) {
//  fs.readFile('todos.json',function(err,data){
//  res.writeHead(200, {'Content-Type': 'application/json'});
//  res.write(data);
//  return res.end();
//  });
//
// }).listen(443, "0.0.0.0");
