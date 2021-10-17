fs = require('fs');
const { sys } = require('typescript');
var pjson = require('./package.json');
const authors = fs.readFileSync('AUTHORS.js');
const minrequire = fs.readFileSync('minrequire.js');
let seedrandom = '';
if (sys.args[0] === 'withseed') {
  seedrandom = fs.readFileSync('node_modules/seedrandom/seedrandom.js', 'utf8');
  seedrandom = seedrandom.replace('&& module.exports', '&& false');
  seedrandom = seedrandom.replace('&& define.amd', '&& false');
  seedrandom += `\nfunction seedrandom(seed) { return new Math.seedrandom(seed); }`
}
if (!fs.existsSync('bin')) {
  fs.mkdirSync('bin');
}
fs.writeFileSync('bin/preamble.js', `/* ${pjson.name} ${pjson.version} - ${pjson.description} */
${minrequire}
${authors}
${seedrandom}
var nodeRequire = (typeof require !== 'undefined') ? require : (x) => (x === 'seedrandom') ? seedrandom : undefined;
`);
