/**
 * What is the express URL parameter called when using an ID in a url?
 * We get this request: GET /exercises/1250124.  1250124 is the ID of a specific exercise
 * Subrouter is configured to access this field dynamically by req.params[getIdName(<indexName>)]
 */
module.exports.getIdName = (index) => index + "ID";

/**
 * When the database returns us a result, where do we store it so that the final middleware can access it and expose it in the response?
 */
module.exports.getWhereToStoreResult = () => "_fieldWHereDatabaseResultIs";
