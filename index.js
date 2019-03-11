// Dependencies

var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');

// Declare the app
var app = {};

// Initialize the app
app.init = function(callback) {
  // Start the server 
  server.init();

  // Start workers
  workers.init();

  // Start the CLI
  setTimeout(function(){
    cli.init();
    callback();
  });
};

// Self-invoking only if required directy
if (require.main === module){
  app.init(function(){});
}

// Export the app
module.exports = app;