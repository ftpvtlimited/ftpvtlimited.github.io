/* Browser verification. Pass PLAYWRIGHT_MODULE when Playwright is not locally installed. */
const {chromium,webkit}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const routes=['/','/apps/','/apps/all-document-reader/','/about/','/contact/','/support/','/privacy-policy/','/terms-and-conditions/','/apps/all-document-reader/privacy/','/404.html'];
const base='http://127.0.0.1:4173';
const onlyWebkit=process.argv.includes('--webkit-only');
const result=onlyWebkit ? JSON.parse(fs.readFileSync(path.join(root,'docs','browser-checks.json'),'utf8')) : {checks:[],errors:[],unavailable:[]};
if(onlyWebkit)result.unavailable=result.unavailable.filter(s=>!s.startsWith('webkit:'));
fs.mkdirSync(path.join(root,'docs','screenshots'),{recursive:true});
async function testEngine(engine,name,viewports){
  let browser;
  try{browser=await engine.launch({headless:true,...(name==='chromium'?{channel:'msedge'}:{})});}catch(e){result.unavailable.push(name+': '+e.message.split('\n')[0]);return;}
  for(const size of viewports){
    const context=await browser.newContext({viewport:{width:size[0],height:size[1]},deviceScaleFactor:1,isMobile:size[0]<500,hasTouch:size[0]<500});
    const page=await context.newPage();
    page.on('pageerror',e=>result.errors.push(name+' page error: '+e.message));
    page.on('response',r=>{if(r.status()>=400&&!r.url().includes('missing-page'))result.errors.push(name+' HTTP '+r.status()+' '+r.url());});
    for(const route of routes){
      const response=await page.goto(base+route,{waitUntil:'networkidle'});
      if(response.status()!=200)result.errors.push(`${name} ${route} status ${response.status()}`);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
      if(overflow)result.errors.push(`${name} ${size[0]} ${route}: horizontal overflow`);
      const h1=await page.locator('h1').count();
      if(h1!==1)result.errors.push(`${route}: ${h1} headings`);
      if(size[0]<761){
        await page.getByRole('button',{name:'Menu',exact:true}).click();
        if(await page.locator('#primary-nav').isVisible()!==true)result.errors.push('Menu failed to open');
        await page.keyboard.press('Escape');
        if(await page.getByRole('button',{name:'Menu',exact:true}).getAttribute('aria-expanded')!=='false')result.errors.push('Menu failed to close');
      }
      result.checks.push({engine:name,width:size[0],route,status:response.status(),overflow});
    }
    await page.goto(base+'/apps/all-document-reader/');
    for(const question of await page.locator('details').all()){
      await question.locator('summary').click();
      if(await question.getAttribute('open')===null)result.errors.push('FAQ failed to open');
      await question.locator('summary').click();
      if(await question.getAttribute('open')!==null)result.errors.push('FAQ failed to close');
    }
    for(const route of ['/','/apps/all-document-reader/','/contact/','/apps/all-document-reader/privacy/']){
      await page.goto(base+route);
      if([1440,390,320].includes(size[0]))await page.screenshot({path:path.join(root,'docs','screenshots',`${name}-${size[0]}-${route==='/'?'home':route.split('/').filter(Boolean).join('-')}.png`),fullPage:true});
    }
    await context.close();
  }
  const page=await browser.newPage();
  for(const [old,target] of [['/privacy/','/privacy-policy/'],['/terms/','/terms-and-conditions/']]){
    await page.goto(base+old);await page.waitForURL(base+target);
    result.checks.push({engine:name,redirect:old,target});
  }
  const missing=await page.goto(base+'/missing-page/');
  if(missing.status()!==404 || !(await page.locator('h1').innerText()).includes('back on track'))result.errors.push('Custom 404 failed');
  await page.goto(base+'/');
  await page.keyboard.press('Tab');
  if(await page.evaluate(()=>document.activeElement.textContent)!=='Skip to content')result.errors.push('Skip link is not first keyboard stop');
  await page.keyboard.press('Enter');
  if(await page.evaluate(()=>document.activeElement.id)!=='main')result.errors.push('Skip link focus failed');
  await page.emulateMedia({reducedMotion:'reduce'});
  if(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)!=='auto')result.errors.push('Reduced motion failed');
  // At 200% text scaling, layout must reflow without clipping the document.
  await page.setViewportSize({width:1280,height:900});
  await page.addStyleTag({content:':root{font-size:32px}'});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))result.errors.push('200% text overflow');
  await browser.close();
}
(async()=>{
  if(!onlyWebkit)await testEngine(chromium,'chromium',[[1440,1000],[1280,800],[768,1024],[390,844],[360,800],[320,740]]);
  await testEngine(webkit,'webkit',[[390,844],[768,1024]]);
  const nojs=await chromium.launch({headless:true,channel:'msedge'});
  const context=await nojs.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();await page.goto(base+'/');
  if(!(await page.locator('#primary-nav').isVisible()))result.errors.push('No-JS navigation hidden');
  await page.getByRole('link',{name:'Explore the app',exact:false}).first().click();
  if(!page.url().endsWith('/apps/all-document-reader/'))result.errors.push('No-JS product navigation failed');
  await nojs.close();
  fs.writeFileSync(path.join(root,'docs','browser-checks.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify({checks:result.checks.length,errors:result.errors,unavailable:result.unavailable},null,2));
  if(result.errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
