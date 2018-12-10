// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

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

  // Get the payload, if any
  var decoder = new StringDecoder('UTF-8');
  var buffer = '';
  request.on('data', function(data){
    buffer += decoder.write(data);
  });
  request.on('end', function(){
    buffer += decoder.end();
    // Send the response
    response.end('Hello World!');

    // Log the request path
    console.log('Request received with this payload: ', buffer);
  });


});

// Start the server and have it listen on port 3000

server.listen(3000, function(){
  console.log('The server is listening on port 3000 now');
});