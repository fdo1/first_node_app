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
// @TODO Only let authenticatd users acces their user object
handlers._users.get = function(data, callback) {
  // Check that the phone number provided is valid
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 10 ? data.queryStringObject.phone : false;
  if(phone) {
    _data.read('users', phone, function(error, data) {
      if(!error && data) {
        // Remove the hashedPassword from the user object before showing it to the requester
        delete data.hashedPassword;
        callback(200, data);
      } else {
        callback(404)
      }
    })
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}
// Users - put
// Required data: User's phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO Only let authenticated user update their own object
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
      callback(400, { 'Error': 'Missing fields to update' });
    }
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}
// Users - delete
// Required data: phone
// @TODO Only let authenticated users delete their own object
// @TODO Cleanup any other data files associated with this user
handlers._users.delete = function(data, callback) {
  // Check that the phone number is valid
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 10 ? data.queryStringObject.phone : false;
  if(phone) {
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
    })
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}

// Define the Not Found handler
handlers.notFound = function(data, callback){
  callback(404); // Doesn't need a payload
};

// Export handlers
module.exports = handlers;