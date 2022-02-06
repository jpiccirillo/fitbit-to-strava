const axios = require("axios");
const fs = require("fs").promises;
const DIR = "/Users/jeffrey/Desktop/fitbitData/user-site-export/heartrates2/";

function getFolders(subFolder) {
  return fs.readdir(DIR + (subFolder || ""));
}

async function coordinateFolders() {
  let folders = await getFolders();
  for (let folder of folders) {
    const files = await getFolders("/" + folder);
    await processData(files, folder);
  }
}

async function addData(arrays) {
  for (array of arrays) {
    await axios.post("http://localhost:3000/heartrates/bulk", array);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

function processData(files, folder) {
  Promise.all(files.map((i) => fs.readFile(`${DIR}${folder}/${i}`)))
    .then((arrays) => {
      return arrays.map(JSON.parse);
    })
    .then((arrays) => {
      return arrays.map((array) =>
        array.map(({ dateTime, value }) => ({
          dateTime,
          bpm: value.bpm,
          confidence: value.confidence,
        }))
      );
    })
    .then(addData);
}

coordinateFolders();
