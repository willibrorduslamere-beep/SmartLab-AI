// Halaman Materi: asisten dosen/dosen mengirim materi, mahasiswa membuka dan mengunduhnya
const BERKAS_MAKS = 50 * 1024 * 1024;
const tglWaktu = (iso) => new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const labelJadwal = (j) => `${j.kegiatan} — ${formatTanggal(urai(j.date))}, ${nol(j.start)}.00`;
function DaftarBerkas({ berkas, c, saatBuka }) {
  const aksi = async (b, buka) => {
    if (saatBuka) saatBuka();
    const ok = buka ? await bukaBerkas(b) : await unduhBerkas(b);
    if (!ok) c.tampilkanNotifikasi("Berkas tidak ditemukan di perangkat ini. Minta pengajar mengirim ulang.");
  };
  return React.createElement("ul", { className: "mt-3 space-y-2" }, berkas.map((b) => React.createElement("li", { key: b.id, className: "flex items-center gap-3 rounded-lg border border-slate-200 p-2.5" }, React.createElement("div", { className: "w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0" }, React.createElement(IkonDokumen, { className: "w-5 h-5" })), React.createElement("div", { className: "flex-1 min-w-0" }, React.createElement("div", { className: "text-sm font-medium truncate" }, b.nama), React.createElement("div", { className: "text-xs text-slate-500" }, b.tipe, " · ", ukuranTeks(b.ukuran))), (b.tipe === "PDF" || b.tipe === "Gambar") && React.createElement(Tombol, { variant: "outline", className: "!px-3 !py-1.5", onClick: () => aksi(b, true) }, "Buka"), React.createElement(Tombol, { className: "!px-3 !py-1.5", onClick: () => aksi(b, false) }, React.createElement(IkonUnduh, { className: "w-4 h-4" }), "Unduh"))));
}
function KelolaMateri({ c }) {
  const [judul, aturJudul] = useState("");
  const [jadwalId, aturJadwalId] = useState("");
  const [keterangan, aturKeterangan] = useState("");
  const [berkas, aturBerkas] = useState([]);
  const [galat, aturGalat] = useState("");
  const [mengirim, aturMengirim] = useState(false);
  const [kunci, aturKunci] = useState(0);
  const urut = [...c.jadwal].sort((a, b) => waktuSlot(a.date, a.start) - waktuSlot(b.date, b.start));
  const dikirim = [...c.materi].sort((a, b) => b.kirim.localeCompare(a.kirim));
  const pilihBerkas = (e) => {
    const baru = [...e.target.files];
    e.target.value = "";
    const besar = baru.find((f) => f.size > BERKAS_MAKS);
    if (besar) return aturGalat(`"${besar.name}" lebih dari 50 MB.`);
    aturGalat("");
    aturBerkas((p) => [...p, ...baru]);
  };
  const kirim = async () => {
    aturGalat("");
    if (!judul.trim()) return aturGalat("Isi judul materi.");
    if (!berkas.length) return aturGalat("Pilih minimal satu berkas materi.");
    aturMengirim(true);
    const cap = Date.now();
    const daftar = [];
    for (let i = 0; i < berkas.length; i++) {
      const f = berkas[i];
      const id = `b${cap}-${i}`;
      await BerkasDB.simpan(id, f);
      daftar.push({ id, nama: f.name, tipe: labelTipe(f.name), ukuran: f.size });
    }
    c.kirimMateri({ id: `m${cap}`, judul: judul.trim(), jadwalId: jadwalId || null, keterangan: keterangan.trim(), oleh: c.peran, kirim: (/* @__PURE__ */ new Date()).toISOString(), berkas: daftar });
    aturJudul("");
    aturJadwalId("");
    aturKeterangan("");
    aturBerkas([]);
    aturKunci((k) => k + 1);
    aturMengirim(false);
  };
  return React.createElement("div", null, React.createElement(Judul, { sub: "Bagikan materi praktikum ke mahasiswa beberapa hari sebelum masuk lab" }, "Kirim Materi"), React.createElement("div", { className: "grid lg:grid-cols-5 gap-4" }, React.createElement(Kartu, { className: "lg:col-span-2 p-4 self-start" }, React.createElement("h2", { className: "font-semibold mb-3" }, "Materi Baru"), React.createElement(Bidang, { label: "Judul materi *" }, React.createElement("input", { className: kelasInput, value: judul, onChange: (e) => aturJudul(e.target.value), placeholder: "Contoh: Panduan Praktikum Osiloskop" })), React.createElement(Bidang, { label: "Untuk jadwal praktikum" }, React.createElement("select", { className: kelasInput, value: jadwalId, onChange: (e) => aturJadwalId(e.target.value) }, React.createElement("option", { value: "" }, "Umum (tidak terkait jadwal)"), urut.map((j) => React.createElement("option", { key: j.id, value: j.id }, labelJadwal(j))))), React.createElement(Bidang, { label: "Berkas materi * (PowerPoint, PDF, Word, atau lainnya)" }, React.createElement("input", { key: kunci, type: "file", multiple: true, onChange: pilihBerkas, className: "block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white" })), berkas.length > 0 && React.createElement("ul", { className: "-mt-1 mb-3 space-y-1" }, berkas.map((f, i) => React.createElement("li", { key: i, className: "flex items-center gap-2 text-sm" }, React.createElement("span", { className: "flex-1 truncate" }, f.name, " ", React.createElement("span", { className: "text-xs text-slate-500" }, "(", ukuranTeks(f.size), ")")), React.createElement("button", { type: "button", "aria-label": `Buang ${f.name}`, onClick: () => aturBerkas((p) => p.filter((_, k) => k !== i)), className: "text-xs text-slate-500 hover:text-red-600" }, "Buang")))), React.createElement(Bidang, { label: "Keterangan untuk mahasiswa" }, React.createElement("textarea", { rows: 4, className: kelasInput, value: keterangan, onChange: (e) => aturKeterangan(e.target.value), placeholder: "Contoh: Baca bab 1–2 sebelum praktikum. Bawa kalkulator." })), galat && React.createElement("p", { className: "text-sm text-red-600 mb-3", role: "alert" }, galat), React.createElement(Tombol, { className: "w-full", onClick: kirim, disabled: mengirim }, React.createElement(IkonKirim, { className: "w-4 h-4" }), mengirim ? "Mengirim…" : "Kirim Materi ke Mahasiswa")), React.createElement("div", { className: "lg:col-span-3 space-y-3" }, React.createElement("h2", { className: "font-semibold" }, "Materi yang Sudah Dikirim"), dikirim.length ? dikirim.map((m) => {
    const j = c.jadwal.find((x) => x.id === m.jadwalId);
    return React.createElement(Kartu, { key: m.id, className: "p-4" }, React.createElement("div", { className: "flex items-start gap-3" }, React.createElement("div", { className: "flex-1 min-w-0" }, React.createElement("div", { className: "font-semibold" }, m.judul), React.createElement("div", { className: "text-xs text-slate-500" }, "Dikirim ", m.oleh, " · ", tglWaktu(m.kirim)), j && React.createElement("div", { className: "mt-1 text-sm text-slate-600" }, "Untuk: ", labelJadwal(j), " · ", namaSumber(j.res))), m.oleh === c.peran && React.createElement("button", { "aria-label": `Hapus materi ${m.judul}`, onClick: () => c.hapusMateri(m), className: "p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50" }, React.createElement(IkonSampah, { className: "w-4 h-4" }))), m.keterangan && React.createElement("p", { className: "mt-2 text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 whitespace-pre-line" }, m.keterangan), React.createElement(DaftarBerkas, { berkas: m.berkas, c }));
  }) : React.createElement(Kartu, { className: "p-6 text-sm text-slate-600" }, "Belum ada materi yang dikirim."))));
}
function MateriMahasiswa({ c }) {
  const [q, aturQ] = useState("");
  const [saring, aturSaring] = useState("semua");
  const [jadwalId, aturJadwalId] = useState(c.filterMateri || "");
  const j0 = jadwalId && c.jadwal.find((x) => x.id === jadwalId);
  const daftar = [...c.materi].sort((a, b) => b.kirim.localeCompare(a.kirim)).filter((m) => (!jadwalId || m.jadwalId === jadwalId) && (saring === "semua" || !c.dibuka.includes(m.id)) && (m.judul + " " + m.keterangan).toLowerCase().includes(q.toLowerCase()));
  return React.createElement("div", null, React.createElement(Judul, { sub: "Materi dari asisten dosen dan dosen. Pelajari sebelum masuk lab." }, "Materi Praktikum"), React.createElement("div", { className: "flex flex-col md:flex-row gap-2 mb-3" }, React.createElement("div", { className: "relative flex-1" }, React.createElement(IkonCari, { className: "w-4 h-4 absolute left-3 top-2.5 text-slate-500" }), React.createElement("input", { className: kelasInput + " pl-9", placeholder: "Cari materi", value: q, onChange: (e) => aturQ(e.target.value) })), React.createElement("div", { className: "flex gap-1" }, [["semua", "Semua"], ["baru", "Belum dibuka"]].map(([k, l]) => React.createElement("button", { key: k, onClick: () => aturSaring(k), className: `whitespace-nowrap px-3 py-2 rounded-lg text-sm border ${saring === k ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200"}` }, l)))), j0 && React.createElement("div", { className: "mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-800" }, "Jadwal: ", j0.kegiatan, React.createElement("button", { "aria-label": "Hapus saringan jadwal", onClick: () => aturJadwalId(""), className: "font-bold" }, "×")), React.createElement("div", { className: "space-y-3" }, daftar.length ? daftar.map((m) => {
    const j = c.jadwal.find((x) => x.id === m.jadwalId);
    const baru = !c.dibuka.includes(m.id);
    const s = j && statusPinjam(j, c.sekarang);
    return React.createElement(Kartu, { key: m.id, className: "p-4" }, React.createElement("div", { className: "flex items-start gap-2 flex-wrap" }, React.createElement("h2", { className: "font-semibold" }, m.judul), baru && React.createElement("span", { className: "text-xs font-semibold bg-blue-600 text-white rounded-full px-2 py-0.5" }, "Baru")), React.createElement("div", { className: "text-xs text-slate-500" }, "Dari ", m.oleh, " · ", tglWaktu(m.kirim)), j && React.createElement("div", { className: "mt-2 text-sm text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1" }, "Untuk: ", labelJadwal(j), " · ", namaSumber(j.res), React.createElement(Lencana, { c: s.c }, s.t)), m.keterangan && React.createElement("p", { className: "mt-3 text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 whitespace-pre-line" }, m.keterangan), React.createElement(DaftarBerkas, { berkas: m.berkas, c, saatBuka: () => c.tandaiDibuka(m.id) }));
  }) : React.createElement(Kartu, { className: "p-6 text-sm text-slate-600" }, c.materi.length ? "Tidak ada materi yang cocok dengan saringan ini." : "Belum ada materi. Materi akan muncul di sini setelah asisten dosen atau dosen mengirimnya.")));
}
