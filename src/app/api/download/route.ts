import { NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ImageRun,
  PageOrientation,
  convertInchesToTwip,
} from "docx";
import { readFileSync } from "fs";
import { join } from "path";

// Load diagram images
function loadDiagram(name: string): Buffer {
  try {
    return readFileSync(join(process.cwd(), "public", "diagrams", `${name}.png`));
  } catch {
    return Buffer.alloc(0);
  }
}

const usecaseImg = loadDiagram("usecase");
const bpmnImg = loadDiagram("bpmn");
const erdImg = loadDiagram("erDiagram");
const activityImg = loadDiagram("activity");

export async function GET() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        children: [
          // HERO
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({ text: "Technical Test", size: 20, color: "888888", font: "Calibri" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({ text: "System Analyst", bold: true, size: 48, font: "Calibri" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "Case: Sistem Informasi Pengadaan Barang", size: 24, color: "666666" }),
              new TextRun({ text: "\nPT Aksa Digital Group", size: 24, color: "666666" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({ text: "Kandidat: Ridha Fahmi Junaidi", size: 22 }),
              new TextRun({ text: "\nTanggal: 25 Juni 2026", size: 22, color: "888888" }),
            ],
          }),

          // SECTION 1
          heading("Section 1: Analisis Kebutuhan Sistem (50 Poin)"),

          subheading("1.1 Spesifikasi Kebutuhan Pengguna (Use Case)"),
          para("Tujuh aktor teridentifikasi dalam sistem pengadaan barang — 6 aktor internal (Unit Pemohon, Procurement, Budgeting, Keuangan, Kasir, Manager) dan 1 secondary actor (Supplier). Interaksi Supplier bersifat offline, dicatat/diinput oleh Procurement."),
          para("15 use case mencakup seluruh siklus pengadaan:"),
          bullet("Unit Pemohon: Mengajukan Permintaan, Terima Notifikasi"),
          bullet("Procurement: Validasi Permintaan, Kirim Draft PO, Input Kontrak, Input Termin, Upload Bukti PO, Terima Barang & Tagihan"),
          bullet("Budgeting: Verifikasi Anggaran"),
          bullet("Keuangan: Input Data Tagihan, Upload Berkas Tagihan"),
          bullet("Kasir: Cairkan Dana Pembayaran"),
          bullet("Manager: Generate Laporan"),
          bullet("Supplier (Secondary Actor): Kirim PO, Kirim Barang & Tagihan — interaksi offline, dicatat oleh Procurement"),

          // Use Case Diagram Image
          diagramImage(usecaseImg, "Use Case Diagram — 7 aktor, 15 use case"),

          subheading("1.1b Batasan Ruang Lingkup (Scope & Non-Scope)"),
          para("Scope (In-Scope):"),
          bullet("Pencatatan permintaan barang dari Unit Pemohon"),
          bullet("Validasi dan approval oleh Procurement"),
          bullet("Verifikasi ketersediaan anggaran oleh Budgeting"),
          bullet("Pembuatan kontrak dan termin pembayaran oleh Procurement"),
          bullet("Pencatatan data tagihan dan upload berkas oleh Keuangan"),
          bullet("Pencairan dana oleh Kasir"),
          bullet("Monitoring dan laporan oleh Manager"),
          bullet("Notifikasi antar-aktor dalam sistem"),

          para("Non-Scope (Out-of-Scope):"),
          bullet("Pengiriman Draft PO ke vendor/supplier (terjadi di luar aplikasi, dicatat oleh Procurement)"),
          bullet("Penerimaan PO dan pengiriman barang oleh Supplier (offline, diinput oleh Procurement)"),
          bullet("Integrasi dengan sistem akuntansi/ERP eksternal"),
          bullet("Manajemen inventaris/aset setelah barang diterima"),
          bullet("Sistem pembayaran elektronik (transfer bank)"),

          subheading("1.1c Status Workflow Pengadaan"),
          simpleTable(
            ["No", "Status", "Deskripsi", "Aktor"],
            [
              ["1", "Draft", "Permintaan dibuat, belum diajukan", "Unit Pemohon"],
              ["2", "Submitted", "Permintaan diajukan ke Procurement", "Unit Pemohon"],
              ["3", "Procurement Approved", "Disetujui oleh Procurement", "Procurement"],
              ["4", "Procurement Rejected", "Ditolak oleh Procurement (dengan alasan)", "Procurement"],
              ["5", "Budget Approved", "Anggaran tersedia", "Budgeting"],
              ["6", "Budget Rejected", "Anggaran tidak tersedia", "Budgeting"],
              ["7", "Contract Created", "Kontrak dan termin dibuat", "Procurement"],
              ["8", "PO Sent", "Draft PO dikirim ke supplier", "Procurement"],
              ["9", "PO Accepted", "Supplier menerima PO", "Supplier (offline)"],
              ["10", "Goods Received", "Barang diterima dan diverifikasi", "Procurement"],
              ["11", "Invoice Received", "Tagihan dan berkas diterima", "Keuangan"],
              ["12", "Payment Processed", "Termin pembayaran dicairkan", "Kasir"],
              ["13", "Closed", "Seluruh proses selesai", "Sistem"],
            ]
          ),

          subheading("1.2 Flow Diagram & Kebutuhan Fungsional"),
          para("Alur proses bisnis pengadaan barang dari permintaan hingga pembayaran, melibatkan 6 aktor internal dan 1 secondary actor eksternal."),
          para("Alur Bisnis (14 langkah):"),
          bullet("1. Unit Pemohon → Ajukan Permintaan Barang ke Procurement"),
          bullet("2. Procurement → Validasi Kebutuhan"),
          bullet("3. Jika disetujui → Procurement ajukan Verifikasi Anggaran ke Budgeting"),
          bullet("4. Budgeting cek ketersediaan budget"),
          bullet("5. Jika budget OK → Procurement kirim Draft PO ke Supplier (offline)"),
          bullet("6. Supplier kirim PO Resmi (offline, dicatat Procurement)"),
          bullet("7. Procurement input Kontrak & Termin Pembayaran"),
          bullet("8. Procurement upload Bukti PO"),
          bullet("9. Supplier kirim Barang + Tagihan (offline, diterima Procurement)"),
          bullet("10. Procurement teruskan Tagihan ke Keuangan"),
          bullet("11. Keuangan input Data Tagihan + Upload Berkas"),
          bullet("12. Keuangan notifikasi Pencairan ke Kasir"),
          bullet("13. Kasir input Pembayaran (tgl bayar, nominal, total)"),
          bullet("14. Manager generate Laporan"),

          // Sequence Diagram Image
          diagramImage(bpmnImg, "Alur Bisnis — BPMN (Business Process Model and Notation)"),

          para("11 Kebutuhan Fungsional:"),
          simpleTable(
            ["ID", "Fungsi", "Deskripsi", "Aktor"],
            [
              ["F-01", "Manajemen Permintaan", "CRUD permintaan barang (multi-item)", "Unit Pemohon"],
              ["F-02", "Validasi Procurement", "Approve/reject dengan alasan", "Procurement"],
              ["F-03", "Verifikasi Anggaran", "Cek ketersediaan budget unit", "Budgeting"],
              ["F-04", "Notifikasi", "Push notifikasi real-time", "Sistem"],
              ["F-05", "Manajemen Kontrak", "Input kontrak, PO, harga", "Procurement"],
              ["F-06", "Manajemen Termin", "Pembayaran bertahap (multi-termin)", "Procurement"],
              ["F-07", "Upload Dokumen", "Scan PO & berkas tagihan", "Proc, Keuangan"],
              ["F-08", "Manajemen Tagihan", "Input data tagihan supplier", "Keuangan"],
              ["F-09", "Pencairan Dana", "Input pembayaran final", "Kasir"],
              ["F-10", "Generate Laporan", "Harian/mingguan/bulanan/tahunan", "Manager"],
              ["F-11", "Auth & Otorisasi", "Login + role-based access control", "Semua"],
            ]
          ),

          subheading("1.3 Entity Relationship Diagram (ERD)"),
          para("14 entitas dengan relasi 1:N dan 1:1. PEMBAYARAN terhubung ke TERMIN_PEMBAYARAN via id_termin untuk trace realisasi pembayaran per termin pencairan dana."),

          // ERD Image
          diagramImage(erdImg, "ERD — 14 entitas dengan relasi dan atribut kunci"),

          para("Relasi Kunci:"),
          bullet("Unit Pemohon 1→N Permintaan → Detail Permintaan"),
          bullet("Permintaan 1→1 Validasi → 1 Verifikasi Anggaran"),
          bullet("Permintaan 1→1 Kontrak → Detail Kontrak & Termin"),
          bullet("Kontrak 1→N Tagihan → Detail Tagihan"),
          bullet("Tagihan 1→N Pembayaran → Termin Pembayaran (trace per termin)"),
          bullet("Supplier 1→N Kontrak, 1→N Tagihan"),

          para("Entitas Utama:"),
          simpleTable(
            ["Entitas", "Atribut Utama", "Keterangan"],
            [
              ["UNIT_PEMOHON", "id_unit, nama_unit, kode", "Departemen/unit pengaju"],
              ["PERMINTAAN", "id_permintaan, id_unit, tgl_pengajuan, status", "Header permintaan"],
              ["DETAIL_PERMINTAAN", "id_detail, id_permintaan, nama_barang, jumlah, satuan", "Multi-item per permintaan"],
              ["KONTRAK", "id_kontrak, id_permintaan, id_supplier, no_kontrak", "Kontrak dengan supplier"],
              ["DETAIL_KONTRAK", "id_detail, id_kontrak, nama_barang, harga_satuan", "Multi-item per kontrak"],
              ["TERMIN_PEMBAYARAN", "id_termin, id_kontrak, tgl_pembayaran, persentase, nominal", "Pembayaran bertahap"],
              ["TAGIHAN", "id_tagihan, id_kontrak, tgl_tagihan, no_tagihan", "Tagihan dari supplier"],
              ["DETAIL_TAGIHAN", "id_detail, id_tagihan, nama_barang, jumlah, harga", "Multi-item per tagihan"],
              ["PEMBAYARAN", "id_pembayaran, id_tagihan, id_termin, tgl_pembayaran, nominal, total", "Realisasi bayar per termin"],
              ["SUPPLIER", "id_supplier, nama, npwp", "Data supplier"],
              ["USER", "id_user, username, role", "Pengguna sistem"],
            ]
          ),

          subheading("1.4 Activity Diagram"),
          para("Activity diagram menggambarkan alur proses permintaan barang dengan 2 decision point:"),
          bullet("Decision 1: Procurement — Validasi Kebutuhan (Disetujui / Ditolak)"),
          bullet("Decision 2: Budgeting — Anggaran Tersedia (Ya / Tidak)"),

          // Activity Diagram Image
          diagramImage(activityImg, "Activity Diagram — Alur Permintaan dengan 2 decision gate"),

          subheading("1.4b Kebutuhan Non-Fungsional"),
          simpleTable(
            ["ID", "Kategori", "Kebutuhan", "Spesifikasi"],
            [
              ["NF-01", "Keamanan", "Role-Based Access Control (RBAC)", "7 role dengan akses terbatas per modul"],
              ["NF-02", "Keamanan", "Audit Trail", "Log setiap approval/rejection dengan timestamp, user, dan alasan"],
              ["NF-03", "Keamanan", "Keamanan Dokumen", "Enkripsi file upload (tagihan, PO) di storage"],
              ["NF-04", "Keandalan", "Backup Database", "Backup otomatis harian dengan retensi 30 hari"],
              ["NF-05", "Keandalan", "Upload Validasi", "Maks 5MB, format PDF/JPG/PNG, virus scan"],
              ["NF-06", "Performa", "Response Time", "Halaman < 2 detik, laporan < 5 detik"],
              ["NF-07", "Performa", "Concurrent Users", "Minimal 50 user simultan"],
              ["NF-08", "Maintainability", "Dokumentasi", "FSD, TSD, API docs, user manual"],
            ]
          ),

          subheading("1.5 Desain Interface / Mockup"),
          para("Komponen UI Back Office yang diusulkan:"),
          bullet("Top Navigation: Dashboard | Permintaan | Kontrak | Tagihan | Pembayaran | Laporan"),
          bullet("Dashboard: Card ringkasan — permintaan menunggu, kontrak aktif, tagihan pending"),
          bullet("Tabel Data: Sortable, searchable, pagination untuk semua modul"),
          bullet("Form Input: Validasi client + server, multi-item dynamic fields"),
          bullet("Upload: Drag & drop, preview PDF/JPG, max 5MB"),
          bullet("Notifikasi: Badge counter + toast popup real-time"),
          para("Interactive prototype tersedia di: https://sa-visual.ahdirmai.id/prototype"),

          // SECTION 2
          heading("Section 2: Model Proses Pengembangan (25 Poin)"),
          para("Model Hybrid — Agile Scrum + Waterfall (Wagile) dipilih karena:"),
          bullet("Durasi 3 bulan terlalu ketat untuk full Waterfall, terlalu berisiko untuk full Agile"),
          bullet("Requirement jelas — alur bisnis detail, fondasi Waterfall kuat"),
          bullet("Multi-stakeholder — butuh sprint demo per modul ke masing-masing aktor"),
          bullet("Dependency antar modul — Permintaan → Validasi → Kontrak → Tagihan → Bayar (berurutan)"),
          bullet("Dokumentasi wajib — sistem keuangan, FSD/TSD harus ada untuk audit"),

          para("Timeline 12 Minggu:"),
          simpleTable(
            ["Minggu", "Fase", "Model", "Output"],
            [
              ["1-2", "Analisis & Desain", "Waterfall", "BRD, FSD, ERD, UML, Mockup"],
              ["3-4", "Sprint 1 — Permintaan & Validasi", "Agile", "Demo ke Procurement & Unit Pemohon"],
              ["5-6", "Sprint 2 — Budgeting & Kontrak", "Agile", "Demo ke Budgeting & Procurement"],
              ["7-8", "Sprint 3 — Tagihan & Pembayaran", "Agile", "Demo ke Keuangan & Kasir"],
              ["9-10", "Sprint 4 — Laporan & Finishing", "Agile", "Demo ke Manager"],
              ["11-12", "UAT, Bug Fixing, Go Live", "Final", "User Acceptance Test → Deployment"],
            ]
          ),

          para("Milestone:"),
          bullet("M1 (W2): FSD & Desain disetujui"),
          bullet("M2 (W4): Modul Permintaan + Validasi live"),
          bullet("M3 (W6): Modul Budgeting + Kontrak live"),
          bullet("M4 (W8): Modul Tagihan + Pembayaran live"),
          bullet("M5 (W10): Semua modul selesai"),
          bullet("M6 (W12): UAT selesai, GO LIVE"),

          // SECTION 3
          heading("Section 3: SDM yang Dibutuhkan (10 Poin)"),
          simpleTable(
            ["#", "Role", "Jumlah", "Tanggung Jawab"],
            [
              ["1", "Project Manager", "1", "Koordinasi, timeline, stakeholder communication"],
              ["2", "System Analyst", "1", "Requirement gathering, FSD, UML, ERD, mockup, UAT"],
              ["3", "Backend Developer", "2", "API development, database, business logic"],
              ["4", "Frontend Developer", "1", "UI/UX back office, implementasi mockup"],
              ["5", "QA / Tester", "1", "Test case, regression test, bug reporting"],
              ["6", "Database Administrator", "1", "DB schema, indexing, optimization, backup"],
              ["7", "UI/UX Designer", "1", "Desain interface, wireframe, prototype, usability testing"],
              ["8", "DevOps / Infra Engineer", "1", "CI/CD pipeline, server, monitoring, deployment"],
              ["9", "Product Owner / User Rep.", "1", "Representasi kebutuhan user, acceptance criteria, sprint review"],
            ]
          ),
          para("Total: 10 orang"),

          // SECTION 4
          heading("Section 4: Penjadwalan Proyek (10 Poin)"),
          para("Timeline 3 bulan (12 minggu) dengan 4 sprint 2-mingguan, 6 milestone, dan buffer 1 minggu untuk mengantisipasi kendala teknis."),
          bullet("Sprint 1 (W3-4): Modul Permintaan + Validasi"),
          bullet("Sprint 2 (W5-6): Modul Budgeting + Kontrak"),
          bullet("Sprint 3 (W7-8): Modul Tagihan + Pembayaran"),
          bullet("Sprint 4 (W9-10): Modul Laporan + Finishing"),
          bullet("UAT (W11-12): Testing, bug fixing, deployment"),

          // SECTION 5
          heading("Section 5: Key Point Laporan ke Project Manager (5 Poin)"),

          subheading("Sisi Teknis"),
          bullet("1. Database harus support multi-item per transaksi — risiko: user input berulang & data tidak akurat"),
          bullet("2. Upload dokumen harus ada validasi (max 5MB, PDF/JPG) — risiko: storage penuh dan file korup"),
          bullet("3. Role-based access control — risiko: kebocoran data sensitif, risiko kegagalan audit"),
          bullet("4. Notifikasi real-time via sistem — risiko: bottleneck di validasi manual, keterlambatan proyek"),
          bullet("5. Backup database harian — risiko: kehilangan data keuangan yang berdampak pada kegagalan audit"),

          subheading("Sisi Manajerial"),
          bullet("1. Sign-off FSD dari semua stakeholder sebelum mulai coding — risiko: perubahan lingkup yang tidak terkendali"),
          bullet("2. Demo sprint setiap 2 minggu ke user — risiko: ketidaksesuaian ekspektasi yang berpotensi menghasilkan pekerjaan ulang signifikan"),
          bullet("3. Training user minimal 1 minggu sebelum go-live — risiko: resistansi pengguna dan potensi kesalahan input data"),
          bullet("4. Dedicated QA sejak Sprint 1 — risiko: akumulasi defect berpotensi menunda jadwal go-live"),
          bullet("5. Buffer 1 minggu untuk mengantisipasi kendala — risiko: keterlambatan meningkat apabila tidak tersedia buffer waktu"),

          // FOOTER
          new Paragraph({ spacing: { before: 600 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Disusun oleh", italics: true, color: "888888", size: 20 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({ text: "Ridha Fahmi Junaidi", bold: true, size: 28 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "System Analyst Candidate", color: "888888", size: 22 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
            children: [
              new TextRun({ text: "PT Aksa Digital Group — 25 Juni 2026", color: "AAAAAA", size: 20 }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const uint8 = new Uint8Array(buffer);

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="Jawaban_SA_Ridha_Fahmi_Junaidi.docx"',
    },
  });
}

// Helpers
function heading(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Calibri" })],
  });
}

function subheading(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: 24, font: "Calibri" })],
  });
}

function para(text: string) {
  return new Paragraph({
    spacing: { after: 150 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function bullet(text: string) {
  return new Paragraph({
    spacing: { after: 80 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: "• ", size: 22 }),
      new TextRun({ text, size: 22 }),
    ],
  });
}

function diagramImage(buf: Buffer, caption: string) {
  if (buf.length === 0) {
    return para(`[Diagram: ${caption}]`);
  }
  // Calculate dimensions: maintain aspect ratio, max width ~6 inches (900000 EMU)
  const maxWidthEmu = 550000; // ~6 inches
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 100 },
    children: [
      new ImageRun({
        data: buf,
        transformation: {
          width: 600,
          height: 300,
        },
        type: "png",
      }),
    ],
  });
}

function simpleTable(headers: string[], rows: string[][]) {
  const headerRow = new TableRow({
    children: headers.map(
      (h) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true, size: 20 })],
            }),
          ],
          width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
          shading: { fill: "F4F4F5" },
        })
    ),
  });

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: cell, size: 20 })],
                }),
              ],
              width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
            })
        ),
      })
  );

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}
