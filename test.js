var assert = require('assert');
var version = require('./package').version;
var zipcodeJa = require('./shim');

it('ライブラリのバージョンを取得できるべき', function () {
  assert(zipcodeJa.version === version);
});
it('住所データの更新日時を取得できるべき', function () {
  assert(zipcodeJa.lastModified.match(/^\w{4}-\w{2}-\w{2}$/));
});
it('同期的に住所を取得できるべき', function () {
  assert.deepEqual(zipcodeJa['1000000'], {
    zipcode: '1000000',
    zipcodeOld: '100  ',
    jisX0402: '13101',
    address: [
      '東京都',
      '千代田区',
      ''
    ],
    ruby: [
      'とうきょうと',
      'ちよだく',
      ''
    ],
    status: [
      0,
      0,
      0,
      0,
      0,
      0
    ]
  });
});
