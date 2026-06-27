import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'diagrams');
mkdirSync(outDir, { recursive: true });

// Mermaid chart definitions (same as in page.tsx)
const diagrams = {
  'usecase': `graph LR
    UP["🏢 Unit Pemohon"]
    PP["📋 Procurement"]
    PB["💰 Budgeting"]
    PK["📊 Keuangan"]
    KS["🏦 Kasir"]
    MG["📈 Manager"]
    SP[("🚚 Supplier\nSecondary Actor")]
    UP --> UC1(("Mengajukan\nPermintaan"))
    UP --> UC2(("Terima\nNotifikasi"))
    PP --> UC3(("Validasi\nPermintaan"))
    PP --> UC4(("Kirim\nDraft PO"))
    PP --> UC5(("Input\nKontrak"))
    PP --> UC6(("Input\nTermin"))
    PP --> UC7(("Upload\nBukti PO"))
    PP --> UC8(("Terima Barang\n& Tagihan"))
    PB --> UC9(("Verifikasi\nAnggaran"))
    PK --> UC10(("Input Data\nTagihan"))
    PK --> UC11(("Upload\nBerkas Tagihan"))
    KS --> UC12(("Cairkan\nDana"))
    MG --> UC13(("Generate\nLaporan"))
    SP -.->|"offline"| UC4
    SP -.->|"offline"| UC8`,

  'sequence': `sequenceDiagram
    participant UP as Unit Pemohon
    participant PP as Procurement
    participant PB as Budgeting
    participant SP as Supplier
    participant PK as Keuangan
    participant KS as Kasir
    UP->>PP: 1. Ajukan Permintaan
    PP->>PP: 2. Validasi Kebutuhan
    PP->>PB: 3. Verifikasi Anggaran
    PB-->>PP: 4. Anggaran OK
    PP->>SP: 5. Kirim Draft PO (offline)
    SP-->>PP: 6. PO Resmi (offline)
    PP->>PP: 7. Input Kontrak & Termin
    PP->>PP: 8. Upload Bukti PO
    SP->>PP: 9. Kirim Barang + Tagihan
    PP->>PK: 10. Teruskan Tagihan
    PK->>PK: 11. Input Tagihan + Upload
    PK->>KS: 12. Notifikasi Pencairan
    KS->>KS: 13. Input Pembayaran
    KS-->>UP: 14. Selesai`,

  'erDiagram': `erDiagram
    UNIT_PEMOHON ||--o{ PERMINTAAN : "mengajukan"
    PERMINTAAN ||--|{ DETAIL_PERMINTAAN : "memiliki"
    PERMINTAAN ||--o| VALIDASI : "divalidasi"
    PERMINTAAN ||--o| VERIFIKASI_ANGGARAN : "diverifikasi"
    PERMINTAAN ||--o| KONTRAK : "dikontrak"
    KONTRAK ||--|{ DETAIL_KONTRAK : "memiliki"
    KONTRAK ||--|{ TERMIN_PEMBAYARAN : "memiliki"
    KONTRAK ||--o{ TAGIHAN : "ditagih"
    TAGIHAN ||--|{ DETAIL_TAGIHAN : "memiliki"
    TAGIHAN ||--o{ PEMBAYARAN : "dibayar"
    PEMBAYARAN }o--|| TERMIN_PEMBAYARAN : "per termin"
    SUPPLIER ||--o{ KONTRAK : "menyuplai"
    USER ||--o{ VALIDASI : "memvalidasi"
    UNIT_PEMOHON {
        int id_unit PK
        string nama_unit
        string kode
    }
    PERMINTAAN {
        int id_permintaan PK
        int id_unit FK
        date tgl_pengajuan
        string status
    }
    KONTRAK {
        int id_kontrak PK
        int id_permintaan FK
        int id_supplier FK
        string no_kontrak
    }
    TAGIHAN {
        int id_tagihan PK
        int id_kontrak FK
        date tgl_tagihan
        string no_tagihan
    }
    PEMBAYARAN {
        int id_pembayaran PK
        int id_tagihan FK
        int id_termin FK
        date tgl_pembayaran
        decimal nominal
    }
    SUPPLIER {
        int id_supplier PK
        string nama
        string npwp
    }`,

  'activity': `graph TD
    A((Mulai)) --> B[Unit Pemohon\nInput Permintaan Barang]
    B --> C{Procurement\nValidasi Kebutuhan}
    C -->|Disetujui| D{Budgeting\nAnggaran Tersedia?}
    C -->|Ditolak| E[Ditolak -\nNotifikasi ke Pemohon]
    D -->|Ya| F[Procurement\nKirim Draft PO]
    D -->|Tidak| G[Ditolak Anggaran -\nNotifikasi ke Pemohon]
    F --> H[Supplier\nKirim Barang + Tagihan]
    H --> I[Procurement\nInput Kontrak & Termin]
    I --> J[Keuangan\nInput Tagihan + Upload]
    J --> K[Kasir\nCairkan Dana]
    K --> L((Selesai))
    E --> L
    G --> L`
};

const html = `<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; padding: 0; background: white; }
  .diagram { 
    display: inline-block; 
    background: white; 
    padding: 20px; 
    margin: 0;
  }
  .diagram svg { max-width: none; }
</style>
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({ 
    startOnLoad: false, 
    theme: 'neutral',
    securityLevel: 'loose',
    fontFamily: 'Calibri, Arial, sans-serif',
    themeVariables: {
      primaryColor: '#f4f4f5',
      primaryTextColor: '#18181b',
      primaryBorderColor: '#d4d4d8',
      lineColor: '#a1a1aa'
    }
  });
</script>
</head>
<body>
${Object.entries(diagrams).map(([id, chart]) => 
  `<div class="diagram" id="diagram-${id}"><pre class="mermaid">${chart}</pre></div>`
).join('\n')}
<script>
(async () => {
  const ids = ${JSON.stringify(Object.keys(diagrams))};
  for (const id of ids) {
    const el = document.querySelector('#diagram-' + id + ' pre');
    const { svg } = await mermaid.render('svg-' + id, el.textContent);
    document.getElementById('diagram-' + id).innerHTML = svg;
  }
  window.__diagramsReady = true;
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
  await page.setViewport({ width: 1200, height: 800 });
  
  console.log('Loading diagrams...');
  await page.goto(`data:text/html,${encodeURIComponent(html)}`, { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Wait for diagrams to render
  await page.waitForFunction(() => window.__diagramsReady === true, { timeout: 20000 });
  await new Promise(r => setTimeout(r, 2000)); // extra wait for rendering
  
  // Screenshot each diagram
  for (const id of Object.keys(diagrams)) {
    const selector = `#diagram-${id}`;
    const el = await page.$(selector);
    if (el) {
      const buf = await el.screenshot({ type: 'png', omitBackground: true });
      const path = join(outDir, `${id}.png`);
      writeFileSync(path, buf);
      console.log(`Saved: ${path} (${buf.length} bytes)`);
    } else {
      console.error(`Element ${selector} not found`);
    }
  }
  
  await browser.close();
  console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });
