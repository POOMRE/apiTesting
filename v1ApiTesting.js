var chakram = require('chakram')
const baseTestCase = require("./baseTestCase")
expect = chakram.expect
const {
  data
} = require('./testData')
const params = data.params
const invalidParams = data.invalidParams
const credentials = data.credentials

function wrapper(){
  return describe("Catena-DB API v1 functionality testing",
  function() {
    //Sometimes test require more time than 3000 ms so we need more time
    this.timeout(5000);

    /**
     * New signature creation
     * @input param json
     * @return json object
     */
    it("Creates and stores KSI signature from the given hash", () => {
      return chakram.post("https://tryout-catena-db.guardtime.net/api/v1/signatures", params, credentials)
        .then((response) => {
          expect(response).to.have.status(200)
          expect(response).to.have.schema({
            "type": "object",
            properties: {
              id: {
                type: "string"
              },
              signature: {
                type: "string"
              }
            }
          })
        })
    });

    /**
     * Existing KSI signature will be associated with a UUID
     * @input param json
     * @return json object
     */
    it("Assigns unique ID to previously generated signature and stores the signature in database", () => {
      return chakram.post("https://tryout-catena-db.guardtime.net/api/v1/signatures", params, credentials)
        .then((postResponse) => {
          const id = postResponse.body.id
          console.log("Previous ID"+" "+id)
          const params = {
            "signature": postResponse.body.signature
          }
          return {params, id}
        })
        .then(({params, id}) => {
          return chakram.put("https://tryout-catena-db.guardtime.net/api/v1/signatures", params, credentials)
            .then((putResponse) => {
              const newId = putResponse.body.id
              console.log("New generated ID"+" "+newId)
              expect(putResponse).to.have.status(200);
              expect(putResponse).to.have.schema({
                "type": "object",
                properties: {
                  id: {
                    type: "string"
                  },
                  signature: {
                    type: "string"
                  }
                }
              })
            expect(id).to.not.equal(newId);
            })
        })
    });

    /**
     * Upplied value did not correspond to the format during signature creation
     * @input param json with invalid data
     * @return json object
     */
    it("Should throw an error if input parametes missing during signature creation", () => {
      return baseTestCase.generateSignature("v1")
    });

    /**
     * Searches signatures that meet the provided criteria
     * @input param signature id
     * @return json object
     */
   it("Returns the signature with a specific ID", () => {
   return baseTestCase.findSignatureById("v1")
    });
  });
}

exports.runTests = wrapper
