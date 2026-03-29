const fs = require('fs');
const html = fs.readFileSync(__dirname + '/tests.html', 'utf8');

const scripts = [];
const re = /<script[^>]*>([\s\S]*?)<\/script>/g;
let match;
while ((match = re.exec(html)) !== null) {
  scripts.push(match[1]);
}
const scriptContent = scripts.join('\n');

// Patch the summary and assert functions to output to console
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
global.document = {
  getElementById: () => ({
    innerHTML: '', textContent: '', style: {}, className: '',
    classList: { add(){}, remove(){} },
    appendChild(){}, addEventListener(){}, removeEventListener(){},
    querySelector: ()=>null, querySelectorAll: ()=>[]
  }),
  createElement: () => ({
    style: {}, className: '', innerHTML: '',
    appendChild(){}, addEventListener(){},
    getContext: () => ({
      fillRect(){}, beginPath(){}, arc(){}, fill(){}, stroke(){},
      fillText(){}, clearRect(){}, save(){}, restore(){}, drawImage(){},
      moveTo(){}, lineTo(){}, closePath(){}, setLineDash(){},
      translate(){}, rotate(){}, scale(){}, roundRect(){},
    }),
  }),
  querySelectorAll: () => [],
  querySelector: () => null,
  body: { appendChild(){} },
};
global.window = { addEventListener(){}, innerWidth: 960, innerHeight: 800 };
global.localStorage = (() => {
  const s = {};
  return {
    getItem: k => s[k] || null,
    setItem: (k, v) => s[k] = String(v),
    removeItem: k => delete s[k],
    clear: () => { for (let k in s) delete s[k]; },
  };
})();
global.requestAnimationFrame = () => 0;
global.cancelAnimationFrame = () => {};
global.AudioContext = class { createOscillator(){return{connect(){},start(){},stop(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}}};} createGain(){return{connect(){},gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},value:0}};} createBuffer(){return{getChannelData(){return new Float32Array(100)}};} createBufferSource(){return{connect(){},start(){},buffer:null};} get currentTime(){return 0;} get sampleRate(){return 44100;} get destination(){return{};} };
global.Image = class { set src(v) { if (this.onload) setTimeout(() => this.onload(), 0); } };
global.performance = { now: () => Date.now() };

try {
  eval(patchedScript);
} catch (e) {
  console.error('Eval error:', e.message);
  console.error(e.stack);
  process.exit(1);
}
