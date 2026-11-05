const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const test = require('node:test');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
const source = scripts.find(s => s[2].includes('var Engine'))[2];
const context = {module: {exports: {}}};
vm.createContext(context);
vm.runInContext(source, context);
const engine = context.module.exports;
const machine = {zDown: 14, zUp: 25, fDraw: 1800, fTravel: 15000, fZ: 1200,
  fLand: 600, accel: 0, bedX: 256, bedY: 256, home: true, pause: true,
  cut: false, toolX: 28, toolY: 35};

test('all embedded JavaScript and translation JSON parse', () => {
  for (const [, attrs, code] of scripts) {
    if (attrs.includes('application/json')) JSON.parse(code);
    else new vm.Script(code);
  }
  assert(!/<script\b[^>]*\bsrc\s*=/i.test(html), 'Runtime scripts must remain local');
});

test('draw compensates pen XY and never homes with the holder mounted', () => {
  const g = engine.gcodeWrite([[{x: 20, y: 30}, {x: 21, y: 31}]], machine, 'test', '3.0');
  assert(g.includes('G1 X48.000 Y65.000'));
  assert(g.includes('G1 X49.000 Y66.000'));
  assert(!/^G28\b/m.test(g));
  assert(/\bZ14(?:\.0+)?\b/.test(g));
});

test('homing remains a separate operation with no XY positioning', () => {
  const g = engine.gcodeHoming(machine, 'test', '3.0');
  assert(/^G28\b/m.test(g));
  assert(!/^G[01]\s.*\b[XY]-?\d/m.test(g));
});

test('reachable pen boundary accepts the edge and rejects either overflow', () => {
  assert(engine.gcodeWrite([[{x: 228, y: 221}, {x: 227, y: 220}]], machine, 'edge', '3.0').includes('X256.000 Y256.000'));
  for (const point of [{x: 228.001, y: 221}, {x: 228, y: 221.001}]) {
    assert.throws(() => engine.gcodeWrite([[point]], machine, 'outside', '3.0'), /reachable/);
  }
  assert.throws(() => engine.gcodeWrite([[{x: 20, y: 30}]], {...machine, toolX: NaN}, 'bad', '3.0'), /finite/);
});

function frame(shape, p) {
  const ratio = (shape.maxY - shape.minY) / (shape.maxX - shape.minX);
  const a = p.rot * Math.PI / 180, c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a));
  const w = p.width * (c + ratio * s), h = p.width * (s + ratio * c);
  const x = p.paperX + p.paperW / 2 + p.offU, y = p.paperY + p.paperH / 2 + p.offV;
  return [[{x:x-w/2, y:y-h/2}, {x:x+w/2, y:y+h/2}]];
}

test('Fit respects paper, rotation and reachable area without moving the paper', () => {
  const shape = {minX:0, minY:0, maxX:100, maxY:200, w:100, h:200};
  let checked = 0;
  for (const [paperW,paperH,paperX,paperY] of [[148,210,54,23],[210,148,23,54],[105,148,75.5,54],[148,105,54,75.5],[100,100,180,180],[400,400,0,0]]) {
    for (const rot of [0,17,45,90,180,-90]) for (const [toolX,toolY] of [[28,35],[-28,-35],[0,0]]) {
      const m = {...machine, toolX, toolY}, p = {paperX,paperY,paperW,paperH,margin:8,rot,thick:0};
      const fit = engine.fitPlacement(shape, p, m);
      if (!fit) continue;
      const placed = {...p, ...fit};
      assert.equal(placed.paperX, paperX);
      assert.equal(placed.paperY, paperY);
      assert.equal(engine.toolheadError(frame(shape, placed), m), null);
      checked++;
    }
  }
  assert.equal(checked, 108);
  assert.equal(engine.fitPlacement(shape, {paperX:230,paperY:23,paperW:148,paperH:210,margin:8,rot:0,thick:0}, machine), null);
});
