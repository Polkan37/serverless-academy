import { promises } from "fs";
import inquirer from "inquirer";

const user = {};

async function askInfo() {
  const answer = await inquirer.prompt([
    {
      name: "name",
      message: "Enter the user's name. To cancel press ENTER: ",
    },
  ])

  user["name"] = answer.name;
  answer.name ? askDetails() : askToSearchInDB();
}

async function askDetails() {
  const userDetails = await inquirer.prompt([
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
  ]);

  user["gender"] = userDetails.gender;
  user["age"] = userDetails.age;

  await saveToDB("users.txt", ",\n" + JSON.stringify(user));

  askInfo();
}

async function askToSearchInDB() {
  const answer = await inquirer.prompt([
    {
      name: "search",
      type: "confirm",
      message: "Would you like to search value in DB: ",
    },
  ]);

  if (answer.search) {
    const usersFromFile = await getFromDB("users.txt", ",\n");
    const userAnswer = await inquirer.prompt([
      {
        name: "username",
        message: "Enter username you wanna find in DB: ",
      },
    ]);

    const foundUser = usersFromFile.find(user => user.name.toLowerCase() === userAnswer.username.toLowerCase())
    foundUser ? console.log('User that was found: ', foundUser) : console.log('User not found');

    askInfo();
  } else {
    process.exit();
  }
}

async function saveToDB(file, str) {
  try {
    await promises.appendFile(file, str)
  } catch (error) {
    console.log('error', error)
  }
}

async function getFromDB(file, separator) {
  try {
    const data = await promises.readFile(file, "utf-8");
    console.log("\n");
    const dataBase = data.split(separator).map((str) => JSON.parse(str));
    console.log("dataBase", dataBase);
    return dataBase;
  } catch (error) {
    console.log("error", error);
  }
}

askInfo();

