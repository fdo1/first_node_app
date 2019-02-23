// Test Runner

var helpers = require('./../lib/helpers');
var assert = require('assert');

// Application runner for the test runner
_app = {};

_app.tests = {
  'unit': {}
};

// Assert that the getANumber function is returning a number
_app.tests.unit['helpers.getANumber should return a number'] = function(done){
  var val = helpers.getANumber();
  assert.equal(typeof(val), 'number');
  done();
};

// Assert that the getANumber function is returning 1
_app.tests.unit['helpers.getANumber should return 1'] = function(done){
  var val = helpers.getANumber();
  assert.equal(val, 1);
  done();
};

// Assert that the getANumber function is returning 2
_app.tests.unit['helpers.getANumber should return 2'] = function(done){
  var val = helpers.getANumber();
  assert.equal(val, 2);
  done();
};

// Count all the tests
_app.countTests = function(){
  var counter = 0;
  for(var key in _app.tests){
    if(_app.tests.hasOwnProperty(key)){
      var subtests = _app.tests[key];
      for(var testName in subtests){
        if(subtests.hasOwnProperty(testName)){
          counter++;
        }
      }
    };
  }
  return counter;
};

// Produce a test outcome report
_app.produceTestReport = function(limit, successes, errors){
  console.log('');
  console.log('------ Begin Test Report ------');
  console.log('');
  console.log('Total tests: ', limit);
  console.log('Pass: ', successes);
  console.log('Fail: ', errors.length);
  console.log('');

  // If there are errors print the details
  if(errors.length > 0){
    console.log('ERROR DETAILS');
    console.log('');
    errors.forEach(function(testError){
      console.log('\x1b[31m%s\x1b[0m', testError.name);
      console.log(testError.error);
    });
  }

  console.log('')
  console.log('------ End Test Report ------');
}

// Run all the tests colleting the errors and successes
_app.runTests = function(){
  var errors = [];
  var successes = 0;
  
  var limit = _app.countTests();
  var counter = 0;
  for(var key in _app.tests){
    if (_app.tests.hasOwnProperty(key)){
      var subTests = _app.tests[key];
      for (var testName in subTests) {
        if (subTests.hasOwnProperty(testName)){
          (function(){
            var tmpTestName = testName;
            var testValue = subTests[testName];
            // Call the test
            try {
              testValue(function(){
                // If it calls back without throwing then it succeded, so log it in green
                console.log('\x1b[32m%s\x1b[0m', tmpTestName);
                counter++;
                successes++;
                if (counter == limit){
                  _app.produceTestReport(limit, successes, errors);
                }
                
              });
            } catch(e){
              // If it throws, then it failed. Capture the error and log it in red
              errors.push({
                'name': tmpTestName,
                'error': e
              });
              console.log('\x1b[31m%s\x1b[0m', tmpTestName);
              counter++;
              if (counter == limit){
                _app.produceTestReport(limit, successes, errors);
              }
            }
          })();
        };
      }
    }
  }
}

// Run the test
_app.runTests();