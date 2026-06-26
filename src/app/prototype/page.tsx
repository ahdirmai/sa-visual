"use client";

import { useState } from "react";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */
type Role = "Unit Pemohon" | "Procurement" | "Budgeting" | "Keuangan" | "Kasir" | "Manager" | "Supplier";

type View = "Dashboard" | "Permintaan" | "Validasi" | "Kontrak" | "PO & Receipt" | "Tagihan" | "Pembayaran" | "Laporan" | "Supplier PO" | "Supplier Kirim";

type StatusPermintaan = "Draft" | "Menunggu Validasi" | "Disetujui Procurement" | "Ditolak" | "Menunggu Verifikasi Anggaran" | "Anggaran Tersedia" | "Anggaran Tidak Tersedia" | "Draft PO Dikirim" | "Kontrak Dibuat" | "Barang Diterima" | "Tagihan Dibuat" | "Selesai";

type StatusKontrak = "Menunggu PO" | "Draft PO Dikirim" | "PO Diterima Supplier" | "Menunggu Barang" | "Barang Diterima" | "Selesai";

type PermintaanItem = { id: number; namaBarang: string; jumlah: number; satuan: string };

type Notif = { id: number; msg: string; time: string; read: boolean; view?: View };

type Permintaan = { id: string; unit: string; tgl: string; items: PermintaanItem[]; status: StatusPermintaan; alasanTolak?: string };

type Kontrak = {
  id: string; noKontrak: string; supplier: string; nilai: number;
  termin: { id: number; tgl: string; persentase: number; nominal: number; status: "Belum" | "Dibayar" }[];
  status: StatusKontrak; buktiPO?: boolean;
};

type Tagihan = { id: string; noTagihan: string; supplier: string; kontrakId: string; tgl: string; nominal: number; berkas?: boolean };

/* ═══════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════ */
const ROLES: Role[] = ["Unit Pemohon", "Procurement", "Budgeting", "Keuangan", "Kasir", "Manager", "Supplier"];

const NAV_ITEMS: { label: View; icon: string; roles: Role[] }[] = [
  { label: "Dashboard", icon: "◨", roles: ["Unit Pemohon","Procurement","Budgeting","Keuangan","Kasir","Manager","Supplier"] },
  { label: "Permintaan", icon: "◈", roles: ["Unit Pemohon","Procurement","Budgeting","Manager"] },
  { label: "Validasi", icon: "◉", roles: ["Procurement","Budgeting"] },
  { label: "Kontrak", icon: "◫", roles: ["Procurement"] },
  { label: "PO & Receipt", icon: "◪", roles: ["Procurement"] },
  { label: "Tagihan", icon: "▣", roles: ["Keuangan"] },
  { label: "Pembayaran", icon: "◩", roles: ["Kasir"] },
  { label: "Laporan", icon: "▤", roles: ["Manager"] },
  { label: "Supplier PO", icon: "❆", roles: ["Supplier"] },
  { label: "Supplier Kirim", icon: "◆", roles: ["Supplier"] },
];

const SC: Record<StatusPermintaan, string> = {
  "Draft": "bg-zinc-100 text-zinc-600", "Menunggu Validasi": "bg-amber-100 text-amber-700",
  "Disetujui Procurement": "bg-blue-100 text-blue-700", "Ditolak": "bg-red-100 text-red-700",
  "Menunggu Verifikasi Anggaran": "bg-purple-100 text-purple-700", "Anggaran Tersedia": "bg-emerald-100 text-emerald-700",
  "Anggaran Tidak Tersedia": "bg-red-100 text-red-700", "Draft PO Dikirim": "bg-sky-100 text-sky-700",
  "Kontrak Dibuat": "bg-indigo-100 text-indigo-700", "Barang Diterima": "bg-teal-100 text-teal-700",
  "Tagihan Dibuat": "bg-violet-100 text-violet-700", "Selesai": "bg-zinc-200 text-zinc-600",
};

const SC2: Record<StatusKontrak, string> = {
  "Menunggu PO": "bg-amber-100 text-amber-700", "Draft PO Dikirim": "bg-blue-100 text-blue-700",
  "PO Diterima Supplier": "bg-sky-100 text-sky-700", "Menunggu Barang": "bg-purple-100 text-purple-700",
  "Barang Diterima": "bg-emerald-100 text-emerald-700", "Selesai": "bg-zinc-200 text-zinc-600",
};

function fmt(n: number) { return n >= 1_000_000 ? `Rp ${(n/1_000_000).toFixed(0)}M` : `Rp ${(n/1_000).toFixed(0)}K`; }

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function PrototypePage() {
  const [view, setView] = useState<View>("Dashboard");
  const [role, setRole] = useState<Role>("Procurement");
  const [prs, setPrs] = useState<Permintaan[]>([
    { id:"PR-042", unit:"IT", tgl:"25 Jun 2026", items:[{id:1,namaBarang:"Laptop Thinkpad",jumlah:5,satuan:"unit"},{id:2,namaBarang:"Monitor 24\"",jumlah:5,satuan:"unit"},{id:3,namaBarang:"Keyboard Mechanical",jumlah:10,satuan:"pcs"}], status:"Menunggu Validasi" },
    { id:"PR-041", unit:"Finance", tgl:"24 Jun 2026", items:[{id:1,namaBarang:"Printer Laser",jumlah:2,satuan:"unit"},{id:2,namaBarang:"Scanner ADF",jumlah:1,satuan:"unit"}], status:"Disetujui Procurement" },
    { id:"PR-040", unit:"HR", tgl:"23 Jun 2026", items:[{id:1,namaBarang:"Seragam Karyawan",jumlah:30,satuan:"set"}], status:"Anggaran Tersedia" },
    { id:"PR-039", unit:"Marketing", tgl:"22 Jun 2026", items:[{id:1,namaBarang:"Banner Roll-up",jumlah:6,satuan:"pcs"}], status:"Kontrak Dibuat" },
  ]);
  const [kontraks, setKontraks] = useState<Kontrak[]>([
    { id:"KTR-008", noKontrak:"KTR-008/VI/2026", supplier:"PT Teknologi Mandiri", nilai:180000000,
      termin:[{id:1,tgl:"10 Jul 2026",persentase:30,nominal:54000000,status:"Dibayar"},{id:2,tgl:"10 Agu 2026",persentase:40,nominal:72000000,status:"Dibayar"},{id:3,tgl:"10 Sep 2026",persentase:30,nominal:54000000,status:"Belum"}],
      status:"Menunggu Barang", buktiPO:true },
    { id:"KTR-007", noKontrak:"KTR-007/VI/2026", supplier:"CV Sentosa Abadi", nilai:95000000,
      termin:[{id:1,tgl:"5 Jul 2026",persentase:50,nominal:47500000,status:"Dibayar"},{id:2,tgl:"5 Agu 2026",persentase:50,nominal:47500000,status:"Belum"}],
      status:"PO Diterima Supplier", buktiPO:true },
  ]);
  const [tagihans, setTagihans] = useState<Tagihan[]>([
    { id:"TAG-012", noTagihan:"INV-2026-012", supplier:"PT Teknologi Mandiri", kontrakId:"KTR-008", tgl:"20 Jun 2026", nominal:54000000, berkas:true },
  ]);
  const [notifs, setNotifs] = useState<Notif[]>([
    { id:1, msg:"PR-042 diajukan oleh IT", time:"2 menit lalu", read:false, view:"Permintaan" },
    { id:2, msg:"PR-040 anggaran tersedia", time:"15 menit lalu", read:false, view:"Validasi" },
    { id:3, msg:"KTR-008 barang sedang dikirim", time:"1 jam lalu", read:false, view:"Kontrak" },
  ]);
  const [showNotif, setShowNotif] = useState(false);
  const [formItems, setFormItems] = useState<PermintaanItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Permintaan | null>(null);
  const [alasan, setAlasan] = useState("");
  const [showNotifSuccess, setShowNotifSuccess] = useState("");

  const addNotif = (msg: string, v?: View) => {
    setNotifs(n => [{ id: Date.now(), msg, time: "Baru saja", read: false, view: v }, ...n]);
  };
  const unreadCount = notifs.filter(n => !n.read).length;
  const visNav = NAV_ITEMS.filter(n => n.roles.includes(role));

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      {/* ─── SIDEBAR ─── */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-zinc-100 px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-xs font-bold text-white">SP</div>
          <span className="text-sm font-semibold tracking-tight">Sistem Pengadaan</span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
          {visNav.map(it => (
            <button key={it.label} onClick={() => setView(it.label)}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${view === it.label ? "bg-zinc-100 font-medium text-zinc-900" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"}`}>
              <span className="text-xs opacity-60">{it.icon}</span>{it.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-zinc-100 p-4">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-400">Role</p>
          <select value={role} onChange={e => { setRole(e.target.value as Role); setView("Dashboard"); setShowNotif(false); }}
            className="w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 focus:border-zinc-300 focus:outline-none">
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
          <div className="mt-3 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-500">RF</div>
            <div className="text-xs leading-tight"><p className="font-medium text-zinc-700">Ridha Fahmi</p><p className="text-zinc-400">{role}</p></div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="flex flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-medium text-zinc-500">{view}</h1>
            {view !== "Dashboard" && <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-300">• {role}</span>}
          </div>
          <div className="relative flex items-center gap-2">
            {showNotifSuccess && (
              <div className="absolute right-10 top-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg">{showNotifSuccess}</div>
            )}
            <button onClick={() => setShowNotif(!showNotif)}
              className="relative rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600">
              <span className="text-sm">🔔</span>
              {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{unreadCount}</span>}
            </button>
          </div>
        </header>

        {/* NOTIFICATION DROPDOWN */}
        {showNotif && (
          <div className="fixed right-6 top-14 z-30 w-80 rounded-xl border border-zinc-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <p className="text-xs font-semibold text-zinc-700">Notifikasi</p>
              <button onClick={() => setNotifs(n => n.map(x => ({...x, read:true})))} className="text-[10px] text-zinc-400 hover:text-zinc-600">Tandai semua dibaca</button>
            </div>
            {notifs.length === 0 ? <p className="py-6 text-center text-xs text-zinc-400">Tidak ada notifikasi</p> : notifs.slice(0,8).map(n => (
              <button key={n.id} onClick={() => { if(n.view) setView(n.view); setNotifs(ns => ns.map(x => x.id === n.id ? {...x, read:true} : x)); setShowNotif(false); }}
                className={`flex w-full flex-col gap-0.5 border-b border-zinc-50 px-4 py-3 text-left hover:bg-zinc-50 ${!n.read ? "bg-blue-50/50" : ""}`}>
                <p className={`text-xs ${!n.read ? "font-medium text-zinc-800" : "text-zinc-500"}`}>{n.msg}</p>
                <p className="text-[10px] text-zinc-400">{n.time}</p>
              </button>
            ))}
          </div>
        )}

        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10">
          {view === "Dashboard" && <Dash prs={prs} kontraks={kontraks} tagihans={tagihans} onNav={setView} />}
          {view === "Permintaan" && <PermintaanView prs={prs} role={role} formItems={formItems} setFormItems={setFormItems} showForm={showForm} setShowForm={setShowForm}
            addPermintaan={() => { const n={ id:`PR-${String(prs.length+43).padStart(3,"0")}`, unit:"IT", tgl:new Date().toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}), items:[...formItems], status:"Menunggu Validasi" as StatusPermintaan }; setPrs([n,...prs]); setFormItems([]); setShowForm(false); addNotif(`${n.id} diajukan oleh IT`, "Permintaan"); setShowNotifSuccess("Permintaan diajukan!"); setTimeout(()=>setShowNotifSuccess(""),2000); }}
            selected={selected} setSelected={setSelected} alasan={alasan} setAlasan={setAlasan}
            approve={(p:Permintaan) => { setPrs(prs.map(x=>x.id===p.id?{...x,status:"Menunggu Verifikasi Anggaran"}:x)); addNotif(`${p.id} disetujui Procurement`,"Validasi"); setSelected(null); setShowNotifSuccess("Permintaan disetujui!"); setTimeout(()=>setShowNotifSuccess(""),2000); }}
            reject={(p:Permintaan) => { setPrs(prs.map(x=>x.id===p.id?{...x,status:"Ditolak",alasanTolak:alasan}:x)); setAlasan(""); setSelected(null); addNotif(`${p.id} ditolak: ${alasan}`); setShowNotifSuccess("Permintaan ditolak"); setTimeout(()=>setShowNotifSuccess(""),2000); }}
          />}
          {view === "Validasi" && <ValidasiView prs={prs} role={role}
            approve={(p:Permintaan) => { setPrs(prs.map(x=>x.id===p.id?{...x,status:"Menunggu Verifikasi Anggaran"}:x)); addNotif(`${p.id} disetujui Procurement`,"Validasi"); setShowNotifSuccess("Disetujui"); setTimeout(()=>setShowNotifSuccess(""),2000); }}
            reject={(p:Permintaan) => { setPrs(prs.map(x=>x.id===p.id?{...x,status:"Ditolak",alasanTolak:alasan}:x)); setAlasan(""); addNotif(`${p.id} ditolak`); }}
            verifyAnggaran={(p:Permintaan,ok:boolean) => { setPrs(prs.map(x=>x.id===p.id?{...x,status:ok?"Anggaran Tersedia":"Anggaran Tidak Tersedia"}:x)); addNotif(`${p.id} anggaran ${ok?"tersedia":"tidak tersedia"}`, ok?"Kontrak":undefined); setShowNotifSuccess(ok?"Anggaran tersedia":"Anggaran tidak tersedia"); setTimeout(()=>setShowNotifSuccess(""),2000); }}
            selected={selected} setSelected={setSelected} alasan={alasan} setAlasan={setAlasan}
          />}
          {view === "Kontrak" && <KontrakView prs={prs} kontraks={kontraks}
            buatKontrak={(p:Permintaan, supplier:string, nilai:number, termin:{tgl:string,persentase:number}[]) => {
              const nk={ id:`KTR-${String(kontraks.length+9).padStart(3,"0")}`, noKontrak:`KTR-${String(kontraks.length+9).padStart(3,"0")}/VI/2026`, supplier, nilai,
                termin:termin.map((t,i)=>({id:i+1,tgl:t.tgl,persentase:t.persentase,nominal:Math.round(nilai*t.persentase/100),status:"Belum" as const})),
                status:"Menunggu PO" as StatusKontrak, buktiPO:false };
              setKontraks([nk,...kontraks]); setPrs(prs.map(x=>x.id===p.id?{...x,status:"Kontrak Dibuat"}:x));
              addNotif(`Kontrak ${nk.noKontrak} dibuat, perlu kirim Draft PO`,"PO & Receipt"); setShowNotifSuccess("Kontrak dibuat"); setTimeout(()=>setShowNotifSuccess(""),2000);
            }}
          />}
          {view === "PO & Receipt" && <POReceiptView kontraks={kontraks} prs={prs}
            kirimDraftPO={(k:Kontrak) => { setKontraks(kontraks.map(x=>x.id===k.id?{...x,status:"Draft PO Dikirim"}:x)); addNotif(`Draft PO ${k.noKontrak} dikirim ke supplier`); setShowNotifSuccess("Draft PO dikirim"); setTimeout(()=>setShowNotifSuccess(""),2000); }}
            uploadBuktiPO={(k:Kontrak) => { setKontraks(kontraks.map(x=>x.id===k.id?{...x,buktiPO:true}:x)); setShowNotifSuccess("Bukti PO diupload"); setTimeout(()=>setShowNotifSuccess(""),2000); }}
            terimaBarang={(k:Kontrak) => { setKontraks(kontraks.map(x=>x.id===k.id?{...x,status:"Barang Diterima"}:x)); setPrs(prs.map(x=>{const pr=kontraks.find(y=>y.id===k.id); return x.status==="Kontrak Dibuat"?x:x;})); addNotif(`Barang dari ${k.supplier} diterima`,"Tagihan"); setShowNotifSuccess("Barang diterima"); setTimeout(()=>setShowNotifSuccess(""),2000); }}
          />}
          {view === "Supplier PO" && <SupplierPOView kontraks={kontraks}
            terimaDraftPO={(k:Kontrak) => { setKontraks(kontraks.map(x=>x.id===k.id?{...x,status:"PO Diterima Supplier"}:x)); addNotif(`Supplier ${k.supplier} menerima Draft PO`); setShowNotifSuccess("PO diterima"); setTimeout(()=>setShowNotifSuccess(""),2000); }}
          />}
          {view === "Supplier Kirim" && <SupplierKirimView kontraks={kontraks} tagihans={tagihans}
            kirimBarang={(k:Kontrak) => { setKontraks(kontraks.map(x=>x.id===k.id?{...x,status:"Menunggu Barang"}:x)); addNotif(`Barang dari ${k.supplier} sedang dikirim`); setShowNotifSuccess("Barang dikirim"); setTimeout(()=>setShowNotifSuccess(""),2000); }}
            kirimTagihan={(k:Kontrak) => { const nt={ id:`TAG-${String(tagihans.length+13).padStart(3,"0")}`, noTagihan:`INV-2026-${String(tagihans.length+13).padStart(3,"0")}`, supplier:k.supplier, kontrakId:k.id, tgl:new Date().toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}), nominal:k.termin.find(t=>t.status==="Belum")?.nominal||k.nilai, berkas:true }; setTagihans([nt,...tagihans]); addNotif(`Tagihan ${nt.noTagihan} dari ${k.supplier}`,"Tagihan"); setShowNotifSuccess("Tagihan dikirim"); setTimeout(()=>setShowNotifSuccess(""),2000); }}
          />}
          {view === "Tagihan" && <TagihanView tagihans={tagihans} kontraks={kontraks}
            addTagihan={(kontrakId:string, nominal:number, berkasName?:string) => {
              const k=kontraks.find(x=>x.id===kontrakId);
              if(!k) return;
              const nt={ id:`TAG-${String(tagihans.length+13).padStart(3,"0")}`, noTagihan:`INV-2026-${String(tagihans.length+13).padStart(3,"0")}`, supplier:k.supplier, kontrakId, tgl:new Date().toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}), nominal, berkas:true, berkasName:berkasName||"invoice.pdf" };
              setTagihans([nt,...tagihans]); addNotif(`Tagihan ${nt.noTagihan} dari ${k.supplier}`,"Tagihan"); setShowNotifSuccess("Tagihan disimpan"); setTimeout(()=>setShowNotifSuccess(""),2000);
            }}
          />}
          {view === "Pembayaran" && <PembayaranView kontraks={kontraks}
            bayar={(k:Kontrak,tid:number) => { setKontraks(kontraks.map(x=>x.id===k.id?{...x,termin:x.termin.map(t=>t.id===tid?{...t,status:"Dibayar" as const}:t)}:x)); addNotif(`Termin ${tid} ${k.noKontrak} dibayar`); setShowNotifSuccess("Pembayaran berhasil"); setTimeout(()=>setShowNotifSuccess(""),2000); }}
          />}
          {view === "Laporan" && <LaporanView prs={prs} kontraks={kontraks} tagihans={tagihans} />}
          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════ */
function Dash({ prs, kontraks, tagihans, onNav }: { prs: Permintaan[]; kontraks: Kontrak[]; tagihans: Tagihan[]; onNav: (v: View) => void }) {
  const w = prs.filter(p => ["Menunggu Validasi","Menunggu Verifikasi Anggaran"].includes(p.status)).length;
  return (
    <div>
      <div className="mb-12 grid gap-6 sm:grid-cols-3">
        {[{l:"Permintaan Menunggu",v:String(w),d:"Klik untuk lihat",c:"bg-amber-50 text-amber-700 border-amber-200",nv:"Permintaan" as View},
          {l:"Kontrak Aktif",v:String(kontraks.filter(k=>k.status!=="Selesai").length),d:"Total Rp 340M",c:"bg-blue-50 text-blue-700 border-blue-200",nv:"Kontrak" as View},
          {l:"Tagihan Pending",v:String(tagihans.length),d:"Menunggu pembayaran",c:"bg-rose-50 text-rose-700 border-rose-200",nv:"Tagihan" as View},
        ].map(card => (
          <button key={card.l} onClick={() => onNav(card.nv)} className={`rounded-xl border px-6 py-6 text-left transition-colors hover:shadow-sm ${card.c}`}>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider opacity-70">{card.l}</p>
            <p className="text-4xl font-semibold tracking-tight">{card.v}</p>
            <p className="mt-2 text-xs opacity-60">{card.d}</p>
          </button>
        ))}
      </div>
      <h2 className="mb-4 text-lg font-semibold tracking-tight">Permintaan Terbaru</h2>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm"><thead><tr className="border-b border-zinc-100 bg-zinc-50/50">
          {["No","Unit","Tanggal","Item","Status"].map(h=><th key={h} className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-400">{h}</th>)}
        </tr></thead><tbody>
          {prs.slice(0,4).map(r=><tr key={r.id} className="border-b border-zinc-50 hover:bg-zinc-50/50">
            <td className="px-5 py-3 font-mono text-xs text-zinc-500">{r.id}</td>
            <td className="px-5 py-3 font-medium text-zinc-700">{r.unit}</td>
            <td className="px-5 py-3 text-zinc-500">{r.tgl}</td>
            <td className="max-w-[180px] truncate px-5 py-3 text-zinc-600">{r.items.map(i=>i.namaBarang).join(", ")}</td>
            <td className="px-5 py-3"><span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${SC[r.status]}`}>{r.status}</span></td>
          </tr>)}
        </tbody></table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PERMINTAAN (UC1 + UC2 notification on action)
   ═══════════════════════════════════════════════ */
function PermintaanView({ prs, role, formItems, setFormItems, showForm, setShowForm, addPermintaan, selected, setSelected, alasan, setAlasan, approve, reject }: any) {
  return (
    <div>
      {role === "Unit Pemohon" && (<div className="mb-8">
        {!showForm ? <button onClick={() => setShowForm(true)} className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800">+ Ajukan Permintaan Baru</button> : (
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="mb-4 text-base font-semibold">Pengajuan Permintaan Barang</h3>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div><label className="mb-1 block text-xs text-zinc-500">Tanggal</label><input className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" defaultValue="25 Jun 2026" /></div>
              <div><label className="mb-1 block text-xs text-zinc-500">Unit</label><select className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm"><option>IT</option><option>Finance</option><option>HR</option><option>Marketing</option></select></div>
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-xs text-zinc-500">Daftar Barang</label>
              {formItems.map((item:PermintaanItem, i:number) => <div key={i} className="mb-2 flex gap-2 text-sm"><span className="w-6 text-zinc-400">{i+1}.</span><span className="flex-1 text-zinc-700">{item.namaBarang}</span><span className="text-zinc-500">{item.jumlah} {item.satuan}</span><button onClick={() => setFormItems(formItems.filter((_:any,j:number) => j!==i))} className="text-red-400 hover:text-red-600">✕</button></div>)}
              <AddItem onAdd={(item:PermintaanItem) => setFormItems([...formItems, item])} />
            </div>
            <div className="flex gap-3">
              <button onClick={addPermintaan} disabled={formItems.length===0} className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-40">Simpan & Ajukan</button>
              <button onClick={() => { setShowForm(false); setFormItems([]); }} className="rounded-lg border border-zinc-200 px-4 py-2 text-xs text-zinc-600 hover:bg-zinc-50">Batal</button>
            </div>
          </div>
        )}
      </div>)}
      {selected && <DetailModal p={selected} onClose={() => setSelected(null)} alasan={alasan} setAlasan={setAlasan} approve={approve} reject={reject} role={role} />}
      <PRTable prs={prs} onDetail={setSelected} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   VALIDASI (UC3 + UC9)
   ═══════════════════════════════════════════════ */
function ValidasiView({ prs, role, approve, reject, verifyAnggaran, selected, setSelected, alasan, setAlasan }: any) {
  const needVal = prs.filter((p:Permintaan) => ["Menunggu Validasi","Menunggu Verifikasi Anggaran"].includes(p.status));
  return (
    <div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {needVal.map((pr:Permintaan) => (
          <div key={pr.id} className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="font-mono text-xs text-zinc-400">{pr.id}</p>
            <p className="font-semibold text-zinc-800">{pr.unit} — {pr.tgl}</p>
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${SC[pr.status]}`}>{pr.status}</span>
            <div className="my-3 space-y-0.5 text-sm text-zinc-600">{pr.items.map((i:PermintaanItem,idx:number) => <p key={idx}>{i.namaBarang} ×{i.jumlah} {i.satuan}</p>)}</div>
            {pr.status === "Menunggu Validasi" && role === "Procurement" && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button onClick={() => approve(pr)} className="flex-1 rounded-lg bg-emerald-600 py-2 text-xs font-medium text-white hover:bg-emerald-700">✓ Setujui</button>
                  <button onClick={() => setSelected(pr)} className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-medium text-white hover:bg-red-700">✕ Tolak</button>
                </div>
                {selected?.id === pr.id && <div className="space-y-2"><input value={alasan} onChange={(e:any) => setAlasan(e.target.value)} placeholder="Alasan penolakan..." className="w-full rounded-md border border-zinc-200 px-3 py-1.5 text-xs" /><button onClick={() => reject(pr)} className="w-full rounded-lg border border-red-200 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">Konfirmasi Tolak</button></div>}
              </div>
            )}
            {pr.status === "Menunggu Verifikasi Anggaran" && role === "Budgeting" && (
              <div className="flex gap-2">
                <button onClick={() => verifyAnggaran(pr, true)} className="flex-1 rounded-lg bg-emerald-600 py-2 text-xs font-medium text-white hover:bg-emerald-700">✓ Anggaran Tersedia</button>
                <button onClick={() => verifyAnggaran(pr, false)} className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-medium text-white hover:bg-red-700">✕ Tidak Tersedia</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {needVal.length === 0 && <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center"><p className="text-sm text-zinc-400">✨ Tidak ada yang perlu divalidasi</p></div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   KONTRAK (UC5 + UC6)
   ═══════════════════════════════════════════════ */
function KontrakView({ prs, kontraks, buatKontrak }: any) {
  const ready = prs.filter((p:Permintaan) => p.status === "Anggaran Tersedia");
  const [formFor, setFormFor] = useState<string|null>(null);
  const [supplier, setSupplier] = useState("");
  const [nilai, setNilai] = useState(0);
  const [termins, setTermins] = useState<{tgl:string,persentase:number}[]>([{tgl:"",persentase:50}]);
  return (
    <div>
      {ready.length > 0 && <div className="mb-10"><h2 className="mb-4 text-lg font-semibold tracking-tight">Siap Dibuat Kontrak</h2><div className="space-y-4">{ready.map((pr:Permintaan) => (
        <div key={pr.id} className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="font-mono text-xs text-zinc-400">{pr.id}</p><p className="font-semibold text-zinc-800">{pr.unit}</p>
          <div className="my-2 space-y-0.5 text-sm text-zinc-600">{pr.items.map((i:PermintaanItem,idx:number)=><p key={idx}>{i.namaBarang} ×{i.jumlah}</p>)}</div>
          {formFor !== pr.id && <button onClick={() => { setFormFor(pr.id); setSupplier(""); setNilai(0); setTermins([{tgl:"",persentase:50}]); }} className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800">+ Buat Kontrak</button>}
          {formFor === pr.id && (
            <div className="mt-3 space-y-3 border-t border-zinc-100 pt-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className="mb-1 block text-xs text-zinc-500">Nama Supplier</label><input value={supplier} onChange={e=>setSupplier(e.target.value)} className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" placeholder="PT ..." /></div>
                <div><label className="mb-1 block text-xs text-zinc-500">Nilai Kontrak</label><input type="number" value={nilai||""} onChange={e=>setNilai(Number(e.target.value))} className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" placeholder="150000000" /></div>
              </div>
              <div><p className="mb-2 text-xs font-medium text-zinc-500">Termin Pembayaran</p>
                {termins.map((t,i) => <div key={i} className="mb-2 flex items-center gap-2 text-xs">
                  <input value={t.tgl} onChange={e=>{const c=[...termins]; c[i]={...c[i],tgl:e.target.value}; setTermins(c);}} placeholder="Tanggal" className="w-32 rounded-md border border-zinc-200 px-2 py-1.5 text-xs" />
                  <input type="number" value={t.persentase||""} onChange={e=>{const c=[...termins]; c[i]={...c[i],persentase:Number(e.target.value)}; setTermins(c);}} className="w-20 rounded-md border border-zinc-200 px-2 py-1.5 text-xs" placeholder="%" />
                  <span className="text-zinc-400">%</span>
                  <span className="text-zinc-500">= {fmt(Math.round(nilai*t.persentase/100))}</span>
                  {termins.length>1 && <button onClick={()=>setTermins(termins.filter((_,j)=>j!==i))} className="text-red-400 hover:text-red-600">✕</button>}
                </div>)}
                <button onClick={()=>setTermins([...termins,{tgl:"",persentase:0}])} className="text-xs font-medium text-blue-600 hover:underline">+ Tambah Termin</button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { if(supplier.trim()&&nilai>0) { buatKontrak(pr,supplier,nilai,termins); setFormFor(null); }}} className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800">Buat Kontrak</button>
                <button onClick={() => setFormFor(null)} className="rounded-lg border border-zinc-200 px-4 py-2 text-xs text-zinc-600 hover:bg-zinc-50">Batal</button>
              </div>
            </div>
          )}
        </div>
      ))}</div></div>}
      <h2 className="mb-4 text-lg font-semibold tracking-tight">Daftar Kontrak</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {kontraks.map((k:Kontrak) => <div key={k.id} className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 flex items-start justify-between"><div><p className="font-mono text-xs text-zinc-400">{k.noKontrak}</p><p className="font-medium text-zinc-800">{k.supplier}</p><span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${SC2[k.status]}`}>{k.status}</span></div><span className="text-sm font-semibold text-zinc-700">{fmt(k.nilai)}</span></div>
          <div><p className="mb-2 text-xs font-medium text-zinc-500">Termin</p>{k.termin.map((t:any) => <div key={t.id} className="mb-1.5 flex items-center justify-between text-xs"><span className="text-zinc-600">{t.tgl} — {t.persentase}%</span><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.status==="Dibayar"?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>{t.status==="Dibayar"?`✓ ${fmt(t.nominal)}`:fmt(t.nominal)}</span></div>)}</div>
        </div>)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PO & RECEIPT (UC4 + UC7 + UC8)
   ═══════════════════════════════════════════════ */
function POReceiptView({ kontraks, prs, kirimDraftPO, uploadBuktiPO, terimaBarang }: any) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold tracking-tight">Proses PO & Penerimaan Barang</h2>
      <div className="mb-8 space-y-4">
        {kontraks.map((k:Kontrak) => (
          <div key={k.id} className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="font-mono text-xs text-zinc-400">{k.noKontrak}</p>
                <p className="text-lg font-semibold text-zinc-800">{k.supplier}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${SC2[k.status]}`}>{k.status}</span>
              </div>
              <span className="text-sm font-semibold text-zinc-700">{fmt(k.nilai)}</span>
            </div>

            {/* Progress stepper */}
            <div className="mb-6 flex items-center gap-1">
              {["Draft PO","Kirim PO","Supplier Terima","Menunggu Barang","Barang Diterima"].map((step, i) => {
                const states: StatusKontrak[] = ["Menunggu PO","Draft PO Dikirim","PO Diterima Supplier","Menunggu Barang","Barang Diterima"];
                const currentIdx = states.indexOf(k.status);
                const active = i <= currentIdx;
                return <div key={step} className="flex items-center gap-1"><div className={`h-2 w-8 rounded-full ${active ? "bg-emerald-500" : "bg-zinc-200"}`} />{i < 4 && <div className={`h-px w-4 ${active && i < currentIdx ? "bg-emerald-500" : "bg-zinc-200"}`} />}</div>;
              })}
            </div>
            <p className="mb-4 text-xs text-zinc-400">Progress: Draft PO → Kirim → Supplier Terima → Kirim Barang → Diterima</p>

            {/* UC4: Kirim Draft PO */}
            {k.status === "Menunggu PO" && <button onClick={() => kirimDraftPO(k)} className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-medium text-white hover:bg-blue-700">📨 Kirim Draft PO ke Supplier</button>}

            {/* UC7: Upload Bukti PO */}
            {k.status === "Draft PO Dikirim" && !k.buktiPO && <div className="space-y-3"><p className="text-xs text-zinc-500">Upload bukti PO yang sudah ditandatangani supplier:</p><label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-zinc-300 p-4 text-sm text-zinc-500 hover:border-zinc-400"><span>📎 Klik untuk upload bukti PO (PDF/JPG, max 5MB)</span><input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={() => uploadBuktiPO(k)} /></label></div>}
            {k.buktiPO && k.status === "Draft PO Dikirim" && <p className="text-xs text-emerald-600">✓ Bukti PO sudah diupload. Menunggu supplier konfirmasi.</p>}

            {/* UC8: Terima Barang */}
            {k.status === "Menunggu Barang" && <button onClick={() => terimaBarang(k)} className="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-medium text-white hover:bg-emerald-700">📦 Konfirmasi Barang Diterima</button>}
            {k.status === "Barang Diterima" && <p className="text-xs text-emerald-600">✓ Barang sudah diterima. Tagihan bisa diinput oleh Keuangan.</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SUPPLIER PO (UC14)
   ═══════════════════════════════════════════════ */
function SupplierPOView({ kontraks, terimaDraftPO }: any) {
  const incoming = kontraks.filter((k:Kontrak) => k.status === "Draft PO Dikirim");
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold tracking-tight">Draft PO Masuk</h2>
      {incoming.length === 0 ? <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center"><p className="text-sm text-zinc-400">📭 Tidak ada Draft PO masuk</p></div> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {incoming.map((k:Kontrak) => (
            <div key={k.id} className="rounded-xl border border-blue-200 bg-blue-50/30 p-5">
              <p className="font-mono text-xs text-zinc-400">{k.noKontrak}</p>
              <p className="text-lg font-semibold text-zinc-800">{k.supplier}</p>
              <p className="mt-1 text-sm text-zinc-600">Nilai: <span className="font-semibold">{fmt(k.nilai)}</span></p>
              <div className="mt-3 space-y-1 text-xs text-zinc-500">{k.termin.map((t:any)=><p key={t.id}>Termin {t.id}: {t.persentase}% = {fmt(t.nominal)} — jatuh tempo {t.tgl}</p>)}</div>
              <button onClick={() => terimaDraftPO(k)} className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-medium text-white hover:bg-blue-700">✓ Terima & Proses PO</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SUPPLIER KIRIM (UC15)
   ═══════════════════════════════════════════════ */
function SupplierKirimView({ kontraks, tagihans, kirimBarang, kirimTagihan }: any) {
  const accepted = kontraks.filter((k:Kontrak) => k.status === "PO Diterima Supplier");
  const shipping = kontraks.filter((k:Kontrak) => k.status === "Menunggu Barang");
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold tracking-tight">Siap Dikirim</h2>
      {accepted.length === 0 && shipping.length === 0 ? <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center"><p className="text-sm text-zinc-400">📭 Tidak ada pesanan yang perlu dikirim</p></div> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {accepted.map((k:Kontrak) => (
            <div key={k.id} className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="font-mono text-xs text-zinc-400">{k.noKontrak}</p>
              <p className="font-medium text-zinc-800">{k.supplier}</p>
              <p className="text-sm text-zinc-600">Nilai: <span className="font-semibold">{fmt(k.nilai)}</span></p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => kirimBarang(k)} className="flex-1 rounded-lg bg-emerald-600 py-2 text-xs font-medium text-white hover:bg-emerald-700">🚚 Kirim Barang</button>
                <button onClick={() => kirimTagihan(k)} className="flex-1 rounded-lg border border-zinc-300 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50">🧾 Kirim Tagihan</button>
              </div>
            </div>
          ))}
          {shipping.map((k:Kontrak) => (
            <div key={k.id} className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5">
              <p className="font-mono text-xs text-zinc-400">{k.noKontrak}</p>
              <p className="font-medium text-zinc-800">{k.supplier}</p>
              <p className="mt-2 text-xs text-emerald-600">✓ Barang sudah dikirim, menunggu konfirmasi penerimaan</p>
              <button onClick={() => kirimTagihan(k)} className="mt-3 rounded-lg border border-zinc-300 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50">🧾 Kirim Tagihan</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAGIHAN (UC10 + UC11)
   ═══════════════════════════════════════════════ */
function TagihanView({ tagihans, kontraks, addTagihan }: any) {
  const [showForm, setShowForm] = useState(false);
  const [fkId, setFkId] = useState("");
  const [nom, setNom] = useState(0);
  const [berkasName, setBerkasName] = useState("");
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Daftar Tagihan</h2>
        {!showForm && <button onClick={() => { setShowForm(true); setFkId(kontraks[0]?.id||""); setNom(0); setBerkasName(""); }} className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800">+ Input Tagihan Baru</button>}
      </div>
      {showForm && (
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold">Input Tagihan Baru</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><label className="mb-1 block text-xs text-zinc-500">Pilih Kontrak</label><select value={fkId} onChange={e=>setFkId(e.target.value)} className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm">{kontraks.map((k:Kontrak)=><option key={k.id} value={k.id}>{k.noKontrak} — {k.supplier}</option>)}</select></div>
            <div><label className="mb-1 block text-xs text-zinc-500">Nominal Tagihan</label><input type="number" value={nom||""} onChange={e=>setNom(Number(e.target.value))} className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" placeholder="50000000" /></div>
            <div><label className="mb-1 block text-xs text-zinc-500">Upload Berkas</label><label className="flex cursor-pointer items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-500 hover:border-zinc-300"><span className="truncate">{berkasName || "📎 Pilih file..."}</span><input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={e=>{const f=e.target.files?.[0]; if(f) setBerkasName(f.name);}} /></label></div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => { if(fkId&&nom>0) { addTagihan(fkId,nom,berkasName||undefined); setShowForm(false); }}} className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800">Simpan Tagihan</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-zinc-200 px-4 py-2 text-xs text-zinc-600 hover:bg-zinc-50">Batal</button>
          </div>
        </div>
      )}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm"><thead><tr className="border-b border-zinc-100 bg-zinc-50/50">
          {["No Tagihan","Supplier","Kontrak","Tanggal","Nominal","Berkas"].map(h=><th key={h} className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-400">{h}</th>)}
        </tr></thead><tbody>
          {tagihans.map((t:any) => <tr key={t.id} className="border-b border-zinc-50 hover:bg-zinc-50/50">
            <td className="px-5 py-3 font-mono text-xs font-medium text-zinc-700">{t.noTagihan}</td>
            <td className="px-5 py-3 text-zinc-700">{t.supplier}</td>
            <td className="px-5 py-3 font-mono text-xs text-zinc-500">{t.kontrakId}</td>
            <td className="px-5 py-3 text-zinc-500">{t.tgl}</td>
            <td className="px-5 py-3 font-medium text-zinc-700">{fmt(t.nominal)}</td>
            <td className="px-5 py-3"><span className="text-xs text-zinc-400">{t.berkas ? `📎 ${t.berkasName||"invoice.pdf"}` : "❌ Belum upload"}</span></td>
          </tr>)}
        </tbody></table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PEMBAYARAN (UC12)
   ═══════════════════════════════════════════════ */
function PembayaranView({ kontraks, bayar }: any) {
  const unpaid = kontraks.flatMap((k:Kontrak) => k.termin.filter((t:any) => t.status==="Belum").map((t:any) => ({...t, kontrak:k})));
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold tracking-tight">Termin Menunggu Pembayaran</h2>
      {unpaid.length === 0 ? <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center"><p className="text-sm text-zinc-400">✨ Semua termin sudah dibayar</p></div> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {unpaid.map((item:any) => <div key={`${item.kontrak.id}-${item.id}`} className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="font-mono text-xs text-zinc-400">{item.kontrak.noKontrak}</p>
            <p className="font-medium text-zinc-800">{item.kontrak.supplier}</p>
            <div className="mt-2 space-y-1 text-sm text-zinc-600"><p>Termin ke-{item.id}: {item.persentase}%</p><p>Jatuh tempo: {item.tgl}</p><p className="text-lg font-semibold text-zinc-900">{fmt(item.nominal)}</p></div>
            <button onClick={() => bayar(item.kontrak, item.id)} className="mt-3 w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-medium text-white hover:bg-emerald-700">💰 Cairkan Dana</button>
          </div>)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LAPORAN (UC13)
   ═══════════════════════════════════════════════ */
function LaporanView({ prs, kontraks, tagihans }: any) {
  const totalKontrak = kontraks.reduce((s:number,k:Kontrak) => s+k.nilai, 0);
  const totalTagihan = tagihans.reduce((s:number,t:Tagihan) => s+t.nominal, 0);
  const dist = prs.reduce((a:any,p:Permintaan) => { a[p.status]=(a[p.status]||0)+1; return a; }, {});
  const downloadPDF = (pr:Permintaan) => {
    const relatedK = kontraks.filter((k:Kontrak) => true); // show all for prototype
    const relatedT = tagihans.filter((t:Tagihan) => true);
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Laporan ${pr.id}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;padding:40px;color:#1a1a1a;font-size:13px}h1{font-size:18px;margin-bottom:4px}h2{font-size:14px;margin:20px 0 8px;border-bottom:1px solid #ddd;padding-bottom:4px}.info{color:#555;margin-bottom:16px}.info span{margin-right:20px}table{width:100%;border-collapse:collapse;margin-bottom:16px}th,td{border:1px solid #ddd;padding:6px 10px;text-align:left;font-size:12px}th{background:#f5f5f5;font-weight:600}.footer{margin-top:40px;color:#888;font-size:11px;border-top:1px solid #eee;padding-top:8px}</style></head><body><h1>LAPORAN PENGAJUAN — ${pr.id}</h1><div class="info"><span>Unit: <b>${pr.unit}</b></span><span>Tanggal: <b>${pr.tgl}</b></span><span>Status: <b>${pr.status}</b></span></div><h2>Daftar Barang</h2><table><thead><tr><th>No</th><th>Nama Barang</th><th>Jumlah</th><th>Satuan</th></tr></thead><tbody>${pr.items.map((it,idx)=>`<tr><td>${idx+1}</td><td>${it.namaBarang}</td><td>${it.jumlah}</td><td>${it.satuan}</td></tr>`).join("")}</tbody></table>${relatedK.length>0?`<h2>Kontrak Terkait</h2><table><thead><tr><th>No Kontrak</th><th>Supplier</th><th>Nilai</th><th>Status</th></tr></thead><tbody>${relatedK.map((k:Kontrak)=>`<tr><td>${k.noKontrak}</td><td>${k.supplier}</td><td>${fmt(k.nilai)}</td><td>${k.status}</td></tr>`).join("")}</tbody></table>`:""}${relatedT.length>0?`<h2>Tagihan Terkait</h2><table><thead><tr><th>No Tagihan</th><th>Supplier</th><th>Nominal</th><th>Tanggal</th></tr></thead><tbody>${relatedT.map((t:Tagihan)=>`<tr><td>${t.noTagihan}</td><td>${t.supplier}</td><td>${fmt(t.nominal)}</td><td>${t.tgl}</td></tr>`).join("")}</tbody></table>`:""}<div class="footer">Generated: ${new Date().toLocaleString("id-ID")}</div></body></html>`;
    const w = window.open("","_blank");
    if(w) { w.document.write(html); w.document.close(); }
  };
  return (
    <div>
      <div className="mb-10 grid gap-6 sm:grid-cols-4">
        {[{l:"Total Permintaan",v:String(prs.length)},{l:"Kontrak",v:String(kontraks.length)},{l:"Nilai Kontrak",v:fmt(totalKontrak)},{l:"Total Tagihan",v:fmt(totalTagihan)}].map(s=>
          <div key={s.l} className="rounded-xl border border-zinc-200 bg-white px-5 py-5"><p className="text-xs text-zinc-400">{s.l}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{s.v}</p></div>
        )}
      </div>
      <h2 className="mb-4 text-lg font-semibold tracking-tight">Distribusi Status Permintaan</h2>
      <div className="mb-10 space-y-2">
        {Object.entries(dist).map(([status, count]:any) => <div key={status} className="flex items-center gap-3">
          <span className={`w-48 shrink-0 rounded-full px-2 py-0.5 text-center text-xs font-medium ${SC[status as StatusPermintaan]||"bg-zinc-100 text-zinc-600"}`}>{status}</span>
          <div className="h-2 flex-1 rounded-full bg-zinc-100"><div className="h-2 rounded-full bg-zinc-400" style={{width:`${(count/prs.length)*100}%`}} /></div>
          <span className="w-6 text-right text-xs text-zinc-500">{count}</span>
        </div>)}
      </div>
      <h2 className="mb-4 text-lg font-semibold tracking-tight">Detail Per Pengajuan</h2>
      <div className="space-y-3">
        {prs.map((pr:Permintaan) => <div key={pr.id} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4">
          <div>
            <p className="font-mono text-xs text-zinc-400">{pr.id} <span className="font-sans text-zinc-600">— {pr.unit} — {pr.tgl}</span></p>
            <p className="text-sm text-zinc-600">{pr.items.map(i=>i.namaBarang).join(", ")}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${SC[pr.status]}`}>{pr.status}</span>
            <button onClick={() => downloadPDF(pr)} className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800">Download PDF</button>
          </div>
        </div>)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════ */
function PRTable({ prs, onDetail }: any) {
  return (<div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
    <table className="w-full text-left text-sm"><thead><tr className="border-b border-zinc-100 bg-zinc-50/50">
      {["No","Unit","Tanggal","Item","Status",""].map(h=><th key={h} className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-400">{h}</th>)}
    </tr></thead><tbody>
      {prs.map((r:Permintaan) => <tr key={r.id} className="border-b border-zinc-50 hover:bg-zinc-50/50">
        <td className="px-5 py-3 font-mono text-xs text-zinc-500">{r.id}</td>
        <td className="px-5 py-3 font-medium text-zinc-700">{r.unit}</td>
        <td className="px-5 py-3 text-zinc-500">{r.tgl}</td>
        <td className="max-w-[180px] truncate px-5 py-3 text-zinc-600">{r.items.map(i=>i.namaBarang).join(", ")}</td>
        <td className="px-5 py-3"><span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${SC[r.status]}`}>{r.status}</span></td>
        <td className="px-5 py-3"><button onClick={() => onDetail(r)} className="text-xs font-medium text-zinc-400 hover:text-zinc-600">Detail</button></td>
      </tr>)}
    </tbody></table>
  </div>);
}

function DetailModal({ p, onClose, alasan, setAlasan, approve, reject, role }: { p: Permintaan; onClose: () => void; alasan: string; setAlasan: (v: string) => void; approve: (p: Permintaan) => void; reject: (p: Permintaan) => void; role: Role }) {
  return (<div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6">
    <div className="mb-3 flex items-start justify-between">
      <div><p className="font-mono text-xs text-zinc-400">{p.id}</p><p className="text-lg font-semibold">{p.unit} — {p.tgl}</p><span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${SC[p.status]}`}>{p.status}</span></div>
      <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">✕</button>
    </div>
    <div className="mb-4 space-y-1 text-sm">{p.items.map((i:PermintaanItem,idx:number)=><p key={idx} className="text-zinc-600">{idx+1}. {i.namaBarang} — {i.jumlah} {i.satuan}</p>)}</div>
    {p.status === "Ditolak" && p.alasanTolak && <p className="text-sm text-red-600">⚠ Ditolak: {p.alasanTolak}</p>}
  </div>);
}

function AddItem({ onAdd }: { onAdd: (i: PermintaanItem) => void }) {
  const [n, setN] = useState(""); const [j, setJ] = useState(1); const [s, setS] = useState("unit");
  return (<div className="flex gap-2">
    <input value={n} onChange={e => setN(e.target.value)} placeholder="Nama barang" className="flex-1 rounded-md border border-zinc-200 px-3 py-1.5 text-xs" onKeyDown={e => e.key==="Enter" && n.trim() && (onAdd({id:Date.now(),namaBarang:n,jumlah:j,satuan:s}),setN(""),setJ(1))} />
    <input type="number" value={j} onChange={e => setJ(Number(e.target.value))} className="w-16 rounded-md border border-zinc-200 px-2 py-1.5 text-xs" min={1} />
    <select value={s} onChange={e => setS(e.target.value)} className="w-20 rounded-md border border-zinc-200 px-2 py-1.5 text-xs"><option>unit</option><option>pcs</option><option>rim</option><option>set</option><option>paket</option></select>
    <button onClick={() => n.trim() && (onAdd({id:Date.now(),namaBarang:n,jumlah:j,satuan:s}),setN(""),setJ(1))} className="rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200">+ Tambah</button>
  </div>);
}
