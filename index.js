var buffer = require('fs').readFileSync(__dirname + '/lib/zipcode-ja.json.gz');
var inflate = require('pako').inflate;

module.exports = JSON.parse(inflate(buffer, {to: 'string'}));
