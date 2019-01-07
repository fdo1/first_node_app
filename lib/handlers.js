// Request handlers (for the router)

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');

// Define the handlers
var handlers = {};

handlers.ping = function(data, callback) {
  callback(200);
}

handlers.users = function(data, callback) {
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
}

// Container for the user's submethods
handlers._users = {}

// Uses - post
// Required data: firstName, lastName, phone, password, tosAgreement
handlers._users.post = function(data, callback) {
  // Check that all required fields are filled out
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

  if(firstName && lastName && phone && password && tosAgreement) {
    // Make sure that the user doesn't already exist
    _data.read('users', phone, function(error, data) {
      if(error) {
        // Hash the password
        var hashedPassword = helpers.hash(password);

        if(hashedPassword) {
          // Create the use object
          var userObject = {
            'firstName': firstName,
            'lastName': lastName,
            'phone': phone,
            'hashedPassword': hashedPassword,
            'tosAgreement': true
          };
  
          // Store the user
          _data.create('users', phone, userObject, function(error) {
            if(!error) {
              callback(200);
            } else {
              console.log(error);
              callback(500, { 'Error': 'Could not create new user' });
            }
          });
        } else {
          callback(500, { 'Error': "Could not hash the user's password" });
        }

      } else {
        // User already exists
        callback(400, { 'Error': 'A user with that phone number already exists' });
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required fields' + (firstName, lastName, phone, password, tosAgreement) });
 }
}
// Users -get
// Required data
handlers._users.get = function(data, callback) {
  // Check that the phone number provided is valid
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 10 ? data.queryStringObject.phone : false;
  if(phone) {
    // Get the token from the headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
      if(tokenIsValid) {
        _data.read('users', phone, function(error, data) {
          if(!error && data) {
            // Remove the hashedPassword from the user object before showing it to the requester
            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404)
          }
        });
      } else {
        callback(403, { 'Error': 'Missing required token in header, or token is invalid' });
      }     
    });
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}
// Users - put
// Required data: User's phone
// Optional data: firstName, lastName, password (at least one must be specified)
handlers._users.put = function(data, callback) {
  // Check for the required field
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.length == 10 ? data.payload.phone : false;

  // Check for the optional fields
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  if (phone) {
    // Error if nothing is sent to update
    if(firstName || lastName || password) {
      // Get the token from the headers
      var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

      handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
        if(tokenIsValid) {
          // Lookup the user
          _data.read('users', phone, function(error, userData) {
            if(!error && userData) {
              if(firstName) {
                userData.firstName = firstName;
              }
              if(lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = helpers.hash(password);
              }
              _data.update('users', phone, userData, function(error) {
                if(!error) {
                  callback(200);
                } else {
                  callback(500, { 'Error': 'Could not update the user ' });
                }
              });
            } else {
              callback(400, { 'Error': 'The specified user does not exist' });
            }
          });
        } else {
          callback(403, { 'Error': 'Missing required token in header, or token is invalid' });
        }
      });
    } else {
      callback(400, { 'Error': 'Missing fields to update' });
    }
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}
// Users - delete
// Required data: phone
// @TODO Cleanup any other data files associated with this user
handlers._users.delete = function(data, callback) {
  // Check that the phone number is valid
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 10 ? data.queryStringObject.phone : false;
  if(phone) {
    // Get the token from the headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
      if(tokenIsValid) {
        _data.read('users', phone, function(error, data) {
          if(!error && data) {
            _data.delete('users', phone, function(error) {
              if(!error) {
                callback(200);
              } else {
                callback(500, { 'Error': 'Could not delete the specified user' });
              }
            });
          } else {
            callback(400, { 'Error': 'Could not find specified user' });
          }
        });
      } else {
        callback(403, { 'Error': 'Missing required token in header, or token is invalid' });
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}

// Define the Not Found handler
handlers.notFound = function(data, callback){
  callback(404); // Doesn't need a payload
};



// Tokens Handler

handlers.tokens = function(data, callback) {
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
}

// Container for the tokens method
handlers._tokens = {}

// Required data: phone, password
handlers._tokens.post = function(data, callback) {
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  if(phone && password) {
    // Lookup the user that matches that phone number
    _data.read('users', phone, function(error, userData) {
      if(!error && userData) {
        // Hash the sent password and compare it to the password stored in the user object
        var hashedPassword = helpers.hash(password);
        if(hashedPassword == userData.hashedPassword) {
          // If valid, create a new token with a random name. Set expiration date 1 hour in the future
          var tokenId = helpers.createRandomString(20);
          var expires = Date.now() + 1000 * 60 * 60;

          var tokenObject = {
            'phone': phone,
            'id': tokenId,
            'expires': expires
          }
          _data.create('tokens', tokenId, tokenObject, function(error) {
            if(!error) {
              callback(200, tokenObject);
            } else {
              callback(500, { 'Error': 'Could not create token object' });
            }
          });
        } else {
          callback(400, { 'Error': 'Password did not match the specified user stored password' });
        }
      } else {
        callback(400, { 'Error': 'Could not find user data' });
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required field(s)' });
  }
}

// Tokens - GET
// Required data: id
handlers._tokens.get = function(data, callback) {
  // Check that the id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id : false;
  if(id) {
    _data.read('tokens', id, function(error, tokenData) {
      if(!error && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404)
      }
    })
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}

// Tokens - PUT
// Required data: id, extend
handlers._tokens.put = function(data, callback) {
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
  if(id && extend) {
    // Lookup the token
    _data.read('tokens', id, function(error, tokenData) {
      if(!error && tokenData) {
        // Make sure the token isn't expired
        if(tokenData.expires > Date.now()) {
          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;

          // Store the new updates
          _data.update('tokens', id, tokenData, function(error) {
            if(!error) {
              callback(200);
            } else {
              callback(500, { 'Error': 'Could not update the token\'s expiration' });
            }
          })
        } else {
          callback(400, { 'Error': 'The token has already expried and cannot be extended' });
        }
      } else {
        callback(400, { 'Error': 'Specified token does not exist' });
      }
    });
  } else {
    callback(404, { 'Error': 'Missing required fields or fields are invalid' });
  }
}

// Tokens - DELETE
// Required data: id
handlers._tokens.delete = function(data, callback) {
  // Check that ID is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id : false;
  if(id) {
    // Lookup the token
    _data.read('tokens', id, function(error, data) {
      if(!error && data) {
        _data.delete('tokens', id, function(error) {
          if(!error) {
            callback(200);
          } else {
            callback(500, { 'Error': 'Could not delete the specified token' });
          }
        });
      } else {
        callback(400, { 'Error': 'Could not find the specified token' });
      }
    });
  } else {
    callbakc(400, { 'Error': 'Missing required field' });
  }
}


// Verify if a given token ID is currently valid for a given user
handlers._tokens.verifyToken = function(id, phone, callback) {
  // Lookup the token
  _data.read('tokens', id, function(error, tokenData){
    if(!error && tokenData) {
      // Check that the token is for the given user and hasn't expired
      if(tokenData.phone == phone && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
}


// Export handlers
module.exports = handlers;