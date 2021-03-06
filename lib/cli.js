// These are CLI-related tasks

// Dependencies
var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e = new _events();
var os = require('os');
var v8 = require('v8');
var _data = require('./data');
var _logs = require('./logs');
var helpers = require('./helpers');
var childProcess = require('child_process');

// Instantiate the CLI module object
var cli = {};

// Input handlers
e.on('man', function(str){
  cli.responders.help();
});

e.on('help', function(str){
  var commands = {
    'exit' : 'Kill the CLI and the rest of the application',
    'man' : 'Show the help page',
    'help' : 'Alias of the man command',
    'stats' : 'Get statistics on the underlying OS and resource utilization',
    'list users' : 'Show list of all the registered (undeleted) user in the system', 
    'more user info --(userId)' : 'Show details of a specific user',
    'list checks --up --down' : 'Show list of all the active checks in the system. Including their state.',
    'more check info --(checkId)' : 'Show details of a specific check',
    'list logs' : 'Show a list of all the log files available to be read (compressed only)',
    'more log info --(fileName)' : 'Show details of a specified log file'
  }

  // Show a header for the help page
  cli.horizontalLine();
  cli.centered('CLI Manual');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command, followed by its explanation, in white and yellow respectively
  for(var key in commands) {
    if (commands.hasOwnProperty(key)) {
      var value = commands[key];
      var line = '\x1b[33m' + key + '\x1b[0m'
      var padding = 60 - line.length - 1;
      for (i = 0; i < padding; i++) {
        line += ' ';
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace(1);
  cli.horizontalLine();
});

// Create a vertical space
cli.verticalSpace = function(lines) {
  lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
    console.log(''); // This creates a vertical space
  }
}

// Create a horizontal line across the screen
cli.horizontalLine = function() {
  // Get the available screen size
  var width = process.stdout.columns;
  var line = '';
  for (i = 0; i < width; i++) {
    line += '-';
  }
  console.log(line);
}

// Create centered text on the screen
cli.centered = function(str) {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

  // Get the available screen size
  var width = process.stdout.columns;

  // Calculate the left padding
  var leftPadding = Math.floor((width - str.length) / 2);
  
  // Put in left padded spaces before the string
  var line = '';
  for (i = 0; i < leftPadding; i++) {
    line += ' ';
  }
  line += str;
  console.log(line);
}

e.on('exit', function(str){
  cli.responders.exit();
});

e.on('stats', function(tr){
  cli.responders.stats();
});

e.on('list users', function(str){
  cli.responders.listUsers();
});

e.on('more user info', function(str){
  cli.responders.moreUserInfo(str);
});

e.on('list checks', function(str){
  cli.responders.listChecks(str);
});

e.on('more check info', function(str){
  cli.responders.moreCheckInfo(str);
});

e.on('list logs', function(str){
  cli.responders.listLogs();
});

e.on('more log info', function(str){
  cli.responders.moreLogInfo(str);
});

// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = function(){
  console.log('You asked for help');
}

// Exit
cli.responders.exit = function(){
  process.exit(0);
}

// Stats
cli.responders.stats = function(){
  // Comopile an object of stats
  var stats = {
    'Load Average': os.loadavg().join(' '),
    'CPU Count': os.cpus().length,
    'Free Memory': os.freemem(),
    'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used (%)': Math.round(v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size  * 100),
    'Available Heap Allocated (%)': Math.round(v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit  * 100),
    'Uptime': os.uptime() + ' seconds'
  };

  // Show a header for the help page
  cli.horizontalLine();
  cli.centered('SYSTEM STATISTICS');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Log out each stat
  for(var key in stats) {
    if (stats.hasOwnProperty(key)) {
      var value = stats[key];
      var line = '\x1b[33m' + key + '\x1b[0m'
      var padding = 60 - line.length - 1;
      for (i = 0; i < padding; i++) {
        line += ' ';
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace(1);
  cli.horizontalLine();
}

// Exit
cli.responders.listUsers = function(){
  _data.list('users', function(error, userIds) {
    if (!error && userIds && userIds.length > 0) {
      cli.verticalSpace();
      userIds.forEach(function(userId) {
        _data.read('users', userId, function(error, userData) {
          if (!error && userData) {
            var line = 'Name: ' + userData.firstName + ' ' + userData.lastName + ' Phone ' + userData.phone + ' Checks ';
            var numberOfChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
            line += numberOfChecks;
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    } 
  });
}

// More User Info
cli.responders.moreUserInfo = function(str){
  // Get the ID from the string provided
  var arr = str.split('--');
  var userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1] : false;
  if (userId) {
    // Lookup the user
    _data.read('users', userId, function(error, userData) {
      if (!error && userData) {
        // Remove the hashed password
        delete userData.hashedPassword;

        // Print the JSON with text highlighting
        cli.verticalSpace();
        console.dir(userData, {'colors': true});
        cli.verticalSpace();
      }
    });
  }
}

// LIst checks
cli.responders.listChecks = function(str){
  _data.list('checks', function(error, checkIds) {
    if (!error && checkIds && checkIds.length > 0) {
      cli.verticalSpace();
      checkIds.forEach(function(checkId) {
        _data.read('checks', checkId, function(error, checkData) {
          var includeCheck = false;
          var lowerString = str.toLowerCase();

          // Get the state of the check, default to down
          var state = typeof(checkData.state) == 'string' ? checkData.state : 'down';
          var stateOrUnknown = typeof(checkData.state) == 'string' ? checkData.state : 'unknown';

          // If the user has specified the state or hasn't specified any state, include the current check accordingly
          if (lowerString.indexOf('--' + state) > -1 || lowerString.indexOf('--down') == -1 && lowerString.indexOf('--up') == -1) {
            var line = 'ID ' + checkData.id + ' ' + checkData.method.toUpperCase() + ' ' + checkData.protocol + '://' + checkData.url + ' State: ' + stateOrUnknown;
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    } 
  })
}

// More Check Info
cli.responders.moreCheckInfo = function(str){
  // Get the ID from the string provided
  var arr = str.split('--');
  var checkId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1] : false;
  if (checkId) {
    // Lookup the user
    _data.read('checks', checkId, function(error, checkData) {
      if (!error && checkData) {
        // Print the JSON with text highlighting
        cli.verticalSpace();
        console.dir(checkData, {'colors': true});
        cli.verticalSpace();
      }
    });
  }
}

// List Logs
cli.responders.listLogs = function(){
  var ls = childProcess.spawn('ls', ['./.logs/']);
  ls.stdout.on('data', function(dataObject){
    // Show in separate lines
    var dataStr = dataObject.toString();
    var logFileNames = dataStr.split('\n');
    cli.verticalSpace();
    logFileNames.forEach(function(logFileName){
      if ( typeof(logFileName) == 'string' && logFileName.length > 0 && logFileName.indexOf('-') > -1){
        console.log(logFileName.trim().split('.')[0]);
        cli.verticalSpace();
      }
    });
  });


  // _logs.list(true, function(error, logFileNames){
  //   if (!error && logFileNames) {
  //     cli.verticalSpace();
  //     logFileNames.forEach(function(logFileName){
  //       if (logFileName.indexOf('-') > -1){
  //         console.log(logFileName);
  //         cli.verticalSpace();
  //       }
  //     });
  //   }
  // });
}

// More logs info
cli.responders.moreLogInfo = function(str){
  // Get the file name from the string provided
  var arr = str.split('--');
  var logFileName = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1] : false;
  if (logFileName) {
    cli.verticalSpace();

    // Decompress the log file
    _logs.decompress(logFileName, function(error, stringData){
      if (!error && stringData){
        // Split into lines
        var arr = stringData.split('\n');
        arr.forEach(function(jsonString){
          var logObject = helpers.parseJsonToObject(jsonString);
          if (logObject && JSON.stringify(logObject != '{}')){
            console.dir(logObject, {'colors': true});
            cli.verticalSpace();
          }
        });
      }
    });
  }
}

// Input processor
cli.processInput = function(str) {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
  // Only process input if the user actually typed something
  if (str) {
    // Codify the unique strings to the unique questions allowed
    var uniqueInputs = [
      'man',
      'help',
      'exit',
      'stats',
      'list users', 
      'more user info',
      'list checks',
      'more check info',
      'list logs',
      'more log info'
    ];

    // Go through the possible inputs. Emit an event when a match is found
    var matchFound = false;
    var counter = 0;

    uniqueInputs.some(function(input){
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;
        // Emit an event matching the unique input, and include the full string given
        e.emit(input, str);
        return true;
      }
    });

    // If no match found, tell the user to try again
    if(!matchFound) {
      console.log('Sorry, try again');
    }
  }
}

// Init script
cli.init = function() {
  // Send the start message to the console in dark blue
  console.log('\x1b[34m%s\x1b[0m', 'The CLI is running');

  // Start the Interface
  var _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
  });

  // Create an initial prompt
  _interface.prompt();
 
  // Handel each line of input separately
  _interface.on('line', function(str){
    // Send to the input processor
    cli.processInput(str);

    // Reinitialize the prompt
    _interface.prompt();
  });

  // If the user stops the CLI
  _interface.on('close', function(){
    process.exit(0);
  })
}

module.exports = cli;