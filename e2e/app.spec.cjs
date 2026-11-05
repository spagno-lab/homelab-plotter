const {test,expect}=require('@playwright/test');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const url=pathToFileURL(path.resolve(__dirname,'../index.html')).href;
const simple='<svg xmlns="http://www.w3.org/2000/svg"><g id="Red"><rect x="0" y="0" width="20" height="20" fill="red"/></g><g id="Blue"><path d="M25 0 L45 20" stroke="blue" fill="none"/></g></svg>';
async function ready(page){
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
  await page.waitForFunction(()=>!!window.__homelabPlotter);
  return errors;
}
async function load(page,svg=simple){await page.evaluate(s=>window.__homelabPlotter.loadSvgText(s,'fixture.svg'),svg);await page.waitForFunction(()=>{const s=window.__homelabPlotter.state();return !!s.result&&!s.busy;});}

test('offline startup, defaults, layers and project roundtrip',async({page})=>{
  const errors=await ready(page);await expect(page.locator('h1')).toHaveText('Homelab-Plotter Bambulab X2D');
  for(const [key,value] of Object.entries({zup:'25.00',zdown:'14.00',bedx:'260',bedy:'260',margin:'0.0'}))await expect(page.locator('[data-setting="'+key+'"]').first()).toHaveValue(value);
  await load(page);await expect(page.getByLabel('Enable Red #ff0000')).toBeChecked();
  const original=await page.evaluate(()=>window.__homelabPlotter.projectData());
  expect(original.groups).toHaveLength(2);
  original.placement.right=7.25;original.placement.rotation=17;original.groups[0].enabled=false;
  await page.evaluate(o=>window.__homelabPlotter.openProject(o),original);
  await page.waitForFunction(()=>!window.__homelabPlotter.state().busy);
  const restored=await page.evaluate(()=>window.__homelabPlotter.projectData());
  expect(restored.placement).toEqual(original.placement);expect(restored.groups[0].enabled).toBe(false);
  expect(errors).toEqual([]);
});

test('use references, transformed clipping and independent head limits',async({page})=>{
  const errors=await ready(page);
  const svg='<svg xmlns="http://www.w3.org/2000/svg"><defs><path id="line" d="M0 5 L30 5"/><clipPath id="crop"><rect x="10" y="0" width="10" height="10"/></clipPath></defs><g id="Clipped" transform="translate(5 2)" clip-path="url(#crop)" fill="none" stroke="black"><use href="#line"/></g></svg>';
  await load(page,svg);
  const state=await page.evaluate(()=>{const api=window.__homelabPlotter,s=api.state(),c=s.design.shapes[0].clips[0][0];return {clip:c.contours[0].pts,paths:s.result.paths,design:s.design,params:s.params};});
  expect(Math.min(...state.clip.map(p=>p.x))).toBe(15);
  expect(state.paths.length).toBeGreaterThan(0);
  const bounds=await page.evaluate(()=>window.__homelabPlotter.engine.penBounds({bedX:260,bedY:260,toolX:28,toolY:35,headMinX:0,headMaxX:256,headMinY:0,headMaxY:256}));
  expect(bounds).toEqual({x0:0,y0:0,x1:228,y1:221});expect(errors).toEqual([]);
});

test('single-stroke text and raster conversions produce plottable geometry',async({page})=>{
  const errors=await ready(page);
  await page.getByText('Text and images',{exact:true}).click();
  await page.getByLabel('Text to draw').fill('CIAO 2026!');await page.getByRole('button',{name:'Create text SVG',exact:true}).click();
  await page.waitForFunction(()=>!!window.__homelabPlotter.state().result&&!window.__homelabPlotter.state().busy);
  expect(await page.evaluate(()=>window.__homelabPlotter.state().result.paths.length)).toBeGreaterThan(8);
  const images=await page.evaluate(()=>{
    const a=window.__homelabPlotter,w=8,h=8,data=new Uint8ClampedArray(w*h*4).fill(255);
    for(let y=2;y<6;y++)for(let x=2;x<6;x++){let i=(y*w+x)*4;data[i]=data[i+1]=data[i+2]=0;}
    return ['threshold','tone','edges'].map(m=>{let svg=a.tools.rasterSvg(data,w,h,m,128);let d=a.svgLoader.load(svg);return {m,shapes:d.shapes.length,color:d.shapes[0].color};});
  });
  expect(images.every(i=>i.shapes>0&&i.color==='#000000')).toBe(true);expect(errors).toEqual([]);
});

test('all fill modes, colour passes and exported G-code respect limits',async({page})=>{
  const errors=await ready(page);await load(page);
  for(const mode of ['0','1','2','3','4']){
    await page.locator('[data-setting="style"]').selectOption(mode);
    await page.waitForTimeout(350);await page.waitForFunction(()=>!window.__homelabPlotter.state().busy);
    const output=await page.evaluate(()=>{const a=window.__homelabPlotter,s=a.state(),m=a.machine();return {paths:s.result.paths.length,error:a.engine.toolheadError(s.result.paths,m),gcode:a.engine.gcodeWrite(s.result.paths,m,'check','4.0')};});
    expect(output.paths).toBeGreaterThan(0);expect(output.error).toBe(null);expect(output.gcode).not.toMatch(/^G28/m);
  }
  await page.getByRole('button',{name:'Export colour passes …'}).click();
  await page.getByRole('button',{name:'Yes',exact:true}).click();
  await expect(page.getByText('Colour passes',{exact:true}).last()).toBeVisible();
  await expect(page.getByRole('button',{name:/Homing.gcode download/})).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('adding a text layer preserves artwork placement and saved project downloads reopen',async({page})=>{
  const errors=await ready(page);await load(page);
  const before=await page.evaluate(()=>window.__homelabPlotter.state().result.batches.map(b=>({key:b.key,paths:b.paths})));
  await page.getByText('Text and images',{exact:true}).click();await page.getByLabel('Text to draw').fill('CIAO');
  await page.locator('[data-setting="texty"]').fill('5');
  await page.getByRole('button',{name:'Add text layer',exact:true}).click();
  await page.waitForTimeout(350);await page.waitForFunction(()=>!window.__homelabPlotter.state().busy);
  const after=await page.evaluate(()=>window.__homelabPlotter.state().result.batches);
  expect(after).toHaveLength(3);
  for(const old of before){const current=after.find(b=>b.key===old.key);expect(current.paths.length).toBe(old.paths.length);
    for(let i=0;i<old.paths.length;i++)for(let j=0;j<old.paths[i].length;j++){
      expect(Math.abs(current.paths[i][j].x-old.paths[i][j].x)).toBeLessThan(.06);
      expect(Math.abs(current.paths[i][j].y-old.paths[i][j].y)).toBeLessThan(.06);
    }
  }
  const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Save project',exact:true}).click();const download=await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.plotter\.json$/);
  const file=await download.path();await page.locator('input[accept=".plotter.json,application/json"]').setInputFiles(file);
  await page.waitForTimeout(350);await page.waitForFunction(()=>!window.__homelabPlotter.state().busy);
  expect(await page.evaluate(()=>window.__homelabPlotter.state().groups.length)).toBe(3);expect(errors).toEqual([]);
});

test('objectBoundingBox clips, local symbols, and separate stroke/fill colours',async({page})=>{
  const errors=await ready(page);
  const svg='<svg xmlns="http://www.w3.org/2000/svg"><defs><symbol id="tile" viewBox="0 0 10 10"><rect width="10" height="10" fill="red" stroke="blue"/></symbol><clipPath id="crop" clipPathUnits="objectBoundingBox"><rect x="0.25" y="0" width="0.5" height="1"/></clipPath></defs><g clip-path="url(#crop)"><use href="#tile" x="10" y="10" width="40" height="40"/></g></svg>';
  await load(page,svg);
  const check=await page.evaluate(()=>{const a=window.__homelabPlotter,s=a.state(),clip=s.design.shapes[0].clips[0][0].contours[0].pts;
    const x=clip.map(p=>a.engine.placePoint(s.design,s.params,p.x,p.y).x),all=s.result.paths.flat();
    return {colors:s.groups.map(g=>g.color).sort(),bounds:[Math.min(...x),Math.max(...x)],xs:all.map(p=>p.x)};});
  expect(check.colors).toEqual(['#0000ff','#ff0000']);expect(check.xs.length).toBeGreaterThan(0);
  expect(Math.min(...check.xs)).toBeGreaterThanOrEqual(check.bounds[0]-.001);expect(Math.max(...check.xs)).toBeLessThanOrEqual(check.bounds[1]+.001);expect(errors).toEqual([]);
});

test('actual PNG import converts locally and mobile layout stays within the viewport',async({page})=>{
  const errors=await ready(page);await page.getByText('Text and images',{exact:true}).click();
  const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');x.fillStyle='white';x.fillRect(0,0,32,32);x.fillStyle='black';x.fillRect(8,8,16,16);return c.toDataURL().split(',')[1];});
  await page.locator('input[accept="image/png,image/jpeg"]').setInputFiles({name:'test.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});
  await page.waitForFunction(()=>!!window.__homelabPlotter.state().result&&!window.__homelabPlotter.state().busy);
  expect(await page.evaluate(()=>window.__homelabPlotter.projectData().imageSource.startsWith('data:image/png'))).toBe(true);
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);expect(errors).toEqual([]);
});

test('untrusted SVG cannot execute scripts or follow external use references',async({page})=>{
  const errors=await ready(page);
  const status=await page.evaluate(()=>{
    const a=window.__homelabPlotter;
    const d=a.svgLoader.load('<svg xmlns="http://www.w3.org/2000/svg"><script>window.injected=true</script><rect width="10" height="10" onclick="window.injected=true"/></svg>');
    const rejected=[];for(const svg of ['<svg xmlns="http://www.w3.org/2000/svg"><use href="https://example.com/a.svg#x"/></svg>','<svg xmlns="http://www.w3.org/2000/svg"><defs><g id="cycle"><use href="#cycle"/></g></defs><use href="#cycle"/></svg>']){try{a.svgLoader.load(svg);rejected.push(false);}catch(e){rejected.push(true);}}
    return {injected:!!window.injected,shapes:d.shapes.length,rejected};
  });expect(status).toEqual({injected:false,shapes:1,rejected:[true,true]});expect(errors).toEqual([]);
});
