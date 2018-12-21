// Library for storing and editing data

// Dependencies
var fs = require('fs');
var path = require ('path');

// Container for the module (to be exported)
var lib = {}

// Base directory of the data folder
lib.baseDirectory = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = function(directory, file, data, callback) {
  // Open the file for writing
  fs.open(lib.baseDirectory + directory + '/' + file + '.json' + 'wx', function(error, fileDescriptor){
    if(!error && fileDescriptor) {
      // Convert data to string
      var stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData, function(error) {
        if(!error) {
          fs.close(fileDescriptor, function(error ) {
            if(!error) {
              callback(false);
            } else {
              callback('Error at closing new file');
            }
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file. It may already exist.');
    }
  })
}


// Export the module
module.exports = lib;