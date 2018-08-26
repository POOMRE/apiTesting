var colors = require('colors')


/**
 * Here we can configre test suites for running tests
 *
 */
function main(){
  console.log("\n\nStarting tests ...".green)
  const v1 = require('./v1ApiTesting')
  const v2 = require('./v2ApiTesting')
  v1.runTests()
  v2.runTests()

}

main()
