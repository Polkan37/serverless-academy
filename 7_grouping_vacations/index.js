const fs = require("fs");
const data = [];

fs.readFile("./vacations.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file:", err);
    return;
  }
  try {
    const vacations = JSON.parse(jsonString);
    vacations.forEach((vacation) => {
      const result = data.find(record => record?.userName === vacation.user.name)
      result ? result.vacations.push(getVacationDates(vacation)) : data.push(getUserInfo(vacation))

    })

    fs.writeFileSync("./out.json", JSON.stringify(data));
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});

function getVacationDates(vacationData) {
  return { startDate: vacationData.startDate, endDate: vacationData.endDate };
}

function getUserInfo(record) {
  return {
    "userId": record.user._id,
    "userName": record.user.name,
    "vacations": [
      {
        "startDate": record.startDate,
        "endDate": record.endDate,
      },
    ],
  };
}
