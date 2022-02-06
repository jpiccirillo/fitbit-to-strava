const axios = require("axios");
const fs = require("fs").promises;
const DIR = "/Users/jeffrey/Desktop/fitbitData/user-site-export/exercise/";

function getFolders(subFolder) {
  return fs.readdir(DIR + (subFolder || ""));
}

async function addData(array) {
  for (obj of array) {
    console.log(`Posting... ${obj.logId} (${obj.activityName})`);
    await axios.post("http://localhost:3000/exercises", obj);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

function processData(files, folder) {
  Promise.all(files.map((i) => fs.readFile(`${DIR}${i}`)))
    .then(async (arr) => {
      let retval = [];
      for (let p of arr) retval.push(...JSON.parse(p));
      return retval;
    })
    .then(addData);
}

getFolders()
  .then(processData)
  .then(() => console.log("Completed"));
