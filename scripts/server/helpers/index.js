const fs = require("fs");

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

module.exports.createGPXFile = async (hrArray) => {
  let file = `<?xml version="1.0" encoding="UTF-8"?>`;
  file += `<gpx creator="--No GPS SELECTED--" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3">`;
  file += `<trk>`;
  file += `<name>Created By Script</name>`;
  file += `<type>Biking</type>`;
  file += `<trkseg>`;
  for (let { _source: hr } of hrArray) {
    file += `<trkpt>
    <time>${new Date(hr.dateTime).toISOString()}</time>
      <extensions>
        <gpxtpx:TrackPointExtension>
          <gpxtpx:hr>${hr.bpm}</gpxtpx:hr>
        </gpxtpx:TrackPointExtension>
      </extensions>
    </trkpt>`;
  }
  file += `</trkseg>`;
  file += `</trk>`;
  file += `</gpx>`;

  return new Promise((res, rej) => {
    fs.writeFile("./heartrates.gpx", file, (err) => {
      if (err) rej(err);
      res();
    });
  });
};
