const writeFileSync = require('fs').writeFileSync;
const gzipSync = require('zlib').gzipSync;
const mkdirp = require('mkdirp');
const request = require('request');
const unzipParse = require('unzip').Parse;
const moment = require('moment');
const csv = require('fast-csv');
const decodeStream = require('iconv-lite').decodeStream;
const hiraganize = require('japanese').hiraganize;
const toZenkaku = require('hanzen').toZenkaku;
const version = require('./package.json').version;

mkdirp('lib');
const filename = 'lib/zipcode-ja.json';
const uri = 'http://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip';

let lastModified;
const zipcodes = {};

request(uri, function (error, response) {
  if (error) {
    throw error;
  }
  const date = new Date(response.headers['last-modified']);
  lastModified = moment(date).format('YYYY-MM-DD');
})
.pipe(unzipParse())
.on('entry', function (entry) {
  if (entry.path !== 'KEN_ALL.CSV') {
    return;
  }
  entry
  .pipe(decodeStream('SJIS'))
  .pipe(csv())
  .on('data', (line) => {
    if (line.length === 0) {
      return;
    }
    const [
      jisX0402, zipcodeOld, zipcode,
      kanaTodofuken, kanaShikuchoson, kanaChoiki,
      todofuken, shikuchoson, choiki,
      ...status
    ] = line;
    const data = {
      zipcode,
      zipcodeOld,
      jisX0402,
      address: [
        todofuken,
        shikuchoson,
        choiki === '以下に掲載がない場合' ? '' : choiki
      ],
      ruby: [
        hiraganize(toZenkaku(kanaTodofuken)),
        hiraganize(toZenkaku(kanaShikuchoson)),
        hiraganize(toZenkaku(kanaChoiki))
      ],
      status: status.map(char => Number(char))
    };
    zipcodes[zipcode] = data;
  })
  .on('end', () => {
    const data = JSON.stringify(Object.assign({version, lastModified}, zipcodes));
    if (zipcodes.length === 0) {
      throw new Error('request failured');
    }
    writeFileSync(`${filename}`, data);
    writeFileSync(`${filename}.gz`, gzipSync(data));
  });
});
