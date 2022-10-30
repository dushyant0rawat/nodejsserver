var http = require('http');
var fs = require('fs');

var url = require('url');
var path = require('path');

const port = 80;
const debug = true;
const httpServer = http.createServer(function (req,res) {
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
       case '.jpg':
           contentType = 'image/jpg';
           break;
   }

 console.log('url:' + req.url + '  filePath:' + filePath + '  ext:' + ext + ' contentType:' + contentType);

fs.readFile(filePath,function(err,data){
  if(err) {
    console.log('type of data:' + typeof data);
    console.log(`error occured in reading file ${filePath}`);
  } else {
    res.writeHead(200, { 'content-type': contentType });
    res.write(data);
    res.end();
  }

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
