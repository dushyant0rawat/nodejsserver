const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const mongo = require('../mongodb.js');

exports.options =  {
  key: fs.readFileSync('dushyantrawat.com.key'),
  cert: fs.readFileSync('dushyantrawat.com.cer')
};

exports.handleRequest = function (req,res) {
 console.log(`remote ip: ${req.headers['x-forwarded-for']} ${req.socket?.remoteAddress}` );
 console.log(`req method ${req.method}`);
 console.log(`req header content type ${req.headers['content-type']}`);
 console.log(`req headers ${req.headers}`);
 // console.log(`ip from request-ip is ${requestIp.getClientIp(req)}`);
 // path.join normalizes the path

 let filePath1 = path.join(
        __dirname,
        '/public/views/'
    );
 req.url = getUrl(req.url);


// __dirname is current directory and process global object cwd() is project directory
let filePath = path.join(
       // __dirname,
       process.cwd(),
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
   if(req.url === "/videoList.js") {
     let filePath = path.join(
             process.cwd(),
            "/public/assets/videos/"
        );
     let data =[];
     fs.readdir(filePath, (err, files) => {
       if(err) {
         if(err.code ==='ENOENT'){
           console.log("error is",err);
           res.writeHead(404, {'Content-Type': 'text/plain'});
           res.write("file not found");
          res.end();
          return;
         }
       }

       files.forEach((file) => {
        console.log('filename is:', file);
        data.push({file: '/public/assets/videos/' + file});
     });
     res.writeHead(200, { 'content-type': 'application/text'});
     res.write(JSON.stringify(data));
     res.end();
   });

    return;
   }
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
       res.writeHead(404, {'Content-Type': 'text/plain'});
       res.end();
       return
     }
   res.end(err);
   }
   var range = req.headers.range;
   if (!range) {
    // 416 Wrong range
    res.writeHead(416, {'Content-Type': 'text/plain'});
    res.end();
    return;
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
};


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

function getUrl(url) {
 let newUrl = ';'
 let ext = path.extname(url);
 let basename = path.basename(url);
 if( ext ==='' && basename === ''){
    newUrl = "/public/views/home.html";
    return newUrl;
 }
 switch(ext) {
   case '':
           newUrl = "/public/views/" + basename + ".html";
           break;
   case 'html':
           newUrl= "/public/views/" + basename;
           break;
   default:
           newUrl = url;

 }
  return newUrl;
}
