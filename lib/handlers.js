// Request handlers (for the router)

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');
var config = require('./config');
var _url = require('url');
var dns = require('dns');
var _performance = require('perf_hooks').performance;
var util = require('util');
var debug = util.debuglog('performance');

// Define the handlers
var handlers = {};

/*
/*
/*
HTML Handlers
/*
/*
*/

// Index handlers
handlers.index = function(data, callback) {
  // Reject any request diiferent from a GET method
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Uptime Monitoring - Made simple',
      'head.description': 'We offer free simple uptime monitoring for HTTP/HTTPs sites of all kinds. When your site goes down, we\'ll send you a text to let you know.',
      'body.class': 'index'
    }

    // Read in the index template as a string
    helpers.getTemplate('index', templateData, function(error, str) {
      if (!error && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(error, str){
          if (!error && str) {
            // Return the page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
}

// Create Account
handlers.accountCreate = function(data, callback) {
  // Reject any request diiferent from a GET method
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Create Account',
      'head.description': 'Sign Up is easy and only takes a few seconds',
      'body.class': 'index'
    }

    // Read in the index template as a string
    helpers.getTemplate('accountCreate', templateData, function(error, str) {
      if (!error && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(error, str){
          if (!error && str) {
            // Return the page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
}

// Create New Session
handlers.sessionCreate = function(data, callback) {
  // Reject any request diiferent from a GET method
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Log In to your account',
      'head.description': 'Please enter your phone number and password to access your account',
      'body.class': 'sessionCreate'
    }

    // Read in the template as a string
    helpers.getTemplate('sessionCreate', templateData, function(error, str) {
      if (!error && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(error, str){
          if (!error && str) {
            // Return the page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
}

// Delete Session
handlers.sessionDeleted = function(data, callback) {
  // Reject any request diiferent from a GET method
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Logged Out',
      'head.description': 'You have been logged out of your account',
      'body.class': 'sessionDeleted'
    }

    // Read in the template as a string
    helpers.getTemplate('sessionDeleted', templateData, function(error, str) {
      if (!error && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(error, str){
          if (!error && str) {
            // Return the page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
}

// Edit Account
handlers.accountEdit = function(data, callback) {
  // Reject any request diiferent from a GET method
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Account Settings',
      'body.class': 'accountEdit'
    }

    // Read in the template as a string
    helpers.getTemplate('accountEdit', templateData, function(error, str) {
      if (!error && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(error, str){
          if (!error && str) {
            // Return the page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
}

// Account has been deleted
handlers.accountDeleted = function(data, callback) {
  // Reject any request diiferent from a GET method
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Account Deleted',
      'head.description': 'Your account has been deleted',
      'body.class': 'accountDeleted'
    }

    // Read in the template as a string
    helpers.getTemplate('accountDeleted', templateData, function(error, str) {
      if (!error && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(error, str){
          if (!error && str) {
            // Return the page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
}

// Create a new check
handlers.checksCreate = function(data, callback) {
  // Reject any request diiferent from a GET method
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Create a new check',
      'body.class': 'checksCreate'
    }

    // Read in the template as a string
    helpers.getTemplate('checksCreate', templateData, function(error, str) {
      if (!error && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(error, str){
          if (!error && str) {
            // Return the page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
}

// Dasbhoard (view all checks)
handlers.checksList = function(data, callback) {
  // Reject any request diiferent from a GET method
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Create a new check',
      'body.class': 'checksList'
    }

    // Read in the template as a string
    helpers.getTemplate('checksList', templateData, function(error, str) {
      if (!error && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(error, str){
          if (!error && str) {
            // Return the page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
}

// Edit a Check
handlers.checksEdit = function(data, callback) {
  // Reject any request diiferent from a GET method
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Check Details',
      'body.class': 'checksEdit'
    }

    // Read in the template as a string
    helpers.getTemplate('checksEdit', templateData, function(error, str) {
      if (!error && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(error, str){
          if (!error && str) {
            // Return the page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
}

// Favicon Handler
handlers.favicon = function(data, callback) {
  if (data.method == 'get') {
    // Read in the favicon's data
    helpers.getStaticAsset('favicon.ico', function(error, data) {
      if (!error && data) {
        callback(200, data, 'favicon');
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
}

// Public Assets handler
handlers.public = function(data, callback) {
  if (data.method == 'get') {
    // Get the filename being requested
    var trimmedAssetName = data.trimmedPath.replace('public/', '').trim();

    if (trimmedAssetName.length > 0) {
      helpers.getStaticAsset(trimmedAssetName, function(error, data) {
        if (!error && data) {
          // Determine the content type
          var contentType = 'plain';
          if (trimmedAssetName.indexOf('.css') > -1) {
            contentType = 'css';
          }
          if (trimmedAssetName.indexOf('.png') > -1) {
            contentType = 'png';
          }
          if (trimmedAssetName.indexOf('.jpg') > -1) {
            contentType = 'jpg';
          }
          if (trimmedAssetName.indexOf('.ico') > -1) {
            contentType = 'favicon';
          }
          
          // Callback the data
          callback(200, data, contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(405);
    }
  } else {
    callback(405);
  }
}
 


/*
/*
/* JSON API Handlers
/*
/*
*/

handlers.ping = function(data, callback) {
  callback(200);
}

handlers.exampleError = function(data, callback){
  var error = new Error('This is an example error');
  throw(error);
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
                // Delete each of the checks associated with the user
                console.log('Ready to delete');
                var userChecks = typeof(data.checks) == 'object' && data.checks instanceof Array ? data.checks : false;
                console.log('Users checks', userChecks);
                var checksToDelete = userChecks.length;
                if(checksToDelete > 0) {
                  var checksDeleted = 0;
                  var deletionErrors = false;

                  // Loop through the checks
                  userChecks.forEach(function(check) {
                    // Delete the check
                    _data.delete('checks', check, function(error) {
                      if(error) {
                        deletionErrors = true;
                      }
                      checksDeleted++;
                      if(checksDeleted == checksToDelete) {
                        if(!deletionErrors) {
                          callback(200, 'The user had some checks!');
                        } else {
                          callback(500, { 'Error': 'Errors encountered while attempting to delte the users checks' });
                        }
                      }
                    });
                  });
                } else {
                  callback(200, 'User is free of checks!');
                }
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
  _performance.mark('entered function');
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  _performance.mark('inputs validated');
  if(phone && password) {
    // Lookup the user that matches that phone number
    _performance.mark('beginning users lookup');
    _data.read('users', phone, function(error, userData) {
      _performance.mark('user lookup complete');
      if(!error && userData) {
        // Hash the sent password and compare it to the password stored in the user object
        _performance.mark('beginning password hashing');
        var hashedPassword = helpers.hash(password);
        _performance.mark('password hashing complete');
        if(hashedPassword == userData.hashedPassword) {
          // If valid, create a new token with a random name. Set expiration date 1 hour in the future
          _performance.mark('creating data for the token');
          var tokenId = helpers.createRandomString(20);
          _performance.mark('creating data for token');
          var expires = Date.now() + 1000 * 60 * 60;
          
          var tokenObject = {
            'phone': phone,
            'id': tokenId,
            'expires': expires
          }
          _performance.mark('beginning storing token');
          _data.create('tokens', tokenId, tokenObject, function(error) {
            _performance.mark('storing token complete');
            // Gather all measurements
            _performance.measure('Beginning to End', 'entered function', 'storing token complete');
            _performance.measure('Validating user input', 'entered function', 'inputs validated');
            _performance.measure('User lookup', 'beginning user lookup', 'user lookup complete');
            _performance.measure('Password has', 'beginning password hashing', 'password hashing complete');
            _performance.measure('Token data creation', 'creating data for token', 'beginning storing token');
            // _performance.measure('Token storing', 'beginning storking token', 'storing token complete');

            // Log out all the measurements
            // var measurements = _performance.getEntriesByType('measure');
            // measurements.forEach(function(measurement){
            //   debug('\x1b[33m%s\x1b[0m', measurement.name + ' ' + measurement.duration);
            // });
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
    callback(400, { 'Error': 'Missing required field' });
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


// Checks
handlers.checks = function(data, callback) {
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._checks[data.method](data, callback);
  } else {
    callback(405);
  }
}

// Container for all the checks methods
handlers._checks = {};

// Checks - POST
// Required data: protocol, url, method, successCodes, timeoutSeconds
handlers._checks.post = function(data, callback){
  // Validate inputs
  var protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url : false;
  var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

  if(protocol && url && method && successCodes && timeoutSeconds) {
    // Get the token from the headers (Only "logged in" users should post a check)
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // Lookup the user by reading the token
    _data.read('tokens', token, function(error, tokenData) {
      if(!error && tokenData) {
        var userPhone = tokenData.phone;

        // Lookup the user data
        _data.read('users', userPhone, function(error, userData) {
          if(!error && userData) {
            var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
            // Verify that the user has fewer than the max-checks-per-user
            if(userChecks.length <= config.maxChecks) {
              // Verify that the URL given has DNS entries (and therefore can resolve)
              var parsedUrl = _url.parse(protocol + '://' + url, true);
              var hostname = typeof(parsedUrl.hostname) == 'string' && parsedUrl.hostname.length > 0 ? parsedUrl.hostname : false;
              dns.resolve(hostname, function(error, records){
                if (!error && records){
                  // Create a random ID for the check
                  var checkId = helpers.createRandomString(20);
    
                  // Create the check object and include the user's phone
                  var checkObject = {
                    'id': checkId,
                    'userPhone': userPhone,
                    'protocol': protocol,
                    'url': url,
                    'method': method,
                    'successCodes': successCodes,
                    'timeoutSeconds': timeoutSeconds
                  };
    
                  // Save object
                  _data.create('checks', checkId, checkObject, function(error) {
                    if(!error) {
                      // Add the check id to the users object
                      userData.checks = userChecks;
                      userData.checks.push(checkId);
    
                      // Save the user data
                      _data.update('users', userPhone, userData, function(error) {
                        if(!error) {
                          console.log(checkObject);
                          callback(200, checkObject);
                        } else {
                          callback(500, { 'Error': 'Could not update the user with the new check' });
                        }
                      });
                    } else {
                      callback(500, { 'Error': 'Could not create the new check'});
                    }
                  });
                } else {
                  callback(400, { 'Error': 'The hostname of the URL entered did not resolve to any DNS entries' });
                }
              });
            } else {
              callback(400, { 'Error': 'The user already has the maximum number of checks ('+config.maxChecks+')' });
            }
          } else {
            callback(403);
          }
        });
      } else {
        callback(403);
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required inputs or inputs are invalid' });
  }
}

// Checks - GET
// Required data: ID
handlers._checks.get = function(data, callback) {
  // Check that the phone number provided is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id) {
    // Lookup the check
    _data.read('checks', id, function(error, checkData){
      if (!error && checkData) {
        // Get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid and belongs to the user that created the check
        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
          if(tokenIsValid) {
            // Return the check data
            callback(200, checkData);
          } else {
            callback(403, { 'Error': 'Missing required token in header, or token is invalid' });
          }     
        });
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}

// Checks - PUT
// Required data: ID
// Optional data: protocol, url, method, successCodes, timeoutSeconds (1 must be sent)

handlers._checks.put = function(data, callback) {
  // Check for the required field
  var id = typeof(data.payload.id) == 'string' && data.payload.id.length == 20 ? data.payload.id : false;

  // Check for optional fields
  var protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url : false;
  var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

  if(id) {
    if(protocol || url || methdo || successCodes || timeoutSeconds) {
      // Lookup the check
      _data.read('checks', id, function(error, checkData){
        if(!error && checkData) {
          var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
          // Verify that the given token is valid and belongs to the user that created the check
          handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
            if(tokenIsValid) {
              // Update the check where necessary
              if(protocol) {
                checkData.protocol = protocol;
              }
              if(url) {
                checkData.url = url;
              }
              if(method) {
                checkData.method = method;
              }
              if(successCodes) {
                checkData.successCodes =successCodes
              }
              if(timeoutSeconds) {
                checkData.timeoutSeconds = timeoutSeconds;
              }

              // Store the new updates
              _data.update('checks', id, checkData, function(error){
                if(!error) {
                  callback(200);
                } else {
                  callback(500, { 'Error': 'Could not update the check' });
                }
              })

            } else {
              callback(403, { 'Error': 'Missing required token in header, or token is invalid' });
            }     
          });
        } else {
          callback(400, { 'Error': 'Check ID does not exist' });
        } 
      });
    } else {
      callback(400, { 'Error': 'Missing fields to update' });
    }
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}

// Checks - DELETE
// Required data: id
handlers._checks.delete = function(data, callback) {
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id : false;
  if(id) {
    // Lookup the check
    _data.read('checks', id, function(error, checkData) {
      if(!error && checkData) {
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    
        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
          if(tokenIsValid) {
            // Delete the check
            _data.delete('checks', id, function(error) {
              if(!error){ 
                _data.read('users', checkData.userPhone, function(error, userData) {
                  var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                  // Remove the deleted check from the user's checks
                  var checkPosition = userChecks.indexOf(id);
                  if(checkPosition > -1) {
                    // Remove the deleted check from the user's object
                    userChecks.splice(checkPosition, 1);

                    // Re-save the user's data
                    _data.update('users', checkData.userPhone, userData, function(error) {
                      if(!error) {
                        callback(200);
                      } else {
                        callback(500, { 'Error': 'Could not update the user' });
                      }
                    }); 
                  } else {
                    callback(500, { 'Error': 'Could not find the check on the users object so could not remove it' });
                  }
                  if(!error && userData) {
                  } else {
                    callback(500, { 'Error': 'Could not find user who created the check' });
                  }
                });
              } else {
                callback(500, { 'Error': 'Could not delete check data' });
              }
            });
          } else {
            callback(403, { 'Error': 'Missing required token in header, or token is invalid' });
          }
        });
      } else {
        callback(400, { 'Error': 'Specified check ID does not exist' });
      }
    });
        
    // Get the token from the headers
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}


// Export handlers
module.exports = handlers;