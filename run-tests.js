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
    _innerHTML: '', textContent: '', style: {}, _className: '', id: '',
    classList: {
      add(...c) { c.forEach(x => classes.add(x)); },
      remove(...c) { c.forEach(x => classes.delete(x)); },
      contains(c) { return classes.has(c); },
      toggle(c, force) { if (force) classes.add(c); else classes.delete(c); },
    },
    appendChild(child){ child.parentNode = this; this.children.push(child); return child; },
    removeChild(child){ this.children = this.children.filter(c => c !== child); return child; },
    addEventListener(){}, removeEventListener(){},
    querySelector(selector) { return findOne(this, selector) || mockElement(); },
    querySelectorAll(selector) { return findAll(this, selector); },
    scrollTop: 0, scrollHeight: 0, clientHeight: 0,
    children: [], closest: () => null, getAttribute: () => null,
    remove(){}, dataset: {},
  };
  Object.defineProperty(el, 'className', {
    get() { return this._className; },
    set(v) {
      this._className = v || '';
      classes.clear();
      this._className.split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
    }
  });
  Object.defineProperty(el, 'innerHTML', {
    get() { return this._innerHTML; },
    set(v) {
      this._innerHTML = v || '';
      this.children = [];
      parseInnerHtml(this, this._innerHTML);
    }
  });
  Object.defineProperty(el, 'scrollHeight', {
    get() {
      const childHeight = this.children.reduce((sum, child) => sum + parsePx(child.style.height), 0);
      return childHeight || parsePx(this.style.height);
    },
    set(v) { this._scrollHeight = v; }
  });
  Object.defineProperty(el, 'clientHeight', {
    get() { return parsePx(this.style.height) || this._clientHeight || 0; },
    set(v) { this._clientHeight = v; }
  });
  return el;
}
function parsePx(v) {
  const n = parseInt(v || '0', 10);
  return Number.isFinite(n) ? n : 0;
}
function matchesSelector(el, selector) {
  if (!selector) return false;
  if (selector[0] === '#') return el.id === selector.slice(1);
  if (selector[0] === '.') return el.classList.contains(selector.slice(1));
  return false;
}
function findAll(root, selector) {
  const out = [];
  function visit(node) {
    node.children.forEach(child => {
      if (matchesSelector(child, selector)) out.push(child);
      visit(child);
    });
  }
  visit(root);
  return out;
}
function findOne(root, selector) {
  return findAll(root, selector)[0] || null;
}
function parseInnerHtml(parent, html) {
  const tagRe = /<([a-z0-9]+)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = tagRe.exec(html)) !== null) {
    const child = mockElement();
    const attrs = match[2] || '';
    const id = attrs.match(/\bid="([^"]+)"/);
    const cls = attrs.match(/\bclass="([^"]+)"/);
    if (id) child.id = id[1];
    if (cls) child.className = cls[1];
    child.textContent = match[3].replace(/<[^>]+>/g, '');
    child.innerHTML = match[3];
    parent.appendChild(child);
  }
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
