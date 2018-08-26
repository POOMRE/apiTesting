var chakram = require('chakram')
const { data } = require('./testData')
const params = data.params
const invalidParams = data.invalidParams
const credentials = data.credentials

/**
 * Throw an error if input parametes missing during signature creation
 * @api version
 * @return json object
 */
exports.generateInvalidSignature = (version) => {
  return chakram.post("https://tryout-catena-db.guardtime.net/api/" + version + "/signatures", invalidParams, credentials)
    .then((response) => {
      expect(response).to.have.status(400);
      const errorResponse = JSON.stringify(response.body, null, 2);
      console.log("errorMessage:".red, errorResponse.red)
    })
}

/**
 * Creates and returns the signature with a specific ID
 * @api version
 * @return json object
 */
   exports.findSignatureById = (version) => {
     return chakram.post("https://tryout-catena-db.guardtime.net/api/" + version + "/signatures", params, credentials)
       .then((createResponse) => {
         const createdId = createResponse.body.id
         console.log("Search ID:".green+" "+createdId)
         return createdId
       })
       .then((createdId) => {
         return chakram.get("https://tryout-catena-db.guardtime.net/api/" + version + "/signatures/" + createdId, credentials)
           .then((searchResponse) => {
             const searchId = searchResponse.body.id
             expect(searchResponse).to.have.status(200)
             expect(createdId).to.equal(searchId)
           })
       })

}
