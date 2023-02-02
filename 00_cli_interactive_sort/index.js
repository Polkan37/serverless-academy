const readline = require('readline').createInterface({
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
  exit: closeInput
};

(function getString(message) {
  readline.question(message, str => {
    if (str === 'exit') {
      return readline.close();
    }
    const elements = str.replace(/\s+/g, ' ').trim().split(' ');

    elements.length > 1 ?
      readline.question(`Pls select option: \n
    a. Sort words alphabetically
    b. Show numbers from lesser to greater
    c. Show numbers from bigger to smaller
    d. Display words in ascending order by number of letters in the word
    e. Show only unique words
    f. Display only unique values from the set of words and numbers\n
    or type 'exit' for exit
    *write only letter: `, option => {
        const obj = {
          allElements: elements,
          words: elements.filter(el => isNaN(Number(el))),
          numbers: elements.filter(el => !isNaN(Number(el)))
        }
        console.log(options[option](obj));
        getString(`Enter 10 words or digits dividing them in space: `);
      }) : getString(`Pls, enter more than 1 number or word dividing by space: `)
  });
})(`Hello, enter 10 words or digits dividing them in space: `);

function sortWords(input) {
  return input.words.sort()
}
function sortNumbersAscending(input) {
  return input.numbers.sort((a, b) => a - b)
}
function sortNumbersDescending(input) {
  return input.numbers.sort((a, b) => b - a)
}
function sortWordsByLength(input) {
  return input.words.sort((a, b) => a.length - b.length)
}
function getUniqWords(input) {
  return input.words.filter((v, i, a) => a.indexOf(v) === i)
}
function getUniqValues(input) {
  return input.allElements.filter((v, i, a) => a.indexOf(v) === i)
}
function closeInput() {
  readline.close()
}
