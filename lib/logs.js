// This is a library for storing and rotating logs

// Dependencies
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

// Container for the module

var lib = {};

// Base directory of the log folder
lib.baseDirectory = path.join(__dirname, '/../.logs/');

// Append a string to a file. Create the file if it doesn't exist
lib.append = function(fileName, str, callback) {
  // Open the file for appending
  fs.open(lib.baseDirectory + fileName + '.log', 'a', function(error, fileDescriptor) {
    if (!error && fileDescriptor) {
      // Append to the file and close it
      fs.appendFile(fileDescriptor, str + '\n', function(error) {
        if (!error) {
          fs.close(fileDescriptor, function(error) {
            if (!error) {
              callback(false);
            } else {
              callback('Error closing file that was being appendend');
            }
          });
        } else {
          callback('Error appending to file'); 
        }
      });
    } else {
      callback('Could not open file for appending');
    }
  });
}

// List all the logs and optionally include the comopressed logs
lib.list = function(includeCompressedLogs, callback) {
  fs.readdir(lib.baseDirectory, function(error, data) {
    if (!error && data && data.length > 0) {
      var trimmedFileNames = [];
      data.forEach(function(fileName) {
        // Add the .log files
        if (fileName.indexOf('.log') > -1) {
          trimmedFileNames.push(fileName.replace('.log', ''));
        }

        // Add on the .gz files
        if (fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs) {
          trimmedFileNames.push(fileName.replace('.gz.b64', ''));
        }

        callback(false, trimmedFileNames);
      });
    } else {
      callback(error, data);
    }
  });
}

// Compress the contents of a .log file into a .gz.b64 file within the same directory
lib.compress = function(logId, newFileId, callback) {
  var sourceFile = logId + '.log';
  var destinationFile = newFileId + '.gz.b64';

  // Read the source file
  fs.readFile(lib.baseDirectory + sourceFile, 'utf8', function(error, inputString) {
    if (!error && inputString) {
      // Compress the data using gzip
      zlib.gzip(inputString, function(error, buffer) {
        if (!error && buffer) {
          // Send the data to the destination file
          fs.open(lib.baseDirectory + destinationFile, 'wx', function(error, fileDescriptor) {
            if (!error && fileDescriptor) {
              fs.writeFile(fileDescriptor, buffer.toString('base64'), function(error) {
                if (!error) {
                  // Close the destination file
                  fs.close(fileDescriptor, function(error) {
                    if (!error) {
                      callback(false);
                    } else {
                      callback(error);
                    }
                  });
                } else {
                  callback(error);
                }
              });
            } else {
              callback(error);
            }
          });
        } else {
          callback(error);
        }
      });
    } else {
      console.log(error);
    }
  });
}

// Decompress the contents of a .gz.b64 file into a string variable
lib.decompress = function(fileId, callback) {
  var fileName = fileId + '.gz.b64';
  fs.readFile(lib.baseDirectory + fileName, 'utf8', function(error, str) {
    if (!error && str) {
      // Decompress the data
      var inputBuffer = Buffer.from(str, 'base64');
      zlib.unzip(inputBuffer, function(error, outputBuffer) {
        if (!error && outputBuffer) {
          // Create a string
          var str = outputBuffer.toString();
          callback(false, str);
        } else {
          callback(error);
        }
      });
    } else {
      callback(error);
    }
  });
}

// Truncate a log file
lib.truncate = function(logId, callback) {
  fs.truncate(lib.baseDirectory + logId + '.log', 0, function(error) {
    if (!error) {
      callback(false);
    } else {
      callback(error);
    }
  });
}

// Export module
module.exports = lib;