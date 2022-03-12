const { Controller } = require("../models/controller");
const { rangeQuery, nonRangeQueries, exec } = require("../helpers/index");
const C = new Controller("exercises");
const { client } = require("../services/elasticsearch");
const { run } = require("@jxa/run");

Date.prototype.addMilliseconds = function (count) {
  this.setMilliseconds(this.getMilliseconds() + count);
  return this;
};

C.getExercise = async function (id) {
  const params = {
    id,
    index: this.index,
  };
  return (await exec(client, "get", params, ...arguments)).body._source;
};

C.getExerciseStartEnd = function ({
  startTime: _startTime,
  originalDuration,
  activeDuration,
}) {
  const duration = Math.max(originalDuration, activeDuration);
  const start = shift(_startTime);
  const end = new Date(start).addMilliseconds(duration);
  return { start, end };
};

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
nonRangeQueries.distance = function (value, urlQueryName, bb) {
  bb.filter("match", "distance", value);
  return bb;
};
nonRangeQueries.logType = function (value, urlQueryName, bb) {
  bb.filter("match", "logType", value);
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

C._viewInCalendar = async function (req, res, next) {
  const exercise = await this.getExercise(req.params[this.idName]);
  const { start: shiftedStartTime } = this.getExerciseStartEnd(exercise);
  await run((startTime) => {
    var Calendar = Application("Calendar");
    Calendar.switchView({ to: "day view" });
    Calendar.viewCalendar({ at: new Date(startTime) });
  }, shiftedStartTime);
  return next();
};

C._addToCalendar = async function (req, res, next) {
  const exercise = await this.getExercise(req.params[this.idName]);
  const { start, end } = this.getExerciseStartEnd(exercise);
  const durationInMinutes = (exercise.duration / 1000 / 60).toFixed(1);
  const title = `Cycling (${durationInMinutes}min)`;
  let description = `Start: ${f(start)}\n`;
  description += `End: ${f(end)}\n`;
  description += `Duration: ${durationInMinutes}min\n`;
  description += `Distance: ${exercise.distance}mi\n\n`;
  description += `Generated by fitbit-to-strava script on ${f(new Date())}`;

  const config = { start, end, title, description };
  await run((o) => {
    var Calendar = Application("Calendar");
    var projectCalendars = Calendar.calendars.whose({
      name: "Activity",
    });
    var projectCalendar = projectCalendars[0];
    var event = Calendar.Event({
      summary: o.title,
      description: o.description,
      startDate: new Date(o.start),
      endDate: new Date(o.end),
    });
    projectCalendar.events.push(event);
    Calendar.viewCalendar({ at: new Date(o.start) });
  }, config);
  return next();
};

module.exports = C;

function f(date) {
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function shift(d) {
  let _d = new Date(d);
  _d.setHours(_d.getHours() - 5);
  return _d;
}
