const fuzz = require('fuzzball');
const fs = require('fs');

const text = fs.readFileSync('./data.txt', 'utf-8');

const resource = text.split(/\r?\n/).map(item => item.split('\t'));

const data = resource.filter(item => item.length > 1)
  .reduce((result, [q, ...a]) => {
    result[q] = a.map(item => {
      const [answer, right] = item.split(' ');
      return {answer, right}
    });
    return result;
  }, {});


function appearTimes(item, answers) {
  return answers.reduce((result, acc) =>
  result + acc.filter(i => i === item).length, 0)
}

function calculate(question, answers) {
  answers = answers.map(item => item.split('$$'));
  question = question.split('$$');

  const weights = {};
  question.forEach(item => {
    weights[item] = 1 / Math.pow(appearTimes(item, answers) + 1, 2);
  });

  return answers.map(answer => {
    return answer.filter(item => question.indexOf(item) !== -1)
      .reduce((result, acc) => result + weights[acc], 0);
  });
}

let correct = 0;

for (let q in data) {
  if (data.hasOwnProperty(q)) {
    const answers = data[q].map(item => item.answer).filter(item => item.length > 0);
    const rights = data[q].map(item => item.right);
    const rawResult = calculate(q, answers);
    const result =
      rawResult.map((item, i) => ({answer: item, right: rights[i]}))
        .sort((a, b) => b.answer - a.answer);
    const idx =  result.map(item=>item.right).indexOf('1');
    // // const result = fuzz.extract(q, answer, {scorer: fuzz.ratio});
    // const idx = result.map(item => data[q][item[2]].right).indexOf('1');
    correct += idx < 1 ? 1 : 0;
  }
}

console.log(correct / Object.keys(data).length);


