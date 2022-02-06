const { Controller } = require("../models/controller");

const HeartratesController = new Controller("heartrates");

HeartratesController.addFields = function (body) {
  return {
    humanreadableDate: body.dateTime,
    dateTime: new Date(body.dateTime).getTime(),
  };
};

module.exports = HeartratesController;
