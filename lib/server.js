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
var util = require('util');
var debug = util.debuglog('server');

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
    var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ?
      server.router[trimmedPath] : handlers.notFound;
    chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;
    

    // Construct the data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': helpers.parseJsonToObject(buffer)
    };

    // Route the request to the handler specified in the handler
    try {
      chosenHandler(data, function(statusCode, payload, contentType){
        server.processHandlerResponse(response, method, trimmedPath, statusCode, payload, contentType);
      });
    } catch (e) {
      debug(e);
      server.processHandlerResponse(response, method, trimmedPath, 500, {'Error': 'An unkown error has occured'}, 'json');
    }

  });
}

// Process the response from the handler
server.processHandlerResponse =  function(response, method, trimmedPath, statusCode, payload, contentType){
  // Determine the type of response (default to JSON)
  contentType = typeof(contentType) == 'string' ? contentType : 'json';

  // Use the status code called back by the handler, or default to 200
  statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
  debug(payload);
  
  // Return the response parts that are content-specific
  var payloadString = '';
  if (contentType == 'json') {
    response.setHeader('Content-Type', 'application/json');
    // Use the payload called back by the handler, or default to an empty object
    payload = typeof(payload) == 'object' ? payload : {};
    // Convert the payload to string
    var payloadString = JSON.stringify(payload);
  }
  if (contentType == 'html') {
    response.setHeader('Content-Type', 'text/html');
    payloadString = typeof(payload) == 'string' ? payload : '';
  }
  if (contentType == 'favicon') {
    response.setHeader('Content-Type', 'image/x-icon');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }
  if (contentType == 'css') {
    response.setHeader('Content-Type', 'text/css');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }
  if (contentType == 'png') {
    response.setHeader('Content-Type', 'image/png');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }
  if (contentType == 'plain') {
    response.setHeader('Content-Type', 'text/plain');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }

  // Return the response parts that are common to all content types
  response.writeHead(statusCode);
  response.end(payloadString);

  // If the response is 200 print green. Otherwise print red
  if (statusCode == 200) {
    debug('\x1b[32m%s\x1b[0m', method.toUpperCase()+ '/' + trimmedPath + ' ' + statusCode);
  } else {
    debug('\x1b[31m%s\x1b[0m', method.toUpperCase()+ '/' + trimmedPath + ' ' + statusCode);
  }
};
 
// Define a request router
server.router = {
  '' : handlers.index,
  'account/create': handlers.accountCreate,
  'account/edit' : handlers.accountEdit,
  'account/deleted' : handlers.accounDeleted,
  'session/create' : handlers.sessionCreate,
  'session/deleted' : handlers.sessionDeleted,
  'checks/all' : handlers.checksList,
  'checks/create' : handlers.checksCreate,
  'checks/edit' : handlers.checksEdit,
  'ping': handlers.ping,
  'api/users': handlers.users,
  'api/tokens': handlers.tokens,
  'api/checks': handlers.checks,
  'favicon.ico': handlers.favicon,
  'public': handlers.public,
  'examples/error': handlers.exampleError
}

// Init the server
server.init = function() {
  // Start the HTTP server and have it listen on port 3000
  server.httpServer.listen(config.httpPort, function(){
    console.log('\x1b[36m%s\x1b[0m', 'The server is listening on port ' + config.httpPort);
  });

  // Start the HTTPS serfver
  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, function(){
    console.log('\x1b[35m%s\x1b[0m', 'The server is listening on port ' + config.httpsPort);
  });

}

// Export the server
module.exports = server;