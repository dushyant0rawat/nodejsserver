
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
       console.log("width and height are",screen.width,screen.height);
        $( "#videoList" ).on("click","video",openVideo);
        $( "#videoList" ).on("customevent loadeddata loadedmetadata play pause","video",play);
        getVideoList();

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
     url: "/videoList.js",
     method: "POST",
   })
   .done(function(data){
     let json = JSON.parse(data);
     console.log("data and status is", typeof json,json,status);
     for (let key in json) {
       $("#videoList").append( createVideoDiv(json,key));
     }
     $("video").trigger("customevent");

   });


}

function createVideoDiv(json,key) {
  const div =  '<div> ' +
   '<video preload="metadata" muted> ' +
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
    location.href = sourceArray.slice(-2)[0];
  }


}

// Category: Event Object
// jQuery's event system normalizes the event object according to W3C standards. The event object is guaranteed to be passed to the event handler.

function play(e)
{
  console.log("play function fired","event object is",e);
  const vid = $(this)[0];

  console.log("video element in readystate","rs:",vid.readyState,"canplay",vid.canPlayType('video/mp4'));
  // vid.play();

}
