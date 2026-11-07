// Komponen utama Aplikasi: state, navigasi, dan render
const HALAMAN = { dash: Beranda, book: Pemesanan, inv: Inventaris, ai: AsistenAI, dmg: Kerusakan };
function Aplikasi() {
  const [sudahMasuk, aturSudahMasuk] = useState(false);
  const [menuAktif, aturMenuAktif] = useState("dash");
  const [praPilih, aturPraPilih] = useState("");
  const [notifikasi, aturNotifikasi] = useState("");
  const [sekarang, aturSekarang] = useState(/* @__PURE__ */ new Date());
  const [daftarPesanan, aturDaftarPesanan] = useState(() => {
    const d = (n) => isoTanggal(tambahHari(hariIni, n));
    return [
      { id: 1, res: "e1", date: d(1), start: 9, dur: 2, milik: true, keperluan: "Praktikum pengukuran sinyal" },
      { id: 2, res: "r1", date: d(1), start: 13, dur: 2, milik: false },
      { id: 3, res: "r1", date: d(2), start: 10, dur: 1, milik: false },
      { id: 4, res: "r1", date: d(2), start: 14, dur: 2, milik: false },
      { id: 5, res: "r1", date: d(3), start: 8, dur: 2, milik: false },
      { id: 6, res: "e1", date: d(2), start: 8, dur: 1, milik: false }
    ];
  });
  const [laporanRusak, aturLaporanRusak] = useState([{ id: 1, eq: "e5", sev: "Parah", deskripsi: "Elektroda tidak stabil", status: "Dalam Perbaikan", milik: false }, { id: 2, eq: "e3", sev: "Ringan", deskripsi: "Dudukan kuvet longgar", status: "Dalam Peninjauan", milik: false }]);
  const sapaAwal = [{ r: "a", text: "Halo! Saya Asisten AI Lab. Tanyakan cara mengoperasikan alat, aturan keselamatan, atau kalibrasi." }];
  const [percakapan, aturPercakapan] = useState(sapaAwal);
  useEffect(() => {
    const t = setInterval(() => aturSekarang(/* @__PURE__ */ new Date()), 3e4);
    return () => clearInterval(t);
  }, []);
  const tampilkanNotifikasi = (m) => {
    aturNotifikasi(m);
    setTimeout(() => aturNotifikasi(""), 2800);
  };
  const kirimPesan = (text, file) => {
    aturMenuAktif("ai");
    aturSudahMasuk(true);
    let reply;
    if (file) {
      const n = file.name.toLowerCase();
      const cocok = ALAT.find((e) => e.keys.some((k) => n.includes(k))) || ALAT[0];
      reply = `Dari foto, alat ini terlihat seperti ${cocok.name} (kecocokan ${Math.round(93 + Math.random() * 6)}%). Tanyakan "cara mengoperasikan" untuk panduannya.`;
    } else {
      const low = text.toLowerCase();
      const cocok = BASIS_JAWABAN.find(([ks]) => ks.some((k) => low.includes(k)));
      reply = cocok ? cocok[1] : "Saya bisa membantu soal osiloskop, jangka sorong, mikrometer, pH meter, lemari asam, dan cara meminjam alat. Coba salah satu pertanyaan cepat di sebelah kiri.";
    }
    aturPercakapan((m) => [...m, { r: "u", text }, { r: "a", typing: true, text: "" }]);
    setTimeout(() => aturPercakapan((m) => [...m.filter((x) => !x.typing), { r: "a", text: reply }]), 900);
  };
  const c = {
    daftarPesanan,
    laporanRusak,
    percakapan,
    sekarang,
    praPilih,
    kirimPesan,
    buka: aturMenuAktif,
    bukaPemesanan: (id) => {
      aturPraPilih(id || "");
      aturMenuAktif("book");
    },
    simpanPemesanan: (b) => {
      aturDaftarPesanan((p) => [...p, { ...b, id: Date.now(), milik: true }]);
      tampilkanNotifikasi("Peminjaman dikonfirmasi dan disinkronkan ke Google Kalender");
    },
    sinkronSemua: () => {
      const n = daftarPesanan.filter((b) => b.milik).length;
      tampilkanNotifikasi(n ? `${n} peminjaman Anda disinkronkan ke Google Kalender` : "Belum ada peminjaman untuk disinkronkan");
    },
    tambahLaporan: (r) => aturLaporanRusak((p) => [{ ...r, id: Date.now(), status: "Dalam Peninjauan", milik: true }, ...p]),
    majukanStatus: (id) => aturLaporanRusak((p) => p.map((x) => x.id === id ? { ...x, status: x.status === "Dalam Peninjauan" ? "Dalam Perbaikan" : "Selesai" } : x))
  };
  const S = HALAMAN[menuAktif];
  return React.createElement(React.Fragment, null, !sudahMasuk ? React.createElement("div", { className: "min-h-screen" }, React.createElement(HalamanMasuk, { onLogin: () => {
    aturSudahMasuk(true);
    aturMenuAktif("dash");
  } })) : React.createElement(Kerangka, { menuAktif, nav: (k) => k === "book" ? c.bukaPemesanan(praPilih) : aturMenuAktif(k), onLogout: () => aturSudahMasuk(false) }, React.createElement(S, { key: menuAktif, c })), notifikasi && React.createElement("div", { role: "status", className: "fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white text-sm rounded-lg px-4 py-2 shadow-lg max-w-[90vw] text-center" }, notifikasi));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Aplikasi, null));
