// Dependencies
var http = require('http');
var url = require('url');

// The server should to all requests with a string
var server = http.createServer(function(request, response){
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

  // Send the response
  response.end('Hello World!');

  // Log the request path
  console.log('Request received with these headers: ', headers);

});

// Start the server and have it listen on port 3000

server.listen(3000, function(){
  console.log('The server is listening on port 3000 now');
});