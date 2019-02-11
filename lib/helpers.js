// Helpers for various tasks

// Dependencies
var crypto = require('crypto');
var config = require('./config');
var https = require('https');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');

// Container for all helpers
var helpers =  {};

// Create a SHA256 hash
helpers.hash = function(str) {
  if(typeof(str) == 'string' && str.length > 0) {
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
}

// Parse a JSON string in all cases without throwing
helpers.parseJsonToObject = function(str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch(e) {
    return {};
  }
}

// Create a string of random alphanumeric characters of a given length
helpers.createRandomString = function(strLength) {
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength) {
    // Define possible characters in a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var str = '';

    for(i = 1; i <= strLength; i++) {
      // Get random character from the possible characters
      var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      // Append this character to the final string
      str+=randomCharacter;
    }

    // Return the final string
    return str;
  } else {
    return false;
  }
}

// Send an SMS message via Twilio
helpers.sendTwilioSms = function(phone, message, callback) {
  // Validate the paramters
  phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone : false;
  message = typeof(message) == 'string' && message.trim().length > 0 && message.trim().length <= 1600 ? message.trim() : false

  if(phone && message) {
    // Configure the request payload to send to Twilio
    var payload = {
      'From': config.twilio.fromPhone,
      'To': '+52' + phone,
      'Body': message
    }
    // Stringify the payload
    var stringPayload = querystring.stringify(payload);

    // Configure the request details
    var requestDetails = {
      'protocol': 'https:',
      'hostname': 'api.twilio.com',
      'method': 'POST',
      'path': '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
      'auth': config.twilio.accountSid +':'+ config.twilio.authToken,
      'header': {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    }
    // Instantiate the request object
    // This happens when the request comes back
    var req = https.request(requestDetails, function(response) {
      // Grab the status of the sent request
      var status = response.statusCode;
      // Callback successfully if the request went through
      if(status == 200 || status == 201) {
        callback(false)
      } else {
        callback('Status code returned was: ', + status);
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', function(e) {
      callback(e);
    });

    // Add payload to request
    req.write(stringPayload);

    // End the request - Send it off
    req.end()


  } else {
    callback('Given parameters are missing or invalid');
  }
}

// Get the string content of a template
helpers.getTemplate = function(templateName, data, callback) {
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
  if (templateName) {
    var templatedDir = path.join(__dirname, '/../templates/');
    // console.log([error, str, str.length ]);
    fs.readFile(templatedDir + templateName + '.html', 'utf8', function(error, str) {
      if (!error && str && str.length > 0) {
        // Do the interpolation on the string
        var finalStr = helpers.interpolate(str, data);
        callback(false, finalStr);
      } else {
        callback('No template could be found');
      }
    });
  } else {
    callback('A valid template name was not specified');
  }
}

// Add the universal header and footer to a string and pass the provided data object to the
// footer and header for interpolation
helpers.addUniversalTemplates = function(str, data, callback) {
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data != null ? data : {};

  // Get the Header
  helpers.getTemplate('_header', data, function(error, headerString) {
    if (!error && headerString) {
      helpers.getTemplate('_footer', data, function(error, footerString) {
        if (!error && footerString) {
          // Concatenate the 3 strings together
          var fullString = headerString + str + footerString;
          callback(false, fullString);
        } else {
          callback('Could not find the footer template');
        }
      });
    } else {
      callback('Could not find the header template');
    }
  });
}


// Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = function(str, data) {
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data != null ? data : {};

  // Add the template Globals to the data object prepending the key name with "global"
  for(var keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data['global.' + keyName] = config.templateGlobals[keyName];
    }
  }

  // For each key in the data object insert its value into the string at the corresponding placeholder
  for(var key in data) {
    if (data.hasOwnProperty(key) && typeof(data[key]) ==  'string') {
      var replace = data[key];
      var find = '{' + key + '}';
      str = str.replace(find, replace);
    }
  }

  return str;
}

// Get the contents of a static public asset
helpers.getStaticAsset = function(fileName, callback) {
  var fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;

  if (fileName) {
    var publicDir = path.join(__dirname, '/../public/');
    fs.readFile(publicDir + fileName, function(error, data) {
      if (!error && data) {
        callback(false, data);
      } else {
        callback('No file could be found');
      }
    })
  } else {
    callback('A valid filename was not specified');
  }
}

// Export helpers
module.exports = helpers;