const { getWhereToStoreResult } = require("./index");

module.exports.final = function (req, res, next) {
  return res.send(res.locals[getWhereToStoreResult()]);
};

module.exports.addLocals = function (req, res, next) {
  res.locals = res.locals || {};
  return next();
};
