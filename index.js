var http = require('https');
var fs = require('fs');

var url = require('url');
var path = require('path');

// const port = 80;
const port = 443;
const options = {
  key: fs.readFileSync('c-73-54-168-143.hsd1.ga.comcast.net.key'),
  cert: fs.readFileSync('c-73-54-168-143.hsd1.ga.comcast.net.cer')
};


const debug = true;
const httpServer = http.createServer(options,function (req,res) {
  // path.join normalizes the path
 let filePath = path.join(
        __dirname,
        req.url === "/" ? "yt.html" : req.url
    );
    console.log("joined path is " + filePath);
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

fs.readFile(filePath,function(err,data){
  if(err) {
    console.log('type of data:' + typeof data);
    console.log(`error occured in reading file ${filePath}`);
    res.writeHead(404, { 'content-type': 'text/html' });
    res.write('<h1>error loading page</h1>');
  } else {
    res.writeHead(200, { 'content-type': contentType });
    res.write(data);
  }
 res.end();
});

});
httpServer.listen(port, "0.0.0.0");


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
