import { readFile, appendFile } from "fs";
import inquirer from "inquirer";

const testString = ',\r\n{ "name": "Emma", "gender": "female", "age": 5 }';
const user = {};

function askInfo() {
  inquirer
    .prompt([
      {
        name: "name",
        message: "Enter the user's name. To cancel press ENTER: ",
      },
    ])
    .then((answer) => {
      user["name"] = answer.name;
      answer.name === "" ? askToSearch() : askDetails();
    });
}
askInfo();

function askDetails() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "gender",
        message: "Choose your gender.",
        choices: ["male", "female"],
      },
      {
        name: "age",
        message: "Enter your age: ",
      },
    ])
    .then((answer) => {
      user["gender"] = answer.gender;
      user["age"] = answer.age;

      (async function udcatedDB() {
        await writeToFile("users.txt", ",\r\n" + JSON.stringify(user));
        askInfo();
      })();
    });
}

function askToSearch() {
  inquirer
    .prompt([
      {
        name: "search",
        type: "confirm",
        message: "Would you like to search value in DB: ",
      },
    ])
    .then((answer) => {
      if (answer.search) {
        showFile("users.txt", ",\r\n");
        inquirer
          .prompt([
            {
              name: "username",
              message: "Enter username you wanna find in DB: ",
            },
          ])
          .then((answer) => {
            console.log(answer)
          });
      }
    });
}

// inquirer
//   .prompt([
//     {
//       name: "name",
//       message: "Enter the user's name. To cancel press ENTER: ",
//     },
//     {
//       type: "list",
//       name: "gender",
//       message: "Choose your gender.",
//       choices: ["male", "female"],
//     },
//     {
//       name: "age",
//       message: "Enter your age: ",
//     },
//   ])
//   .then((answers) => {
//     user["name"] = answers.name;
//     user["gender"] = answers.gender;
//     user["age"] = answers.age;
//     console.info("Answer:", user);
//     // inquirer.prompt([
//     //     {
//     //       type: 'list',
//     //       name: 'gender',
//     //       message: 'Choose your gender.',
//     //       choices: ['male', 'female'],
//     //     },
//     //   ]).then(answers => {
//     //     console.info('Answer:', answers.name, " , ", answers.gender);
//     //   });
//   });

// appendFile("users.txt", testString, function (err) {
//     if (err)
//         throw err;
//     console.log("IS WRITTEN");
// });
function writeToFile(file, str) {
  appendFile(file, str, function (err) {
    if (err) throw err;
  });
}

function showFile(file, separator) {
  readFile(file, "utf-8", (err, data) => {
    if (err) throw err;
    console.log(data.split(separator).map((str) => JSON.parse(str)));
  });
}
