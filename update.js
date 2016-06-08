const execSync = require('child_process').execSync;
const spawn = require('child_process').spawn;
const writeFileSync = require('fs').writeFileSync;
const gzipSync = require('zlib').gzipSync;
const moment = require('moment');
const csv = require('fast-csv');
const decodeStream = require('iconv-lite').decodeStream;
const hiraganize = require('japanese').hiraganize;
const toZenkaku = require('hanzen').toZenkaku;
const version = require('./package.json').version;

const filename = 'lib/zipcode-ja.json';
const uri = 'http://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip';

const date = new Date(execSync(`curl --head ${uri}`).toString().match(/Last-Modified: (.+)/)[1]);
const lastModified = moment(date).format('YYYY-MM-DD');

const zipcodes = {};
spawn(`curl ${uri} | bsdtar -xv -O`, {shell: true})
.stdout.pipe(decodeStream('SJIS'))
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
  writeFileSync(`${filename}`, data);
  writeFileSync(`${filename}.gz`, gzipSync(data));
});
