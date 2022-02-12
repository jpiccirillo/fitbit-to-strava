const { Controller } = require("../models/controller");
const { rangeQuery, nonRangeQueries } = require("../helpers/index");
const C = new Controller("heartrates");

C.addFields = function (body) {
  return {
    humanreadableDate: body.dateTime,
    dateTime: new Date(body.dateTime).getTime(),
  };
};

C.getSupportedQueryParams = function ({ query: queries }, bodybuilder) {
  for (let key in queries) {
    // Look to nonrange query generation functions first, then to rangeQuery as fallback
    bodybuilder = (nonRangeQueries[key] || rangeQuery)(
      queries[key],
      key,
      bodybuilder
    );
  }

  return bodybuilder.build();
};

module.exports = C;
