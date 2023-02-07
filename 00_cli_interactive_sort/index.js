const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const options = {
  a: sortWords,
  b: sortNumbersAscending,
  c: sortNumbersDescending,
  d: sortWordsByLength,
  e: getUniqWords,
  f: getUniqValues,
  exit: closeInput,
};
const question = 'Enter from 2 to 10 words or digits dividing them in space: ';
const optionsQuestion = '\033[1mPls select option:\033[0m \na. Sort words alphabetically \nb. Show numbers from lesser to greater\nc. Show numbers from bigger to smaller\nd. Display words in ascending order by number of letters in the word\ne. Show only unique words\nf. Display only unique values from the set of words and numbers\n   or type \'exit\' for exit\n *write only letter: ';

(function getInput(message) {
  readline.question(message, (str) => {
    if (str === "exit") {
      process.exit();
    }
    const elements = cutRedundantSpaces(str);

    elements.length > 1 && elements.length <= 10
      ? readline.question(optionsQuestion, (option) => {
          if (options[option]) {
            const obj = {
              allElements: elements,
              words: elements.filter((el) => isNaN(Number(el))),
              numbers: elements.filter((el) => !isNaN(Number(el))),
            };
            console.log(options[option](obj));
            getInput(question);
          } else {
            console.log("\033[1mWrong input, try again\033[0m");
            getInput(question);
          }
        })
      : getInput(question);
  });
})('Hello, ' + question);

function sortWords(input) {
  return input.words.sort();
}
function sortNumbersAscending(input) {
  return input.numbers.sort((a, b) => a - b);
}
function sortNumbersDescending(input) {
  return input.numbers.sort((a, b) => b - a);
}
function sortWordsByLength(input) {
  return input.words.sort((a, b) => a.length - b.length);
}
function getUniqWords(input) {
  return input.words.filter((v, i, a) => a.indexOf(v) === i);
}
function getUniqValues(input) {
  return input.allElements.filter((v, i, a) => a.indexOf(v) === i);
}
function closeInput() {
  process.exit();
}

function cutRedundantSpaces(string) {
  return string.replace(/\s+/g, " ").trim().split(" ");
}
