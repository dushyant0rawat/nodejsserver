
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
})(true);


//document ready
$(function() {
       console.log( "document loaded" );

        getVideoList();

        $( "#videoList" ).on("loadedmetadata","video",play);
        $( "#videoList" ).on("click","video",openVideo);


});

function getVideoList(){
  // let xhr= $.post( '/videoList',
  //      {"content-length" : "1024"},
  //      function(data, status){
  //       console.log("data and status is", data,status);
  //      if(status==='success'){
  //        let json = JSON.parse(data);
  //        console.log("data and status is", typeof json,json,status);
  //        for (let key in json) {
  //          $("#videoList").append( createVideoDiv(json,key));
  //        }
  //      } else {
  //        console.log("this is error in get request",data,status);
  //        $("#videoList").text(data);
  //        console.log("this is error in get request",data,status);
  //      }
  //  })
  //  .fail(function(){
  //    console.log("there is error in get list","xhr:",xhr,"this:",this);
  //    $("#videoList").text(`${xhr.status} ${xhr.statusText} ${xhr.responseText}`);
  //  });

   let request = $.ajax({
     url: "/videoList",
     method: "POST",
   })
   .done(function(data){
     let json = JSON.parse(data);
     console.log("data and status is", typeof json,json,status);
     for (let key in json) {
       $("#videoList").append( createVideoDiv(json,key));
     }
     $( "video" ).on("loadedmetadata",play);
   });


}

function createVideoDiv(json,key) {
  const div =  '<div class="video" > ' +
   '<video id="myVideo" preload="metadata" muted > ' +
  '<source src=' + json[key].file + ' type="video/mp4">' +
    'Your browser does not support the video tag.' +
  '</video>' +
  '</div>' ;

   return div
}

function openVideo() {
  console.log("video has been clicked");
  // const vid = $(this).get(0);

  const source = $(this).find("source").prop("src");
  const sourceArray = source.split(/[\/\.]/);
  if(sourceArray.slice(-1)[0]=== "mp4") {
    switch(sourceArray.slice(-2)[0]){
      case "20210517_194126":
          location.href = "fountain";
          break;
      case "20221117_125047":
          location.href = "bird";
          break;
      default:
          break;

    }


  }


}

function play()
{
  console.log("play function fired");
  const vid = $(this)[0];

  if (vid.readyState >=2) {
    console.log("video element in readystate");
  }
  if(vid.canplay){
  vid.play();
}
}
