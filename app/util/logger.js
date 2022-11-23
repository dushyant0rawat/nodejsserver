
const DEBUG = true;
//immediately invoked function expression
exports.console_log = (function(debug) {

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
