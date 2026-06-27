import MermaidDiagram from "@/components/MermaidDiagram";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
      {/* ───── HERO ───── */}
      <header className="mb-32">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
          Technical Test
        </p>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          System Analyst
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-zinc-500">
          Case: Sistem Informasi Pengadaan Barang
          <br />
          PT Aksa Digital Group
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-zinc-400">
          <span>
            <strong className="font-medium text-zinc-600">Kandidat</strong>{" "}
            Ridha Fahmi Junaidi
          </span>
          <span>
            <strong className="font-medium text-zinc-600">Tanggal</strong> 25
            Juni 2026
          </span>
        </div>
        <a
          href="/api/download"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Jawaban (.docx)
        </a>
      </header>

      {/* ════════════════════════════════════════ */}
      {/* ───── SECTION 1 ───── */}
      {/* ════════════════════════════════════════ */}
      <Section number="1" title="Analisis Kebutuhan Sistem" points={50}>
        {/* 1.1 Use Case */}
        <Subsection title="1.1 Spesifikasi Kebutuhan Pengguna (Use Case)">
          <p className="mb-6 leading-relaxed text-zinc-600">
            Tujuh aktor teridentifikasi dalam sistem pengadaan barang — 6 aktor internal
            (Unit Pemohon, Procurement, Budgeting, Keuangan, Kasir, Manager) dan 1 secondary actor
            (Supplier). Interaksi Supplier bersifat offline, dicatat/diinput oleh Procurement.
          </p>
          <MermaidDiagram
            chart={`graph LR
    UP["🏢 Unit Pemohon"]
    PP["📋 Procurement"]
    PB["💰 Budgeting"]
    PK["📊 Keuangan"]
    KS["🏦 Kasir"]
    MG["📈 Manager"]
    SP[("🚚 Supplier<br/><i>Secondary Actor</i>")]

    UP --> UC1(("Mengajukan<br/>Permintaan"))
    UP --> UC2(("Terima<br/>Notifikasi"))

    PP --> UC3(("Validasi<br/>Permintaan"))
    PP --> UC4(("Kirim Draft<br/>PO ke Vendor"))
    PP --> UC5(("Input<br/>Kontrak"))
    PP --> UC6(("Input Termin<br/>Pembayaran"))
    PP --> UC7(("Upload<br/>Bukti PO"))
    PP --> UC8(("Terima Barang<br/>& Tagihan"))

    PB --> UC9(("Verifikasi<br/>Anggaran"))
    PB --> UC2

    PK --> UC10(("Input Data<br/>Tagihan"))
    PK --> UC11(("Upload Berkas<br/>Tagihan"))

    KS --> UC12(("Cairkan Dana<br/>Pembayaran"))

    MG --> UC13(("Generate<br/>Laporan"))

    PP -.->|"PO offline"| SP
    SP -.->|"Barang + Tagihan"| PP`}
          />
          <p className="mt-6 text-sm text-zinc-400 text-center">
            Use Case Diagram — 7 aktor, 15 use case
          </p>
        </Subsection>

        {/* 1.1b Scope & Non-Scope */}
        <Subsection title="1.1b Batasan Ruang Lingkup (Scope & Non-Scope)">
          <h4 className="mb-3 mt-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Scope (In-Scope)
          </h4>
          <ul className="mb-6 space-y-2 text-sm text-zinc-600">
            <li>• Pencatatan permintaan barang dari Unit Pemohon</li>
            <li>• Validasi dan approval oleh Procurement</li>
            <li>• Verifikasi ketersediaan anggaran oleh Budgeting</li>
            <li>• Pembuatan kontrak dan termin pembayaran oleh Procurement</li>
            <li>• Pencatatan data tagihan dan upload berkas oleh Keuangan</li>
            <li>• Pencairan dana oleh Kasir</li>
            <li>• Monitoring dan laporan oleh Manager</li>
            <li>• Notifikasi antar-aktor dalam sistem</li>
          </ul>
          <h4 className="mb-3 mt-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Non-Scope (Out-of-Scope)
          </h4>
          <ul className="space-y-2 text-sm text-zinc-600">
            <li>• Pengiriman Draft PO ke vendor/supplier (terjadi di luar aplikasi, dicatat oleh Procurement)</li>
            <li>• Penerimaan PO dan pengiriman barang oleh Supplier (offline, diinput oleh Procurement)</li>
            <li>• Integrasi dengan sistem akuntansi/ERP eksternal</li>
            <li>• Manajemen inventaris/aset setelah barang diterima</li>
            <li>• Sistem pembayaran elektronik (transfer bank)</li>
          </ul>
        </Subsection>

        {/* 1.1c Workflow Status */}
        <Subsection title="1.1c Status Workflow Pengadaan">
          <Table
            headers={["No", "Status", "Deskripsi", "Aktor"]}
            rows={[
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
            ]}
          />
        </Subsection>

        {/* 1.2 Flow + Functional */}
        <Subsection title="1.2 Flow Diagram & Kebutuhan Fungsional">
          <p className="mb-6 leading-relaxed text-zinc-600">
            Alur proses bisnis pengadaan barang dari permintaan hingga
            pembayaran, melibatkan 6 aktor internal dan 1 eksternal.
          </p>

          <h4 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Alur Bisnis — BPMN (Business Process Model and Notation)
          </h4>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/diagrams/bpmn.png"
              alt="BPMN Diagram — Alur Proses Pengadaan Barang"
              className="mx-auto h-auto w-full max-w-[1200px]"
              style={{ minWidth: "800px" }}
            />
          </div>
          <p className="mt-2 text-sm text-zinc-400 text-center">
            BPMN Diagram — 6 lane, 2 decision gateway, alur pengadaan barang
          </p>

          <h4 className="mb-4 mt-10 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            11 Kebutuhan Fungsional
          </h4>
          <Table
            headers={["ID", "Fungsi", "Deskripsi", "Aktor"]}
            rows={[
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
            ]}
          />
        </Subsection>

        {/* 1.3 ERD */}
        <Subsection title="1.3 Entity Relationship Diagram (ERD)">
          <p className="mb-6 leading-relaxed text-zinc-600">
            14 entitas dengan relasi 1:N dan 1:1. PEMBAYARAN terhubung ke TERMIN_PEMBAYARAN
            via id_termin untuk trace realisasi pembayaran per termin pencairan dana.
          </p>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/diagrams/erDiagram.png"
              alt="ERD — Skema Database Sistem Pengadaan Barang"
              className="mx-auto h-auto w-full max-w-[900px]"
              style={{ minWidth: "600px" }}
            />
          </div>
          <p className="mt-2 text-sm text-zinc-400 text-center">
            ERD — 14 entitas dengan relasi dan atribut kunci
          </p>

          <h4 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Relasi Kunci
          </h4>
          <div className="space-y-1 text-sm text-zinc-500">
            <p>• Unit Pemohon 1→N Permintaan → Detail Permintaan</p>
            <p>• Permintaan 1→1 Validasi → 1 Verifikasi Anggaran</p>
            <p>• Permintaan 1→1 Kontrak → Detail Kontrak & Termin</p>
            <p>• Kontrak 1→N Tagihan → Detail Tagihan</p>
            <p>• Tagihan 1→N Pembayaran → Termin Pembayaran (trace per termin)</p>
            <p>• Supplier 1→N Kontrak, 1→N Tagihan</p>
          </div>
        </Subsection>

        {/* 1.4 UML — Activity Diagram */}
        <Subsection title="1.4 Activity Diagram">
          <p className="mb-6 leading-relaxed text-zinc-600">
            Activity diagram menggambarkan alur proses permintaan barang dengan
            decision point di setiap tahap validasi.
          </p>
          <MermaidDiagram
            chart={`graph TD
    START([Start]) --> A

    A[Unit Pemohon:<br/>Input Permintaan Barang] --> B

    B{Procurement:<br/>Validasi Kebutuhan?}
    B -->|Ditolak| C[Notifikasi<br/>Penolakan ke Pemohon]
    C --> END1([End])
    B -->|Disetujui| D

    D{Budgeting:<br/>Anggaran Tersedia?}
    D -->|Tidak| E[Notifikasi<br/>Budget Tidak Cukup]
    E --> END2([End])
    D -->|Ya| F

    F[Procurement:<br/>Kirim Draft PO ke Supplier] --> G
    G[Supplier:<br/>Kirim PO Resmi] --> H
    H[Procurement:<br/>Input Kontrak<br/>+ Termin Pembayaran] --> I
    I[Supplier:<br/>Kirim Barang + Tagihan] --> J
    J[Keuangan:<br/>Input Data Tagihan<br/>+ Upload Berkas] --> K
    K[Kasir:<br/>Cairkan Dana<br/>Pembayaran] --> END3([End])

    style START fill:#f0fdf4,stroke:#22c55e,color:#166534
    style END1 fill:#fef2f2,stroke:#ef4444,color:#991b1b
    style END2 fill:#fef2f2,stroke:#ef4444,color:#991b1b
    style END3 fill:#f0fdf4,stroke:#22c55e,color:#166534
    style C fill:#fef2f2,stroke:#fca5a5,color:#991b1b
    style E fill:#fef2f2,stroke:#fca5a5,color:#991b1b
    style B fill:#eff6ff,stroke:#3b82f6,color:#1e40af
    style D fill:#eff6ff,stroke:#3b82f6,color:#1e40af`}
          />
          <p className="mt-2 text-sm text-zinc-400 text-center">
            Activity Diagram — Alur Permintaan dengan 2 decision gate
          </p>
        </Subsection>

        {/* 1.4b Non-Functional Requirements */}
        <Subsection title="1.4b Kebutuhan Non-Fungsional">
          <Table
            headers={["ID", "Kategori", "Kebutuhan", "Spesifikasi"]}
            rows={[
              ["NF-01", "Keamanan", "Role-Based Access Control (RBAC)", "7 role dengan akses terbatas per modul"],
              ["NF-02", "Keamanan", "Audit Trail", "Log setiap approval/rejection dengan timestamp, user, dan alasan"],
              ["NF-03", "Keamanan", "Keamanan Dokumen", "Enkripsi file upload (tagihan, PO) di storage"],
              ["NF-04", "Keandalan", "Backup Database", "Backup otomatis harian dengan retensi 30 hari"],
              ["NF-05", "Keandalan", "Upload Validasi", "Maks 5MB, format PDF/JPG/PNG, virus scan"],
              ["NF-06", "Performa", "Response Time", "Halaman < 2 detik, laporan < 5 detik"],
              ["NF-07", "Performa", "Concurrent Users", "Minimal 50 user simultan"],
              ["NF-08", "Maintainability", "Dokumentasi", "FSD, TSD, API docs, user manual"],
            ]}
          />
        </Subsection>

        {/* 1.5 Mockup */}
        <Subsection title="1.5 Desain Interface / Mockup">
          <p className="mb-6 leading-relaxed text-zinc-600">
            Komponen UI Back Office yang diusulkan:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Top Navigation", desc: "Dashboard | Permintaan | Kontrak | Tagihan | Pembayaran | Laporan" },
              { title: "Dashboard", desc: "Card ringkasan: permintaan menunggu, kontrak aktif, tagihan pending" },
              { title: "Tabel Data", desc: "Sortable, searchable, pagination — untuk semua modul" },
              { title: "Form Input", desc: "Validasi client + server, multi-item dynamic fields" },
              { title: "Upload", desc: "Drag & drop, preview PDF/JPG, max 5MB" },
              { title: "Notifikasi", desc: "Badge counter + toast popup real-time" },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-lg border border-zinc-200 p-5">
                <h5 className="mb-1 text-sm font-semibold text-zinc-800">{title}</h5>
                <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a
              href="/prototype"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Buka Interactive Prototype
            </a>
            <p className="mt-3 text-sm text-zinc-400">
              Prototype interaktif mencakup 7 role aktor dan 15 use case — simulasi alur pengadaan dari Unit Pemohon hingga Manager.
            </p>
          </div>
        </Subsection>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* ───── SECTION 2 ───── */}
      {/* ════════════════════════════════════════ */}
      <Section number="2" title="Model Proses Pengembangan" points={25}>
        <Subsection title="Hybrid — Agile Scrum + Waterfall (Wagile)">
          <p className="mb-6 leading-relaxed text-zinc-600">
            Model hybrid dipilih karena durasi 3 bulan terlalu ketat untuk full
            Waterfall namun terlalu berisiko untuk full Agile — sistem keuangan
            wajib memiliki dokumentasi lengkap.
          </p>
          <Table
            headers={["Faktor", "Alasan Hybrid"]}
            rows={[
              ["Durasi 3 bulan", "Terlalu ketat untuk full Waterfall, terlalu berisiko untuk full Agile"],
              ["Requirement jelas", "Alur bisnis detail — fondasi Waterfall kuat"],
              ["Multi-stakeholder", "Butuh sprint demo per modul ke masing-masing aktor"],
              ["Dependency antar modul", "Permintaan → Validasi → Kontrak → Tagihan → Bayar (berurutan)"],
              ["Dokumentasi wajib", "Sistem keuangan — FSD/TSD harus ada untuk audit"],
            ]}
          />

          <h4 className="mb-6 mt-8 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Timeline 12 Minggu
          </h4>
          <div className="space-y-3">
            {[
              { week: "1–2", phase: "Analisis & Desain", tag: "Waterfall", output: "BRD, FSD, ERD, UML, Mockup" },
              { week: "3–4", phase: "Sprint 1 — Permintaan & Validasi", tag: "Agile", output: "Demo ke Procurement & Unit Pemohon" },
              { week: "5–6", phase: "Sprint 2 — Budgeting & Kontrak", tag: "Agile", output: "Demo ke Budgeting & Procurement" },
              { week: "7–8", phase: "Sprint 3 — Tagihan & Pembayaran", tag: "Agile", output: "Demo ke Keuangan & Kasir" },
              { week: "9–10", phase: "Sprint 4 — Laporan & Finishing", tag: "Agile", output: "Demo ke Manager" },
              { week: "11–12", phase: "UAT, Bug Fixing, Go Live", tag: "Final", output: "User Acceptance Test → Deployment 🚀" },
            ].map(({ week, phase, tag, output }) => (
              <div key={week} className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg border border-zinc-200 px-5 py-4 text-sm">
                <span className="w-12 text-xs font-medium text-zinc-400">W{week}</span>
                <span className="font-medium text-zinc-800">{phase}</span>
                <span className="ml-auto rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-medium text-zinc-500">{tag}</span>
                <span className="w-full text-zinc-400">{output}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-1 text-sm text-zinc-500">
            {["M1 (W2): FSD & Desain disetujui", "M2 (W4): Modul Permintaan + Validasi live", "M3 (W6): Modul Budgeting + Kontrak live", "M4 (W8): Modul Tagihan + Pembayaran live", "M5 (W10): Semua modul selesai", "M6 (W12): UAT selesai, GO LIVE 🚀"].map((m) => (
              <p key={m}><span className="font-semibold text-zinc-700">{m.split(":")[0]}</span>: {m.split(": ")[1]}</p>
            ))}
          </div>
          <div className="mt-8">
            <a
              href="/prototype"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Buka Interactive Prototype
            </a>
            <p className="mt-3 text-sm text-zinc-400">
              Prototype interaktif mencakup 7 role aktor dan 15 use case — simulasi alur pengadaan dari Unit Pemohon hingga Manager.
            </p>
          </div>
        </Subsection>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* ───── SECTION 3 ───── */}
      {/* ════════════════════════════════════════ */}
      <Section number="3" title="SDM yang Dibutuhkan" points={10}>
        <Table
          headers={["#", "Role", "Jumlah", "Tanggung Jawab"]}
          rows={[
            ["1", "Project Manager", "1", "Koordinasi, timeline, stakeholder communication"],
            ["2", "System Analyst (saya)", "1", "Requirement gathering, FSD, UML, ERD, mockup, UAT"],
            ["3", "Backend Developer", "2", "API development, database, business logic"],
            ["4", "Frontend Developer", "1", "UI/UX back office, implementasi mockup"],
            ["5", "QA / Tester", "1", "Test case, regression test, bug reporting"],
            ["6", "Database Administrator", "1", "DB schema, indexing, optimization, backup"],
            ["7", "UI/UX Designer", "1", "Desain interface, wireframe, prototype, usability testing. Skill: Figma, design system, user research"],
            ["8", "DevOps/Infra Engineer", "1", "CI/CD pipeline, server management, monitoring, deployment. Skill: Docker, Linux, Nginx, SSL, backup automation"],
            ["9", "Product Owner / User Representative", "1", "Representasi kebutuhan user procurement & finance, acceptance criteria, sprint review. Skill: Domain knowledge pengadaan, komunikasi stakeholder"],
          ]}
          footer="Total: 10 orang"
        />
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* ───── SECTION 4 ───── */}
      {/* ════════════════════════════════════════ */}
      <Section number="4" title="Penjadwalan Proyek" points={10}>
        <p className="mb-8 leading-relaxed text-zinc-600">
          Timeline 3 bulan (12 minggu) dengan 4 sprint 2-mingguan, 6 milestone,
          dan buffer 1 minggu untuk unexpected issues.
        </p>

        <div className="overflow-x-auto">
          <div className="mb-2 flex text-xs text-zinc-400">
            <span className="w-36 shrink-0" />
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="w-10 text-center">{i + 1}</span>
            ))}
          </div>
          <div className="space-y-1">
            {[
              { label: "Analisis & Desain", weeks: [1, 2], color: "bg-amber-100 border-amber-300 text-amber-800" },
              { label: "Sprint 1 — Permintaan", weeks: [3, 4], color: "bg-blue-100 border-blue-300 text-blue-800" },
              { label: "Sprint 2 — Budgeting", weeks: [5, 6], color: "bg-emerald-100 border-emerald-300 text-emerald-800" },
              { label: "Sprint 3 — Tagihan", weeks: [7, 8], color: "bg-purple-100 border-purple-300 text-purple-800" },
              { label: "Sprint 4 — Laporan", weeks: [9, 10], color: "bg-rose-100 border-rose-300 text-rose-800" },
              { label: "UAT & Go Live", weeks: [11, 12], color: "bg-zinc-200 border-zinc-400 text-zinc-700" },
            ].map(({ label, weeks, color }) => (
              <div key={label} className="flex items-center text-xs">
                <span className="w-36 shrink-0 pr-3 text-right text-zinc-500">{label}</span>
                {Array.from({ length: 12 }, (_, i) => {
                  const active = i + 1 >= weeks[0] && i + 1 <= weeks[1];
                  return (
                    <span key={i} className={`w-10 h-7 border-r border-white ${active ? color : "bg-zinc-50"}`} />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-zinc-400">Minggu 1 – 12</p>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* ───── SECTION 5 ───── */}
      {/* ════════════════════════════════════════ */}
      <Section number="5" title="Key Point Laporan ke Project Manager" points={5}>
        <div className="mb-10">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">Sisi Teknis</h4>
          <div className="space-y-4">
            {[
              { id: 1, title: "Database harus support MULTI-ITEM per transaksi", risk: "User input berulang & data tidak akurat" },
              { id: 2, title: "Upload dokumen harus ada validasi (max 5MB, PDF/JPG)", risk: "Storage penuh dan file korup" },
              { id: 3, title: "Role-based access control — Unit Pemohon ≠ modul Keuangan", risk: "Kebocoran data sensitif — risiko audit" },
              { id: 4, title: "Notifikasi real-time via sistem (bukan email)", risk: "Bottleneck di validasi manual — project delay" },
              { id: 5, title: "Backup database harian", risk: "Risiko kehilangan data keuangan yang berdampak pada kegagalan audit" },
            ].map(({ id, title, risk }) => (
              <div key={id} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500">{id}</span>
                <div>
                  <p className="font-medium text-zinc-800">{title}</p>
                  <p className="text-sm text-red-500">⚠ Risiko: {risk}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">Sisi Manajerial</h4>
          <div className="space-y-4">
            {[
              { id: 1, title: "Sign-off FSD dari semua stakeholder sebelum mulai coding", risk: "Risiko perubahan lingkup yang tidak terkendali" },
              { id: 2, title: "Demo sprint setiap 2 minggu ke user — bukan tunggu UAT akhir", risk: "Ketidaksesuaian ekspektasi yang berpotensi menghasilkan pekerjaan ulang signifikan" },
              { id: 3, title: "Training user minimal 1 minggu sebelum go-live", risk: "Resistansi pengguna dan potensi kesalahan input data" },
              { id: 4, title: "Dedicated QA sejak Sprint 1 — bukan cuma tes di akhir", risk: "Akumulasi defect berpotensi menunda jadwal go-live" },
              { id: 5, title: "Buffer 1 minggu untuk unexpected issues", risk: "risiko keterlambatan meningkat apabila tidak tersedia buffer waktu" },
            ].map(({ id, title, risk }) => (
              <div key={id} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500">{id}</span>
                <div>
                  <p className="font-medium text-zinc-800">{title}</p>
                  <p className="text-sm text-red-500">⚠ Risiko: {risk}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───── FOOTER ───── */}
      <footer className="mt-32 border-t border-zinc-200 pt-12 text-center">
        <p className="text-sm italic text-zinc-400">Disusun oleh</p>
        <p className="mt-1 text-lg font-semibold text-zinc-800">Ridha Fahmi Junaidi</p>
        <p className="text-sm text-zinc-400">System Analyst Candidate</p>
        <p className="mt-6 text-xs text-zinc-300">PT Aksa Digital Group — 25 Juni 2026</p>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ════════════════════════════════════════════════════════ */

function Section({ number, title, points, children }: { number: string; title: string; points: number; children: React.ReactNode }) {
  return (
    <section className="mb-24">
      <div className="mb-10">
        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-zinc-300">Section {number}</span>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{title}</h2>
        <span className="mt-2 inline-block rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-medium text-zinc-500">{points} poin</span>
      </div>
      <div className="space-y-12">{children}</div>
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-base font-semibold text-zinc-800">{title}</h3>
      {children}
    </div>
  );
}

function Table({ headers, rows, footer }: { headers: string[]; rows: string[][]; footer?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold text-zinc-500 first:pl-5 last:pr-5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-100 last:border-none">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-zinc-600 first:pl-5 last:pr-5">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {footer && (
        <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-2 text-sm font-medium text-zinc-600">{footer}</div>
      )}
    </div>
  );
}
