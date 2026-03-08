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
  `div.className = 'test fail'; console.log('FAIL: ' + name + (detail ? ' (' + detail + ')' : ''));`
);

// Mock DOM
function mockElement() {
  const classes = new Set();
  const el = {
    innerHTML: '', textContent: '', style: {}, className: '',
    classList: {
      add(...c) { c.forEach(x => classes.add(x)); },
      remove(...c) { c.forEach(x => classes.delete(x)); },
      contains(c) { return classes.has(c); },
      toggle(c, force) { if (force) classes.add(c); else classes.delete(c); },
    },
    appendChild(){}, removeChild(){}, addEventListener(){}, removeEventListener(){},
    querySelector: () => mockElement(), querySelectorAll: () => [],
    scrollTop: 0, scrollHeight: 0, clientHeight: 0,
    children: [], closest: () => null, getAttribute: () => null,
    remove(){}, dataset: {},
  };
  return el;
}
global.document = {
  getElementById: () => mockElement(),
  createElement: () => mockElement(),
  querySelectorAll: () => [],
  querySelector: () => mockElement(),
  body: { appendChild(){}, removeChild(){} },
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
