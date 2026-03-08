const fs = require('fs');
const html = fs.readFileSync(__dirname + '/tests.html', 'utf8');

const scripts = [];
const re = /<script[^>]*>([\s\S]*?)<\/script>/g;
let match;
while ((match = re.exec(html)) !== null) {
  scripts.push(match[1]);
}
const scriptContent = scripts.join('\n');

// Replace the render function to log results to console
const patchedScript = scriptContent.replace(
  /function renderResults\(\)\s*\{[\s\S]*?\n\}/,
  `function renderResults() {
    console.log(totalPass + ' passed, ' + totalFail + ' failed (' + (totalPass + totalFail) + ' total)');
    for (const g of groups) {
      for (const t of g.tests) {
        if (!t.pass) console.log('FAIL: ' + g.name + ' > ' + t.name + ' — ' + t.error);
      }
    }
    if (totalFail > 0) process.exit(1);
  }`
);

global.document = {
  getElementById: () => ({ innerHTML: '', textContent: '', style: {}, classList: { add(){}, remove(){} }, appendChild(){}, addEventListener(){}, removeEventListener(){}, querySelector: ()=>null, querySelectorAll: ()=>[] }),
  createElement: (tag) => ({ getContext: () => ({ fillRect(){}, beginPath(){}, arc(){}, fill(){}, stroke(){}, fillText(){}, clearRect(){}, save(){}, restore(){}, drawImage(){} }), style: {}, appendChild(){}, addEventListener(){}, width:0, height:0, tagName:tag }),
  querySelectorAll: () => [],
  querySelector: () => null,
  body: { appendChild(){} }
};
global.window = { addEventListener(){}, innerWidth: 960, innerHeight: 800 };
global.localStorage = (() => { const s = {}; return { getItem: k => s[k]||null, setItem: (k,v) => s[k]=String(v), removeItem: k => delete s[k], clear: () => { for(let k in s) delete s[k]; } }; })();
global.Image = class { set src(v) { if(this.onload) setTimeout(()=>this.onload(),0); } };
global.URL = { createObjectURL: () => 'blob:test', revokeObjectURL: () => {} };
global.Blob = class { constructor(){} };
global.requestAnimationFrame = () => 0;
global.cancelAnimationFrame = () => {};
global.alert = () => {};

try {
  eval(patchedScript);
} catch(e) {
  console.error('Eval error:', e.message);
  console.error(e.stack);
  process.exit(1);
}
