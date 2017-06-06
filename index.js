const fuzz = require('fuzzball');
const fs = require('fs');

const text = fs.readFileSync('./data.txt', 'utf-8');

const resource = text.split(/\r?\n/).map(item => item.split('\t'));

const data = resource.filter(item => item.length > 1)
  .reduce((result, [q, ...a]) => {
    result[q] = a.map(item => {
      const [answer, right] = item.split('&&');
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
    weights[item] = 1 / Math.pow(appearTimes(item, answers), 2);
  });

  return answers.map(answer => {
    return answer.filter(item => question.indexOf(item) !== -1)
      .reduce((result, acc) => result + weights[acc], 0);
  });
}

let correct = 0;

let result = '';

for (let q in data) {
  if (data.hasOwnProperty(q)) {
    const answers = data[q].map(item => item.answer).filter(item => item.length > 0);
    const rawResult = calculate(q, answers);
    result += rawResult.join('\n') + '\n';
  }
}

fs.writeFileSync('./output.txt', result);


