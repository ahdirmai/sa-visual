import puppeteer from 'puppeteer';
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'diagrams');
mkdirSync(outDir, { recursive: true });

const bpmnXml = readFileSync(join(__dirname, 'procurement.bpmn'), 'utf-8');

const html = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: white; font-family: Calibri, Arial, sans-serif; }
  #canvas { width: 1400px; height: 900px; }
  .bjs-powered-by { display: none !important; }
  .djs-element .djs-label { font-size: 11px !important; font-family: Calibri, Arial, sans-serif !important; }
  .djs-element .djs-visual text { font-size: 11px !important; font-family: Calibri, Arial, sans-serif !important; }
  .djs-palette { display: none !important; }
</style>
<link rel="stylesheet" href="https://unpkg.com/bpmn-js@17/dist/assets/diagram-js.css">
<link rel="stylesheet" href="https://unpkg.com/bpmn-js@17/dist/assets/bpmn-js.css">
<link rel="stylesheet" href="https://unpkg.com/bpmn-js@17/dist/assets/bpmn-font/css/bpmn.css">
<script src="https://unpkg.com/bpmn-js@17/dist/bpmn-viewer.production.min.js"></script>
</head>
<body>
<div id="canvas"></div>
<script>
(async () => {
  const viewer = new BpmnJS({ container: '#canvas', width: 1400, height: 900 });
  try {
    await viewer.importXML(\`${bpmnXml.replace(/`/g, '\\`')}\`);
    const canvas = viewer.get('canvas');
    canvas.zoom('fit-viewport', 'auto');
    window.__bpmnReady = true;
  } catch(e) {
    console.error(e);
    window.__bpmnError = e.message;
  }
})();
</script>
</body>
</html>`;

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1000 });

  console.log('Loading BPMN diagram...');
  await page.goto(`data:text/html,${encodeURIComponent(html)}`, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.waitForFunction(() => window.__bpmnReady === true || window.__bpmnError, { timeout: 20000 });
  
  const error = await page.evaluate(() => window.__bpmnError);
  if (error) {
    console.error('BPMN Error:', error);
    await browser.close();
    process.exit(1);
  }

  await new Promise(r => setTimeout(r, 2000));

  console.log('Taking screenshot...');
  const canvasEl = await page.$('#canvas');
  if (canvasEl) {
    const buf = await canvasEl.screenshot({ type: 'png', omitBackground: true });
    const path = join(outDir, 'bpmn.png');
    writeFileSync(path, buf);
    console.log(`Saved: ${path} (${buf.length} bytes)`);
  }

  await browser.close();
  console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });
