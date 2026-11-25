const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {spawn} = require('node:child_process');
const dir = path.resolve(__dirname);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--enable-unsafe-swiftshader', '--disable-gpu', '--disable-extensions',
  '--disable-background-networking', '--no-first-run', '--remote-debugging-port=0',
  '--user-data-dir=' + path.join(dir, '.qa-browser-r09c'), 'about:blank',
], {windowsHide:true, stdio:['ignore','ignore','pipe']});

async function run() {
  const port = await new Promise((resolve, reject) => {
    let raw = '';
    const timer = setTimeout(()=>reject(new Error(raw)),15000);
    chrome.stderr.on('data', buffer => {
      raw += buffer;
      const match = raw.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
    chrome.on('error', reject);
  });
  const tabs = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
  await new Promise(resolve => ws.addEventListener('open', resolve, {once:true}));
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', evt => {
    const answer = JSON.parse(evt.data);
    const task = pending.get(answer.id);
    if (task) { pending.delete(answer.id); answer.error ? task.reject(answer.error) : task.resolve(answer.result); }
  });
  function send(method, params={}) {
    return new Promise((resolve,reject) => {
      pending.set(++id,{resolve,reject});
      ws.send(JSON.stringify({id,method,params}));
    });
  }
  async function evaluate(expression) {
    const reply = await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    assert(!reply.exceptionDetails, JSON.stringify(reply.exceptionDetails));
    return reply.result.value;
  }
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send('Page.navigate',{url:pathToFileURL(path.join(dir,'r09c-heute.html')).href});
  await evaluate('new Promise(resolve => { const poll = () => document.querySelector("#hero-figure")?.naturalWidth ? resolve(true) : setTimeout(poll,40); poll(); })');
  const geometry = await evaluate('({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,navTop:document.querySelector(".nav").getBoundingClientRect().top,workoutBottom:document.querySelector(".workout").getBoundingClientRect().bottom,figureLoaded:document.querySelector("#hero-figure").naturalWidth,figureSource:document.querySelector("#hero-figure").getAttribute("src")})');
  assert.deepEqual([geometry.width,geometry.height,geometry.scrollWidth,geometry.scrollHeight],[390,844,390,844]);
  assert(geometry.navTop > geometry.workoutBottom);
  assert(geometry.figureSource.endsWith("/g01-figurenprobe/male_front.svg"));
  const {data} = await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  await fs.writeFile(path.join(dir,'r09c-heute-390x844.png'),Buffer.from(data,'base64'));
  const back = await evaluate('new Promise(resolve => { const img = document.querySelector("#hero-figure"); img.addEventListener("load", () => resolve([img.alt,img.naturalWidth,img.getAttribute("src"),document.querySelector("[data-view=back]").getAttribute("aria-pressed")]), {once:true}); document.querySelector("[data-view=back]").click(); })');
  assert(back[0].includes('hinten') && back[1] > 0 && back[2].endsWith('/g01-figurenprobe/male_back.svg') && back[3] === 'true');
  const rear = await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});
  await fs.writeFile(path.join(dir,"r09c-heute-hinten-390x844.png"),Buffer.from(rear.data,"base64"));
  const feedback = await evaluate('document.querySelector(".start").click(); document.querySelector(".result").textContent');
  assert(feedback.includes('Training'));
  ws.close();
  await fs.writeFile(path.join(dir,'r09c-heute-browsercheck.json'),JSON.stringify({geometry,figure_rear_switch:'pass',start_demo_feedback:'pass'},null,2)+'\n');
  console.log(JSON.stringify({geometry,back,feedback}));
}
run().catch(error => { console.error(error);process.exitCode=1; }).finally(()=>chrome.kill());

