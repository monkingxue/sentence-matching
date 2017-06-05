const fs = require('fs');
const jieba = require('nodejieba');

jieba.load();
const path = 'BoP2017-DBQA.train.txt';
const text = fs.readFileSync(path, 'utf-8');

const resource = text.split(/\r?\n/).map(item => item.split('\t'));

const data = resource.reduce((result, next) => {
  const q = splitWord(next[1]), a = splitWord(next[2]), t = next[0];
  result[q] = (result[q] || []).concat([{answer: a, right: t}]);
  return result
}, {});

function splitWord(str) {
  const step1 = jieba.tag(str)
    // .filter(item => ['n', 'v'].indexOf(item.tag) !== -1)
    .map(item => item.word)
    // .filter((item, i, arr) => arr.indexOf(item) === i)
    .join('$$');

  return step1;

  // return jieba.extract(step1, 10)
  //   .map(item => item.word).sort().join('$$');
}

function writeDataToFile(path, data) {
  let result = '';
  for(let line in data) {
    if(data.hasOwnProperty(line)) {
      result += line + "\t"+ data[line].map(({answer, right}) => `${answer} ${right}`).join('\t') + '\n';
    }
  }

  fs.writeFileSync(path, result);
}

writeDataToFile('./data.txt', data);

module.exports = {
  data
};
