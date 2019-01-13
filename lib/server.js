// Server-related tasks

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var config = require('./config');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs'); // This is the File System
var _data = require('./data');
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');

// Instantiate the server object
var server = {};

// // @TODO get rid of this
// helpers.sendTwilioSms('5520673769', 'Hello', function(error) {
//   console.log(error);
// });

// Instantiate the HTTP server
server.httpServer = http.createServer(function(request, response){
  server.unifiedServer(request, response);
});

// Instantiate the HTTPS server
server.httpsServerOptions = {
  'key': fs.readFileSync(path.join(__dirname,  '/../https/key.pem')),
  'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
}

// Instantiate the HTTPS server
server.httpsServer = https.createServer(server.httpsServerOptions, function(request, response){
  server.unifiedServer(request, response);
});

// Server logic for the HTTP sever and the HTTPS server
server.unifiedServer = function(request, response) {
  // Get the URL and parse it
  var parsedUrl = url.parse(request.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = request.method.toLowerCase();

  // Get the headers as an object
  var headers = request.headers;

  // Get the payload, if any
  var decoder = new StringDecoder('UTF-8');
  var buffer = '';
  request.on('data', function(data){
    buffer += decoder.write(data);
  });
  request.on('end', function(){
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found, use the NotFound handler
    var choesenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ?
      server.router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': helpers.parseJsonToObject(buffer)
    };

    // Route the request to the handler specified in the handler
    choesenHandler(data, function(statusCode, payload){
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or default to an empty object
      console.log((payload));
      paylod = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to string
      var payloadString = JSON.stringify(payload);

      // Return the response
      response.setHeader('Content-Type', 'application/json');
      response.writeHead(statusCode);
      response.end(payloadString);

      // Log the request path
      console.log('Returning this response: ', statusCode, payloadString);
    });

  });
}


 
// Define a request router
server.router = {
  'ping': handlers.ping,
  'users': handlers.users,
  'tokens': handlers.tokens,
  'checks': handlers.checks
}

// Init the server
server.init = function() {
  // Start the HTTP server and have it listen on port 3000
  server.httpServer.listen(config.httpPort, function(){
    console.log('The server is listening on port ' + config.httpPort);
  });

  // Start the HTTPS serfver
  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, function(){
    console.log('The server is listening on port ' + config.httpsPort);
  });

}

// Export the server
module.exports = server;