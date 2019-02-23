// This library demonstrates something throwing when its init is called


var example = {};


// INit function
example.init = function(){
  // This is an error created intentionally (bar is not defined);
  var foo = bar;
}


module.exports = example;