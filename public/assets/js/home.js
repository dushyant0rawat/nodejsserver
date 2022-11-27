
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
  $( "#videoList" ).on("click","video",openVideo);
  /* https://www.w3.org/2010/05/video/mediaevents.html
  helps to undertands how video are fired */

  /*triggered customevent because video events (loadeddata loadedmetadata play pause) are not triggered for some reason
  */
  $( "#videoList" ).on("customevent","video",play);
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
    // $("video").trigger("play");
   });
}

function createVideoDiv(json,key) {
  const div =  `<div>
  <video playsinline muted>
  <source src="${json[key].file}"  type="video/mp4">
  'Your browser does not support the video tag.'
  </video>
  </div>` ;

  return div
}

function openVideo() {
  console.log("video has been clicked");
  // const vid = $(this).get(0);

  const source = $(this).find("source").prop("src");
  const sourceArray = source.split(/[\/\.]/);
  if(sourceArray.slice(-1)[0]=== "mp4") {
    location.href = "?v=" + sourceArray.slice(-2)[0];
  }
}

// Category: Event Object
// jQuery's event system normalizes the event object according to W3C standards. The event object is guaranteed to be passed to the event handler.
// playsinline is required on video for iphone otherwise blank poster will show up
// call play on the video to show video on iphone
/*ref: https://developer.chrome.com/blog/play-request-was-interrupted/ helped resolve the issue
  Uncaught (in promise) DOMException: The play() request was interrupted by a call to pause()
  play() returns promise */
function play(e) {
  console.log("play function","event object is",e);
  const vid = $(this)[0];
  console.log("video element in readystate","rs:",vid.readyState,"canplay",vid.canPlayType('video/mp4'),"paused",vid.paused);
  if(vid.paused){
    console.log("video playing",vid);
    vid.play()
    .then(() => {
      setTimeout(function(){
        if(vid.play){
          console.log("video paused",vid);
          vid.pause();
        }
      },1000);
    })
    .catch( () => {
      console.log("caught error in pausing video");
    });
  }
}

function pause(e) {
  console.log("pause function","event object is",e);
  const vid = $(this)[0];
  console.log("video element in readystate","rs:",vid.readyState,"canplay",vid.canPlayType('video/mp4'),"play",vid.play);
  if(vid.play){
    vid.pause();
  }
}

function load(e) {
  console.log("load function","event object is",e);
  const vid = $(this)[0];
  vid.load();
}
