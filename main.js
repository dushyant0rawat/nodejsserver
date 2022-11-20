var http = require('https');
var fs = require('fs');
var url = require('url');
var path = require('path');
var querystring = require('querystring');
const mongo = require('./app/mongodb.js')


const CHUNK_SIZE = 10 ** 6;
const DEBUG = true;
const port = 443;
const options = {
  key: fs.readFileSync('dushyantrawat.com.key'),
  cert: fs.readFileSync('dushyantrawat.com.cer')
};
mongo.client.connect();

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

 const httpServer = http.createServer(options,function (req,res) {
  console.log(`remote ip: ${req.headers['x-forwarded-for']} ${req.socket?.remoteAddress}` );
  console.log(`req method ${req.method}`);
  console.log(`req header content type ${req.headers['content-type']}`);
  console.log(`req headers ${req.headers}`);
  // console.log(`ip from request-ip is ${requestIp.getClientIp(req)}`);
  // path.join normalizes the path

  switch(req.url.replace('/','')){
    case '':
            req.url = "/public/views/fountain.html";
            break;
    case 'bird':
            req.url = "/public/views/bird.html";
            break;
    case 'fountain':
            req.url = "/public/views/fountain.html";
            break;
    default:

  }

 let filePath = path.join(
        __dirname,
        req.url
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

//full download of .mp4 doesn't work on iphone and ipad
if(req.method == 'POST') {
    // req.coll = path.parse(req.url).name;
    req.coll = "comments";

    processPost(req, res, function(){
        console.log("data from the post is:",req.coll,req.post);
        dbResult(req,res);
    });
    return;
}

if (ext != ".mp4") {
  console.log('reading the file',filePath);
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
   return res.end();
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

// Redirect from http port 80 to https
var http = require('http');
http.createServer(function (req, res) {
    console.log("listening on port 80 and now redirecting to https");
    console.log('local and remote port',req.socket.localPort,req.socket.remotePort);
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80, "0.0.0.0");

function processPost(req, res, callback) {
    var queryData = "";
    if(typeof callback !== 'function') return null;

    if(req.method == 'POST') {
        req.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                res.writeHead(413, {'Content-Type': 'text/plain'}).end();
                req.connection.destroy();
            }
        });

        req.on('end', function() {
            req.post = querystring.parse(queryData);
            callback();
        });

    } else {
        res.writeHead(405, {'Content-Type': 'text/plain'});
        res.end();
    }
}

function dbResult(req,res){

   let data = [];

   mongo.dbCall(req,res)
   .then(async (result) => {
     if(req.post.type ==="get" ) {
       await result.forEach(doc=> {
       data.push(doc);
     });
   }
   })
   .catch((err) => {
     console.log("err from get is :",err,req.post.type);
   })
   .finally(()=> {
     if(req.post.type ==="get" ) {
       res.writeHead(200, { 'content-type': 'application/text'});
       res.write(JSON.stringify(data));
     } else {
       res.writeHead(204, "OK", {'Content-Type': 'text/plain'});
     }
     res.end();
   });
}


process.on('SIGINT',function(){
  console.log('sigint by pressing crtl + C');
  mongo.client.close();
  process.exit();
});
