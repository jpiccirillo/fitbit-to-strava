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

/**
 *
 * @param {String} value Value of the 'between' query field, comma delimited
 * @param {String} field Name of the field being filtered in the URL
 * @param {Bodybuilder} bb Bodybuilder instance to add range query to
 * @returns { Bodybuilder } Bodybuilder with new query on it
 */
module.exports.rangeQuery = (value, urlQueryName, bb) => {
  const fieldName = urlQueryName.split("Btwn")[0];
  const [first, second] = value.split(",");

  bb.query("range", fieldName, {
    gte: first,
    lte: second,
  });
  return bb;
};

module.exports.nonRangeQueries = {
  size: function (value, urlQueryName, bb) {
    return bb.size(parseInt(value));
  },
};

module.exports.exec = async (c, method, params, req, res, next) => {
  try {
    return c[method]({ ...params, type: "doc" });
  } catch (e) {
    return next(e);
  }
};
