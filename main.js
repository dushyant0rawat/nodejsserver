const https = require('https');
const http = require('http');
// let url = require('url');

const mongo = require('./app/mongodb.js');
const {handleRequest,options} = require('./app/controllers/core.js');
console.log = require('./app/util/logger.js').console_log;

mongo.client.connect();

const httpsServer = https.createServer(options,handleRequest);
httpsServer.listen(443, "0.0.0.0");

// Redirect from http port 80 to https
http.createServer(function (req, res) {
    console.log("listening on port 80 and now redirecting to https");
    console.log('local and remote port',req.socket.localPort,req.socket.remotePort);
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80, "0.0.0.0");


process.on('SIGINT',function(){
  console.log('sigint by pressing crtl + C');
  mongo.client.close();
  process.exit();
});
