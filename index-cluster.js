// Dependencies

var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var cluster = require('cluster');
var os = require('os');

// Declare the app
var app = {};

// Initialize the app
app.init = function(callback) {

  // If we're on the master thread, start the background workers and the CLI
  if (cluster.isMaster){
    // Start workers
    workers.init();
    
    // Start the CLI
    setTimeout(function(){
      cli.init();
      callback();
    });

    // Manually fork the process
    for(var i = 0; i < os.cpus().length; i++){
      cluster.fork();
    }

  } else {
    // If we're not on the master thread, start HTTP server
    server.init();
  }
};

// Self-invoking only if required directy
if (require.main === module){
  app.init(function(){});
}

// Export the app
module.exports = app;