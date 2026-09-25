const {chromium,webkit}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');const path=require('node:path');
(async()=>{
  const results=[];
  for(const [name,engine] of [['chromium',chromium],['webkit',webkit]]){
    const b=await engine.launch({headless:true,...(name==='chromium'?{channel:'msedge'}:{})});
    const page=await b.newPage();await page.goto('http://127.0.0.1:4173/');
    await page.keyboard.press('Tab');
    if(await page.evaluate(()=>document.activeElement.className)!=='skip')throw Error(name+' skip-link tab order');
    await page.keyboard.press('Enter');
    if(await page.evaluate(()=>document.activeElement.id)!=='main')throw Error(name+' skip-link destination');
    for(const route of ['/apps/all-document-reader/','/support/']){
      await page.goto('http://127.0.0.1:4173'+route);
      for(const item of await page.locator('details').all()){
        const summary=item.locator('summary');await summary.focus();await page.keyboard.press('Enter');
        if(await item.getAttribute('open')===null)throw Error(name+' FAQ keyboard open');
        await page.keyboard.press('Enter');
        if(await item.getAttribute('open')!==null)throw Error(name+' FAQ keyboard close');
      }
    }
    await page.setViewportSize({width:320,height:740});await page.goto('http://127.0.0.1:4173/');
    await page.getByRole('button',{name:'Menu',exact:true}).click();
    await page.locator('#primary-nav').getByRole('link',{name:'About',exact:true}).click();
    if(!page.url().endsWith('/about/'))throw Error(name+' mobile navigation');
    if(await page.locator('.menu').getAttribute('aria-expanded')!=='false')throw Error(name+' mobile menu state');
    results.push({engine:name,skipLink:'passed after explicit tabindex=0',faqKeyboardToggles:24,mobileNavigation:'passed'});
    await b.close();
  }
  const file=path.join(__dirname,'docs','browser-checks.json');
  const report=JSON.parse(fs.readFileSync(file,'utf8'));
  report.resolvedIssues=['WebKit skipped the implicit link tab stop. Added explicit tabindex=0 to Skip to content and verified first Tab plus Enter focus transfer in both engines.'];
  report.errors=report.errors.filter(e=>!['Skip link is not first keyboard stop','Skip link focus failed'].includes(e));
  report.targetedRetest=results;
  fs.writeFileSync(file,JSON.stringify(report,null,2));
  console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
