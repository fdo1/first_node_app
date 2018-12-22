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
  fs.open(lib.baseDirectory + directory + '/' + file + '.json', 'wx', function(error, fileDescriptor){
    if(!error && fileDescriptor) {
      // Convert data to string
      var stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData, function(error) {
        if(!error) {
          fs.close(fileDescriptor, function(error) {
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
};

// Read data from a file
lib.read = function(direcotry, file, callback) {
  fs.readFile(lib.baseDirectory + direcotry + '/' + file + '.json', 'utf8', function(error, data) {
    callback(error, data);
  });
}

// Update data from a file
lib.update = function(directory, file, data, callback) {
  // Open the file for writing
  fs.open(lib.baseDirectory + directory + '/' + file + '.json', 'r+', function(error, fileDescriptor) {
    if(!error && fileDescriptor) {
      // Convert data to string
      var stringData = JSON.stringify(data);

      // Truncate the contents of the file before writing on top
      fs.ftruncate(fileDescriptor, function(error) {
        if(!error) {
          fs.writeFile(fileDescriptor, stringData, function(error) {
            if(!error) {
              fs.close(fileDescriptor, function(error) {
                if(!error) {
                  callback(false);
                } else {
                  callback('Error closing the file');
                }
              });
            } else {
              callback('Error writing to existing file');
            }
          });
        } else {
          callback('Error truncating file');
        }
      });
    } else {
      callback('Could not open the file for update. It may not exist yet.');
    }
  });
}

// Delete a file
lib.delete = function(directory, file, callback) {
  // Unlink the file (Removing from the file system)
  fs.unlink(lib.baseDirectory + directory + '/' + file + '.json', function(error) {
    if(!error) {
      callback(false)
    } else {
      callback('Error deleting the file');
    }
  })
}


// Export the module
module.exports = lib;