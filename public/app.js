// Front End logic for the application

// Container for the frontend application
var app = {};

// Config
app.config = {
  'sessionToken': false
};

// AJAX client for the RESTful API
app.client = {}

// Interface for making API calls
app.client.request = function(headers, path, method, queryStringObject, payload, callback) {
  var headers = typeof(headers) == 'object' && headers != null ? headers : {};
  var path = typeof(path) == 'string' ? path : '/';
  var method = typeof(method) == 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : '';
  var queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject != null ? queryStringObject : {};
  var payload = typeof(payload) == 'object' && payload != null ? payload : {};
  var callback = typeof(callback) == 'function' ? callback : false;

  // For each query string parameter sent, add it to the path
  var requestUrl = path + '?';
  var counter = 0;
  for (var queryKey in queryStringObject) {
    if (queryStringObject.hasOwnProperty(queryKey)) {
      counter++;
      // If at least one query string parameter has been added, prepend each parameter with ampersand
      if (counter > 1) {
        requestUrl += '&';
      }
      // Add the key and the value
      requestUrl += queryKey + '=' + queryStringObject[queryKey];
    }
  }

  // Form the HTTP request as a JSON type
  var xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // For each of the headers sent, add it to the request one by one
  for (var headerKey in headers) {
    if (headers.hasOwnProperty(headerKey)) {
      xhr.setRequestHeader(headerKey, headers[headerKey]);
    };
  }

  // If there is a session token, add that as a heaer too
  if (app.config.sessionToken) {
     xhr.setRequestHeader('token', app.config.sessionToken.id);
  }

  // When the request comes back, handle the response
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var statusCode = xhr.status;
      var response = xhr.responseText;

      // callback if requested
      if (callback) {
        try {
          var parsedResponse = JSON.parse(response);
          callback(statusCode, parsedResponse);
        } catch(e) {
          callback(statusCode, false);
        }
      }
    }
  }

  // Send the payload as JSON
  var payloadString = JSON.stringify(payload);
  xhr.send(payloadString);
}
 