const fs = require("fs");
const endpoints = fs
  .readFileSync("./endpoints.txt", { encoding: "utf8", flag: "r" })
  .split(/\r?\n/);
const data = [];

const fetch_retry = (url, n) =>
  fetch(url).catch(function (error) {
    if (n === 1)
      throw console.log(`[Fail] ${url}: The endpoint is unavailable`);
    return fetch_retry(url, n - 1);
  });

async function getAllResponses() {
  let trueValues = 0,
    falseValues = 0;

  endpoints.forEach(async (url) => {
    const response = await fetch_retry(url, 3);
    const result = await response.json();
    const isDoneValue = findKey(result, "isDone");
    isDoneValue ? trueValues ++ : falseValues ++;
    console.log(`[Success] ${url}: isDone - ${isDoneValue}`);
    console.log('trueValues', trueValues)
    console.log('falseValues', falseValues)
  });

  return [trueValues, falseValues];
}

(async () => {
  const counters = await getAllResponses();

  console.log( `\n Found True values: ${counters[0]}\n Found False values: ${counters[1]}` );
})();

function findKey(obj, searchingKey) {
  if (obj[searchingKey] !== undefined) {
    return obj[searchingKey];
  } else {
    if (typeof obj === "object") {
      let res;
      for (const [key, value] of Object.entries(obj)) {
        value[searchingKey] !== undefined
          ? (res = value[searchingKey])
          : findKey(value, searchingKey);
      }
      return res;
    }
  }
}
