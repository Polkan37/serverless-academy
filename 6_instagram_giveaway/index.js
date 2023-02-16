const fs = require("fs");
const folder = "./2kk_words_400x400/";
const files = [];
const uniqueRecords = {};

fs.readdirSync(folder).forEach((file) => {
  files.push(file);
});

files.forEach((file) => {
  const filePath = folder + file;
  const data = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" });
  const unique = [...new Set(data.split(/\r?\n/))];
  unique.forEach( record => {
    uniqueRecords[record] ? uniqueRecords[record].push(file) : (uniqueRecords[record] = [file]);
  });
});

const result = existInAtleastTen();
console.log('result', result)




function uniqueValues() {
  return Object.keys(uniqueRecords).length;
}

function existInAllFiles() {
  const existedInAllFiles = [];
  for (const [key, value] of Object.entries(uniqueRecords)) {
    if (value.length === 20) existedInAllFiles.push(key);
  }
  return existedInAllFiles.length;
}

function existInAtleastTen() {
  const existedInAtLeastTen = [];
  for (const [key, value] of Object.entries(uniqueRecords)) {
    if (value.length >= 10) existedInAtLeastTen.push(key);
  }
  return existedInAtLeastTen.length;
}
