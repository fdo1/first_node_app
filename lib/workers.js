// Worker-related tasks

// Dependencies
var path = require('path');
var fs = require('fs');
var _data = require('./data');
var https = require('https');
var http = require('http');
var helpers = require('./helpers');
var url = require('url');
var _logs = require('./logs');
var util = require('util');
var debug = util.debuglog('workers');

// Instantiate the worker object
var workers = {};

// Gather all checks
workers.gatherAllChecks = function() {
  // Get all the checks in the system
  _data.list('checks', function(error, checks) {
    if(!error && checks && checks.length > 0) {
      checks.forEach(function(check) {
        // Read in the check data
        _data.read('checks', check, function(error, originalCheckData) {
          if(!error && originalCheckData) {
            // Pass the data to the Check Validator, and let that function continue or log errors as needed
            workers.validateCheckData(originalCheckData);
          } else {
            debug('Error: Reading one of the check data');
          }
        });
      });
    } else {
      debug('Error: Could not find any checks to process');
    }
  });
}

// Sanity-check the check data
workers.validateCheckData = function(originalCheckData) {
  originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : {};
  originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id : false;
  originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone : false;
  originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
  originalCheckData.url = typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url : false;
  originalCheckData.method = typeof(originalCheckData.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
  originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
  originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 === 0
  && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;
  
  // Set the keys that may not have been set (if the workers haven't seen this check yet)
  originalCheckData.state  = typeof(originalCheckData.state) == 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state.trim() : 'down';
  originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;


  // If all the checks pass, pass the data to the next step in the process
  if(originalCheckData.id &&
    originalCheckData.userPhone &&
    originalCheckData.protocol &&
    originalCheckData.url &&
    originalCheckData.method &&
    originalCheckData.successCodes &&
    originalCheckData.timeoutSeconds
  ) {
    workers.performChecks(originalCheckData);
  } else {
    debug('Error: One of the checks is not properly formatted.')
  }
}

// Perform the check, send the original check data and the outcome of the check process to the next step
workers.performChecks = function(originalCheckData) {
  // Prepare the initial check outcome
  var checkOutcome = {
    'error': false,
    'responseCode': false
  };

  // Mark that the outcome has not been sent yet
  var outcomeSent = false;

  // Parse the hostname and the path from the original check data
  var parsedUrl = url.parse(originalCheckData.protocol + '://' + originalCheckData.url, true);
  var hostname = parsedUrl.hostname;
  var path = parsedUrl.path; // We use path instead of "pathname" because we need the complete path incluiding query string

  // Construct the request
  var requestDetails = {
    'protocol': originalCheckData.protocol + ':',
    'hostname': hostname,
    'method': originalCheckData.method.toUpperCase(),
    'path': path,
    'timeout': originalCheckData.timeoutSeconds * 1000
  };

  // Instantiate the request object using the HTTP or HTTPS module
  var _moduleToUse = originalCheckData.protocol == 'http' ? http : https;

  var request = _moduleToUse.request(requestDetails, function(response) {
    // Grab the status of the sent request
    var status = response.statusCode;

    // Update the check outcome and pass the data along
    checkOutcome.responseCode = status;
    if(!outcomeSent) {
      workers.prcocessCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // Bind to the error event so it doesn't get thrown
  request.on('error', function(error) {
    // Update the check outome and pass the data along
    checkOutcome.error = {
      'error': true,
      'value': error
    }

    if(!outcomeSent) {
      workers.prcocessCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // Bind to the timeout event
  request.on('timeout', function(error) {
    // Update the check outome and pass the data along
    checkOutcome.error = {
      'error': true,
      'value': 'timeout'
    }

    if(!outcomeSent) {
      workers.prcocessCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // Send the request
  request.end();
}

// Process the check outcome, update the check data and trigger an alert if needed
// Special logic for accomodating a check that has never been tested before (don't alert on that one)
workers.prcocessCheckOutcome = function(originalCheckData, checkOutcome) {
  // Decide if the check is considered up or down
  var state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

  // Decide if an alert is warranted
  var alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state;

  // Log the outcome
  var timeOfCheck = Date.now();
  workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);

  // Update the check data
  var newCheckData = originalCheckData;
  newCheckData.state = state;
  newCheckData.lastChecked = timeOfCheck;

  // Save updates to disk
  _data.update('checks', newCheckData.id, newCheckData, function(error) {
    if(!error) {
      // Send the new check data to the next phase in the process if needed
      if(alertWarranted) {
        debug('Alert warranted');
        workers.alertUserToStatusChange(newCheckData);
      } else {
        debug('Check outcome has not changed. No alert needed');
      }
    } else {
      debug('Error trying to save updates to one of the checks');
    }
  });
};

// Alert user about the changed status
workers.alertUserToStatusChange = function(newCheckData) {
  var msg = 'Alert! Your check for: ' + newCheckData.method.toUpperCase() + ' '
    + newCheckData.protocol + '://' + newCheckData.url + 'is currently' + newCheckData.state;
  
    helpers.sendTwilioSms(newCheckData.userPhone, msg, function(error) {
      if(!error) {
        debug('Success. User was alerted to a status change in their check via SMS', msg);
      } else {
        debug('Could not send SMS alert to user with state change in their check');
      }
    });
};

workers.log = function(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) {
  // Form the log data
  var logData = {
    'check': originalCheckData,
    'outcome': checkOutcome,
    'state': state,
    'alert': alertWarranted,
    'time': timeOfCheck
  }
  debug(logData);

  // Convert data to string
  var logString = JSON.stringify(logData);

  // Determine the name of the log file
  var logFileName = originalCheckData.id;

  // Append the log string to the file
  _logs.append(logFileName, logString, function(error){
    if(!error) {
      debug('Logging to file succeeded');
    } else {
      debug('Logging to file failed');
    }
  });
}

// Timer to execute the worker process once per minute
workers.loop = function() {
  setInterval(function() {
    workers.gatherAllChecks()
  }, 1000 * 60);
}

// Rotate the log files
workers.rotateLogs = function() {
  // Listing all the non-compressed log files
  _logs.list(false, function(error, logs) {
    if (!error && logs && logs.length > 0) {
      logs.forEach(function(logName) {
        // Compress the data to a different file
        var logId = logName.replace('.log', '');
        var newFileId = logId + '-' + Date.now();
        _logs.compress(logId, newFileId, function(error) {
          if (!error) {
            // Truncate the log
            _logs.truncate(logId, function(error) {
              if (!error) {
                debug('Success truncating log file');
              } else {
                debug('Error truncating log file');
              }
            });
          } else {
            debug('Error compressing one of the log files', error);
          }
        });
      });
    } else {
      debug('Error: Could not find any logs to rotate');
    }
  });
}

// Timer to execute the log rotation once per day
workers.logRotationLoop = function() {
  setInterval(function() {
    workers.rotateLogs()
  }, 1000 * 60 * 60 * 24);
}

// Init workers
workers.init = function() {
  // Send to console in yellow
  console.log('\x1b[33m%s\x1b[0m', 'Background workers are running');

  // Execute all the checks
  workers.gatherAllChecks()

  // Call the loop so the checks will execute on their own
  workers.loop()

  // Compress all the logs immediately
  workers.rotateLogs();

  // Call the compression loop so logs will be compressed later on
  workers.logRotationLoop();
}


// Export
module.exports = workers;