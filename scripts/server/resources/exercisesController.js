const { Controller } = require("../models/controller");
const { rangeQuery, nonRangeQueries } = require("../helpers/index");
const C = new Controller("exercises");

C.addFields = function (body) {
  return {
    convertedStartTime: new Date(body.startTime).getTime(),
    inStrava: false,
  };
};

// Augment nonRangeQueries w some special, per-resource ones.  Here, we want to support filtering by activityName
nonRangeQueries.activityName = function (value, urlQueryName, bb) {
  bb.filter("term", "activityName", value);
  return bb;
};
nonRangeQueries.backOfLine = function (value, urlQueryName, bb) {
  bb.filter("match", "backOfLine", value === "false" ? false : true);
  return bb;
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

  bodybuilder.sort("convertedStartTime", "asc");

  return bodybuilder.build();
};

module.exports = C;
