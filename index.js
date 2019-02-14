// Dependencies

var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');

// Declare the app
var app = {};

// Initialize the app
app.init = function() {
  // Start the server 
  server.init();

  // Start workers
  workers.init();

  // Start the CLI
  setTimeout(function(){
    cli.init();
  });
};

// Execute
app.init();

// Export the app
module.exports = app;