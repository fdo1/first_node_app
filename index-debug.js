// Dependencies

var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

// Declare the app
var app = {};

// Initialize the app
app.init = function() {
  // Start the server 
  debugger;
  server.init();
  debugger;
  
  debugger;
  // Start workers
  workers.init();
  debugger;
  
  debugger;
  // Start the CLI
  setTimeout(function(){
    cli.init();
    debugger;
  });
  debugger;
  
  debugger;
  var foo = 1;
  console.log('Just assigned 1 to foo');
  debugger;

  foo++;
  console.log('Just incremented foo by 1');
  debugger;
  
  foo = foo * foo;
  console.log('Just squared foo');
  debugger;


  foo = foo.toString();
  console.log('Just converted foo to string');
  debugger;

  // Call the script that will throw an error
  exampleDebuggingProblem.init();
  console.log('Just called the library');
  debugger;
};

// Execute
app.init();

// Export the app
module.exports = app;