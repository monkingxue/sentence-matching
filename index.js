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

let correct = 0;

for (let q in data) {
  if (data.hasOwnProperty(q)) {
    const answer = data[q].map(item => item.answer).filter(item => item.length > 0);
    const result = fuzz.extract(q, answer, {scorer: fuzz.ratio});
    const idx = result.map(item => data[q][item[2]].right).indexOf('1');
    correct += idx < 3 ? 1 : 0;
  }
}

console.log(correct / Object.keys(data).length);


