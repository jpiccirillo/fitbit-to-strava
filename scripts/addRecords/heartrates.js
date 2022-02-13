const axios = require("axios");
const fs = require("fs").promises;
const TOP_FOLDER = process.argv[2];
const DIR = `/Users/jeffrey/Desktop/fitbitData/user-site-export/${TOP_FOLDER}/`;
const TRACE = ".DS_Store";
function getFolders(subFolder) {
  return fs.readdir(DIR + (subFolder || ""));
}

async function coordinateFolders() {
  let folders = await getFolders();
  for (let folder of folders) {
    if (folder === TRACE) {
      console.log(`Found .DS_Store in ${TOP_FOLDER}`);
      continue;
    }
    const files = await getFolders("/" + folder);
    await processData(
      files.filter((a) => a !== TRACE),
      folder
    );
  }
}

async function addData(arrays) {
  for (let array of arrays) {
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
