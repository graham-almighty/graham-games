const fs = require('fs');
const html = fs.readFileSync(__dirname + '/tests.html', 'utf8');

const scripts = [];
const re = /<script[^>]*>([\s\S]*?)<\/script>/g;
let match;
while ((match = re.exec(html)) !== null) {
  scripts.push(match[1]);
}
const scriptContent = scripts.join('\n');

// Patch the summary function to output to console
const patchedScript = scriptContent.replace(
  /function showSummary\(\)\s*\{[\s\S]*?\n\}/,
  `function showSummary() {
    console.log(_passed + ' passed, ' + _failed + ' failed (' + (_passed + _failed) + ' total)');
    if (_failed > 0) process.exit(1);
  }`
).replace(
  /div\.className = 'test fail';/,
  `div.className = 'test fail'; console.log('FAIL: ' + fullName);`
);

// Mock DOM
global.document = {
  getElementById: () => ({
    innerHTML: '', textContent: '', style: {}, className: '',
    classList: { add(){}, remove(){} },
    appendChild(){}, addEventListener(){}, removeEventListener(){},
    querySelector: ()=>null, querySelectorAll: ()=>[]
  }),
  createElement: () => ({
    style: {}, className: '', innerHTML: '', textContent: '',
    appendChild(){}, addEventListener(){},
  }),
  querySelectorAll: () => [],
  querySelector: () => null,
  body: { appendChild(){} },
};
global.window = { addEventListener(){}, innerWidth: 960, innerHeight: 800 };
global.requestAnimationFrame = () => 0;
global.cancelAnimationFrame = () => {};
global.performance = { now: () => Date.now() };

try {
  eval(patchedScript);
} catch (e) {
  console.error('Eval error:', e.message);
  console.error(e.stack);
  process.exit(1);
}
