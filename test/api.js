// API Tests

// Dependencies
var app = require('./../index');
var assert = require('assert');
var http = require('http'); 
var config = require('./../lib/config');

// Holder for the test
var api = {};

var helpers = {};
helpers.makeGetRequest = function(path, callback){
  // Configure the request details
  var requestDetails = {
    'protocol': 'http:',
    'hostname': 'localshot',
    'port': config.httpPort,
    'method': 'GET',
    'path': path,
    'headers': {
      'Content-Type': 'application/json'
    }
  };
  // Send the request
  var req = http.request(requestDetails, function(res){
    callback(res);
  });
  req.end();
};

// The main init function should be able to run without throwing
api['app.init should start without throwing'] = function(done){
  assert.doesNotThrow(function(){
    app.init(function(err){
      done();
    });
  });
};

// Make a request to PING
api['/ping should response to GET with 200'] = function(){
  helpers.makeGetRequest('/ping', function(res){
    assert.equal(res.statusCode, 200);
    done();
  });
};

// Make a request to /api/users
api['/api/users should response to GET with 400'] = function(){
  helpers.makeGetRequest('/api/users', function(res){
    assert.equal(res.statusCode, 400);
    done();
  });
};

// Make a request to a random path
api['A random path should response to GET with 404'] = function(){
  helpers.makeGetRequest('/this/path', function(res){
    assert.equal(res.statusCode, 404);
    done();
  });
};

module.exports = api;
