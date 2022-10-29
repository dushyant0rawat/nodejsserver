// var http = require('http');
// var fs = require('fs');
//
//
// http.createServer(function (req,res) {
//  fs.readFile('todos.json',function(err,data){
//  res.writeHead(200, {'Content-Type': 'application/json'});
//  res.write(data);
//  return res.end();
//  });
//
// }).listen(80, "0.0.0.0");


var https = require('https');
var fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options,function (req,res) {
 fs.readFile('todos.json',function(err,data){
 res.writeHead(200, {'Content-Type': 'application/json'});
 res.write(data);
 return res.end();
 });

}).listen(443, "0.0.0.0");
