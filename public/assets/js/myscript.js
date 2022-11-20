
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
       src = $("video source").prop("src");
       getComments();
        $( "#delete_update_comments_div" ).on("customEvent",function(){
          console.log("customEvent triggered");
        });
       $( "#delete_update_comments_div" ).on("submit",".delete_update_comments_form",bindForm);
       $( "#delete_update_comments_div" ).on("keyup keydown focus",'textarea',resize);
       $( ".insert_comment_form" ).on("keyup keydown focus",'textarea',resize);
       $("#delete_update_comments_div" ).trigger("customEvent");

});

$(function(){

  $(".insert_comment_form").submit(function (e){
    e.preventDefault();
    let formdata = $("#comment").val();
    console.log("formdata is:",formdata);
     const pattern = /\w/;
     if(!pattern.test(formdata)){
       console.log("validation failed");
       return false;
     }

    $.post('/',
    {"type":"insert","comment": formdata, "src": src},
    function(data,status){
      console.log("response from submit form is",data,status);
      if(status ==='nocontent'){
        $("#comment").val('');
        $("#delete_update_comments_div").empty();
        getComments();
      }
    });
  });
});

function getComments(){
  $.post( '/',
       {"type":"get", "src": src},
       function(data, status){
        console.log("data and status is", data,status);
       if(status==='success'){
         let json = JSON.parse(data);
         console.log("data and status is", typeof json,json,status);
         for (let key in json) {
           $("#delete_update_comments_div").append( createForm(json,key));
         }
       } else {
         console.log("this is error in get request",data,status);
       }
   });

}

function createForm(json,key) {
  const form = ' <form class="delete_update_comments_form">' +
  ' <input type="text" value="' + json[key]._id +   '" class="displaynone">' +
  ' <button type="submit" value="update"><i class="fa-solid fa-pen-to-square"></i></button>' +
  ' <button type="submit" value="delete"><i class="fa-solid fa-trash"></i></button>' +
  ' <textarea>' + json[key].comment + '</textarea>' +
  ' </form>';

   return form;
}

// form added dynamically doesn't work. Delegate to the nearest static
function bindForm(e){
    console.log("binding form to the dom");
      e.preventDefault();
      const thisForm = $(this);
      const activeElementVal = $(document.activeElement).val();
      console.log("active element is:", activeElementVal);
      const children = $(this).children();
      console.log("first and second are:",$(children[0]).val(),$(children[3]).val());
      if(activeElementVal === "delete"){
        $.post("/",
        {"type":"delete", "_id": $(children[0]).val()},
        function(data,status){
          console.log("response from submit form is",data,status);
          if(status ==="nocontent"){
            // $(thisForm).hide();
            $(thisForm).text("comment has been deleted");
            $(thisForm).css({backgroundColor: "grey",padding: "1em 0", border:" 2px solid black"});
          }
        });
      } else {
        $.post("/",
        {"type":"update", "_id": $(children[0]).val(), "comment": $(children[3]).val()},
        function(data,status){
          console.log("response from submit form is",data,status);
          if(status ==="nocontent"){
            $(thisForm.find("input:text")[1]).css("background-color","yellow");
          }
        });
      }

}

function resize() {
  console.log("in resize textarea");
  const scrollHeight =$(this).prop('scrollHeight');
  const padding = $(this).innerHeight() - $(this).height();
  const newInnerHeight = scrollHeight- padding;
  $(this).height(newInnerHeight);

}
