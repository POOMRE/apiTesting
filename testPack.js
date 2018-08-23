function main(){
  console.log("\n\nStarting tests ...")
  const v1 = require('./v1ApiTesting')
  const v2 = require('./v2ApiTesting')
  v1.runTests()
  v2.runTests()

}

main()
