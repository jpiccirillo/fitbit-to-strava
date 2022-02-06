const { Controller } = require("../models/controller");

const ExerciseController = new Controller("exercises");

ExerciseController.addFields = function (body) {
  return {
    convertedStartTime: new Date(body.startTime).getTime(),
    inStrava: false,
  };
};

module.exports = ExerciseController;
