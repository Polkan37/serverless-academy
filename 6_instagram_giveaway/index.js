const input = document.querySelector("#input");
const fileupList = document.getElementsByClassName("fileup-list")[0];
const fileupInput = document.getElementsByClassName("fileup-input")[0];

const users = {};
let files;

fileupInput.addEventListener("change", function (event) {
  files = event.srcElement.files;
  console.log("files", files);
  try {
    for (const [key, file] of Object.entries(files)) {
      readFile(file);
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    console.log("users", users);
    const result = existInAllFiles();
    console.log("result", result);
  }
});

function readFile(file) {
  const reader = new FileReader();
  console.log("fileName", file.name);

  reader.addEventListener("load", (event) => {
    const fileName = file.name;
    const content = event.target.result;
    const unique = [...new Set(content.split(/\r?\n/))];
    unique.forEach((user) => {
      users[user] ? users[user].push(fileName) : (users[user] = [fileName]);
    });
    console.log(fileName, " - ", Object.keys(users).length);
  });

  reader.readAsText(file);
}

function uniqueValues() {
  return Object.keys(users).length;
}

function existInAllFiles() {
  const existedInAllFiles = [];
  for (const [key, value] of Object.entries(users)) {
    if (value.length === 20) existedInAllFiles.push(key);
  }
  return existedInAllFiles.length;
}

function existInAtleastTen() {
    const existedInAtLeastTen = [];
    for (const [key, value] of Object.entries(users)) {
      if (value.length >= 10) existedInAtLeastTen.push(key);
    }
    return existedInAtLeastTen.length;
}
