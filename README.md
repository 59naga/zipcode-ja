`zipcode-ja`
---

<p align="right">
  <a href="https://npmjs.org/package/zipcode-ja">
    <img src="https://img.shields.io/npm/v/zipcode-ja.svg?style=flat-square">
  </a>
  <a href="https://travis-ci.org/59naga/zipcode-ja">
    <img src="http://img.shields.io/travis/59naga/zipcode-ja.svg?style=flat-square">
  </a>
  <a href="https://gemnasium.com/59naga/zipcode-ja">
    <img src="https://img.shields.io/gemnasium/59naga/zipcode-ja.svg?style=flat-square">
  </a>
</p>

<p align="center">
  <a href="https://saucelabs.com/u/59798">
    <img src="http://soysauce.berabou.me/u/59798/zipcode-ja.svg">
  </a>
</p>

[日本郵便 平成28年5月31日更新 郵便番号データ](http://www.post.japanpost.jp/zipcode/dl/kogaki-zip.html) NodeJS / ブラウザ用 JavaScript

インストール
---

**NodeJS**
```bash
npm install zipcode-ja --save
```

```js
import zipcodeJa from 'zipcode-ja';
console.log(zipcodeJa.version, zipcodeJa.lastModified); // '0.0.0', '2016-05-31'
```

**ブラウザ**（[Download Latest](http://npm-tarball.antle.red/zipcode-ja)）
```html
<script src="zipcode-ja/lib/zipcode-ja.js"></script>
<script>
console.log(zipcodeJa.version, zipcodeJa.lastModified); // '0.0.0', '2016-05-31'
</script>
```

[デモページ](http://jsdo.it/59naga/zipcode-ja)

使用方法
---

`zipcodeJa`は、一つの巨大なオブジェクトです。実在する郵便番号をキーとして与えると、対応する住所を返します。

```js
console.log(zipcodeJa['1000002']);
// {
//   zipcode: '1000002',
//   zipcodeOld: '100',
//   jisX0402: '13101',
//   address: [
//     '東京都',
//     '千代田区',
//     '皇居外苑'
//   ],
//   ruby: [
//     'とうきょうと',
//     'ちよだく',
//     'こうきょがいえん'
//   ],
//   status: [
//     0,
//     0,
//     0,
//     0,
//     0,
//     0
//   ]
// }
```

それぞれのプロパティは、元データである[郵便番号データの説明](http://www.post.japanpost.jp/zipcode/dl/readme.html)に対応しています。

* `zipcode` … `郵便番号（7桁）`
* `zipcodeOld` … `（旧）郵便番号（5桁）`
* `jisX0402` … `全国地方公共団体コード（JIS X0401、X0402）`
* `address` … `都道府県名／漢字`, `市区町村名／漢字`, `町域名／漢字`
* `ruby` … `都道府県名／半角カタカナ`, `市区町村名／半角カタカナ`, `町域名／半角カタカナ`
* `status`
  0. `一町域が二以上の郵便番号で表される場合の表示`
  1. `小字毎に番地が起番されている町域の表示`
  2. `丁目を有する町域の場合の表示`
  3. `一つの郵便番号で二以上の町域を表す場合の表示`
  4. `更新の表示`
  5. `変更理由`

注意事項として
  * `address`の`町域名`が「以下に掲載がない場合」を「」に置換
  * `ruby`は半角カタカナではなく、全角ひらがなに置換

これは、他のスクリプトから利用する際の手順を省略するための調整です。

他のライブラリとの差異
---
* [AjaxZip3/yubinbango](https://github.com/ajaxzip3/ajaxzip3.github.io#readme) と違い、DOM依存を行いません。
* [japan-postal-code](https://github.com/mzp/japan-postal-code#readme) と違い、コールバック関数を使いません。

開発環境
---
下記が[グローバルインストール](https://github.com/creationix/nvm#readme)されていることが前提です。
* NodeJS v6.2.1
* Npm v3.9.3 (or [pnpm](https://github.com/rstacruz/pnpm))

```bash
git clone https://github.com/59naga/zipcode-ja
cd zipcode-ja
npm install

npm test
```

License
---
[MIT](http://59naga.mit-license.org/)
