var chakram = require('chakram')
const baseTestCase = require("./baseTestCase")
const x = require('./testData')
const expect = chakram.expect;
const { data } = require('./testData')
const params = data.params
const invalidParams = data.invalidParams
const credentials = data.credentials

/**
 * Returns promise by ID
 * @input param ID
 * @return promise
 */
const checkSignedSignature = (sigId) => {
  const result = new Promise((resolve, reject) => {
    chakram.get("https://tryout-catena-db.guardtime.net/api/v2/signatures/" + sigId, credentials)
      .then(responseObject => {
        if (responseObject.body.signature.status == 'SIGNED') {
          resolve(responseObject)
        } else reject("Signature not signed yet".red)
      })
  })
  return result
};

function wrapper() {
  return describe("Catena-DB API v2 functional testing".yellow, function() {
    // Sometimes test require more time than 3000 ms so we need more time
    this.timeout(5000);

    it("Creates and stores KSI signature from the given hash".green, function() {
      return chakram.post("https://tryout-catena-db.guardtime.net/api/v2/signatures", params, credentials)
        .then((response) => {
          expect(response).to.have.status(200)
          expect(response).to.have.schema({
            "type": "object",
            properties: {
              id: {
                type: "string"
              }
            }
          })
          // Since using asynchronous signing we need some time
          setTimeout(function() {
            console.log("KSI SIGNATURE CREATION PROCESS IS ASYNCHRONOUS THEREFORE DATA OUTPUT WILL BE DISPLAYED WITH DELAY".yellow)
            const sigId = response.body.id
            console.log("Signature id:".green + " " + response.body.id)
            // Start promise
            checkSignedSignature(sigId)
              .then(response => {
                const status =  response.body.signature.status
                const ksiSignature = response.body.signature.ksiSignature

                console.log("Signature status:".green + " " +status)
                expect(response.body.signature.status).to.equal("SIGNED")
                console.log("KSI Signature:".green + " " + ksiSignature)
              })
              .catch(errorMsg => {
                console.error("Error occured: " + errorMsg)
              })
          }, 1900);
        })
    });

    /**
     * Upplied value did not correspond to the format during signature creation
     * @input param json with invalid data
     * @return json object
     */
    it("Should throw an error if input parametes missing or invalid during signature creation".green, () => {
      return baseTestCase.generateInvalidSignature("v2")
    });

    /**
     * Searches signatures that meet the provided criteria
     * @input param signature id
     * @return json object
     */
    it("Returns the signature with a specific ID".green, () => {
    return baseTestCase.findSignatureById("v2")
  });
});
}

exports.runTests = wrapper
