const fs = require("fs");
const data = [];


fs.readFile("./vacations.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file:", err);
    return;
  }
  try {
    const vacations = JSON.parse(jsonString);

    vacations.forEach(vacation => {
        data.find( el => data.userId === vacation.user._id) ? data.userId[vacation.user._id].vacations.push({"startDate": vacation.startDate, "endDate": vacation.endDate}) : data.push(getUserInfo(vacation));
    });

    fs.writeFileSync('./out.json', JSON.stringify(data))

  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});

function getUserInfo(record) {
    return {
        "userId": record.user._id,
        "userName": record.user.name,
        "vacations":[
            {
                "startDate": record.startDate,
                "endDate": record.endDate
            }
        ]
    }
}