const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
function moduleFor(marker){const c={module:{exports:{}}};vm.createContext(c);vm.runInContext(scripts.find(s=>s[1].includes(marker))[1],c);return c.module.exports;}
const engine=moduleFor('var Engine'),tools=moduleFor('var PlotTools');
const plain=x=>JSON.parse(JSON.stringify(x));
const pt=(x,y)=>({x,y});
test('dedup preserves pen gaps and handles reversed segments; joining is opt-in',()=>{
  const paths=[[pt(0,0),pt(1,0),pt(2,0)],[pt(2,0),pt(1,0)],[pt(2.1,0),pt(3,0)]];
  const clean=plain(engine.cleanPaths(paths,true,0));assert.equal(clean.length,2);
  const joined=plain(engine.cleanPaths(paths,true,.11));assert.equal(joined.length,1);
  assert.equal(engine.cleanPaths(paths,false,0).length,3);
});
test('polygon clipping splits lines at holes and applies nested intersection',()=>{
  const outer=[pt(0,0),pt(10,0),pt(10,10),pt(0,10)],hole=[pt(4,4),pt(6,4),pt(6,6),pt(4,6)];
  const clip=[[{polys:[outer,hole],evenOdd:true}]];
  const paths=plain(engine.clipPaths([[pt(-2,5),pt(12,5)]],clip));
  assert.deepEqual(paths,[[pt(0,5),pt(4,5)],[pt(6,5),pt(10,5)]]);
  const narrow=[{polys:[[pt(2,0),pt(8,0),pt(8,10),pt(2,10)]],evenOdd:true}];
  assert.deepEqual(plain(engine.clipPaths([[pt(-2,5),pt(12,5)]],clip.concat([narrow]))),[[pt(2,5),pt(4,5)],[pt(6,5),pt(8,5)]]);
});
test('physical bed and head travel have independent limits even with zero offset',()=>{
  const m={bedX:260,bedY:260,toolX:0,toolY:0,headMaxX:256,headMaxY:256};
  assert.equal(engine.toolheadError([[pt(257,20)]],m).includes('right'),true);
  assert.equal(engine.toolheadError([[pt(256,20)]],m),null);
  assert.match(engine.toolheadError([[pt(10,20)]],{...m,headMinX:260}),/do not overlap/);
});
test('single-line alphabet rejects unsupported input rather than silently dropping it',()=>{
  assert.match(tools.textSvg('Ciao 2026!',10,'#000000'),/<path/);
  assert.throws(()=>tools.textSvg('🙂',10,'#000000'),/Unsupported/);
  assert.throws(()=>tools.textSvg('A',NaN,'#000000'),/height/);
  assert.throws(()=>tools.textSvg('A',10,'url(https://example.com)'),/colour/);
});
test('raster conversion keeps holes and creates one pen group for tones',()=>{
  const data=new Uint8ClampedArray(5*5*4).fill(255);
  for(let y=1;y<4;y++)for(let x=1;x<4;x++)if(x!==2||y!==2){const i=(y*5+x)*4;data[i]=data[i+1]=data[i+2]=0;}
  const svg=tools.rasterSvg(data,5,5,'threshold',128);
  assert.equal((svg.match(/ Z/g)||[]).length,2);assert.match(svg,/fill-rule="evenodd"/);
  assert.match(tools.rasterSvg(data,5,5,'tone',128),/data-pen-color="#000000"/);
  assert.throws(()=>tools.rasterSvg(data,999,999,'tone',128),/dimensions/);
});
test('project schema rejects invalid numbers, modes and versions',()=>{
  const project={format:'homelab-plotter',version:1,svg:'<svg/>',mode:'draw',settings:{zup:25},groups:[]};
  assert.equal(tools.validateProject(project),project);
  for(const bad of [{...project,version:2},{...project,mode:'x'},{...project,settings:{zup:Infinity}},{...project,groups:[{key:'x',style:99,spacing:1,enabled:true}]}])assert.throws(()=>tools.validateProject(bad));
});
