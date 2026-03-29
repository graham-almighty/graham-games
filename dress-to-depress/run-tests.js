const fs = require('fs');
const html = fs.readFileSync(__dirname + '/tests.html', 'utf8');

const scripts = [];
const re = /<script[^>]*>([\s\S]*?)<\/script>/g;
let match;
while ((match = re.exec(html)) !== null) {
  scripts.push(match[1]);
}
const scriptContent = scripts.join('\n');

// Patch the render results section to output to console
const patchedScript = scriptContent.replace(
  /\/\/ ═══ RENDER RESULTS ═══[\s\S]*$/,
  `
const passed = _tests.filter(t => t.passed).length;
const failed = _tests.filter(t => !t.passed).length;
const total = _tests.length;
_tests.filter(t => !t.passed).forEach(t => console.log('FAIL: ' + t.name + (t.error ? ' (' + t.error + ')' : '')));
console.log(passed + ' passed, ' + failed + ' failed (' + total + ' total)');
if (failed > 0) process.exit(1);
  `
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
