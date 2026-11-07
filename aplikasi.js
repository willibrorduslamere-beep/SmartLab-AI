// Komponen utama Aplikasi: peran pengguna, data (jadwal, materi, laporan), navigasi, dan render
const halamanUntuk = (peran, k) => ({ dash: Beranda, jadwal: JadwalSaya, book: Pemesanan, materi: peran === "Mahasiswa" ? MateriMahasiswa : KelolaMateri, inv: Inventaris, ai: AsistenAI, dmg: Kerusakan })[k];
function Aplikasi() {
  const [data0] = useState(() => muatData() || (() => {
    const d = buatDataContoh();
    simpanBerkasContoh();
    return d;
  })());
  const [peranAktif, aturPeranAktif] = useState(null);
  const [pembuka, aturPembuka] = useState("tampil");
  useEffect(() => {
    const a = setTimeout(() => aturPembuka("keluar"), 2600), b = setTimeout(() => aturPembuka("selesai"), 3e3);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  const [menuAktif, aturMenuAktif] = useState("dash");
  const [praPilih, aturPraPilih] = useState("");
  const [filterMateri, aturFilterMateri] = useState("");
  const [notifikasi, aturNotifikasi] = useState("");
  const [sekarang, aturSekarang] = useState(/* @__PURE__ */ new Date());
  const [jadwal, aturJadwal] = useState(data0.jadwal);
  const [materi, aturMateri] = useState(data0.materi);
  const [laporanRusak, aturLaporanRusak] = useState(data0.laporan);
  const [dibuka, aturDibuka] = useState(data0.dibuka);
  useEffect(() => {
    simpanData({ jadwal, materi, laporan: laporanRusak, dibuka });
  }, [jadwal, materi, laporanRusak, dibuka]);
  const sapaAwal = [{ r: "a", text: "Halo! Saya Asisten AI Lab. Tanyakan cara mengoperasikan alat, aturan keselamatan, atau kalibrasi." }];
  const [percakapan, aturPercakapan] = useState(sapaAwal);
  useEffect(() => {
    const t = setInterval(() => aturSekarang(/* @__PURE__ */ new Date()), 3e4);
    return () => clearInterval(t);
  }, []);
  const tampilkanNotifikasi = (m) => {
    aturNotifikasi(m);
    setTimeout(() => aturNotifikasi(""), 3200);
  };
  const kirimPesan = (text, file) => {
    aturMenuAktif("ai");
    let reply;
    if (file) {
      const n = file.name.toLowerCase();
      const cocok = ALAT.find((e) => e.keys.some((k) => n.includes(k))) || ALAT[0];
      reply = `Dari foto, alat ini terlihat seperti ${cocok.name} (kecocokan ${Math.round(93 + Math.random() * 6)}%). Tanyakan "cara mengoperasikan" untuk panduannya.`;
    } else {
      const low = text.toLowerCase();
      if (/jadwal|materi|pinjam|pesan lab|booking/.test(low)) reply = peranAktif === "Mahasiswa" ? "Jadwal praktikum diatur oleh asisten dosen dan dosen. Lihat menu Jadwal Saya untuk jam dan lab, serta menu Materi untuk materi yang perlu dipelajari sebelum masuk lab." : "Buka menu Pemesanan Cerdas untuk mengatur jadwal lab, dan menu Kirim Materi untuk membagikan materi ke mahasiswa.";
      else {
        const cocok = BASIS_JAWABAN.find(([ks]) => ks.some((k) => low.includes(k)));
        reply = cocok ? cocok[1] : "Saya bisa membantu soal osiloskop, jangka sorong, mikrometer, pH meter, lemari asam, jadwal, dan materi. Coba salah satu pertanyaan cepat di sebelah kiri.";
      }
    }
    aturPercakapan((m) => [...m, { r: "u", text }, { r: "a", typing: true, text: "" }]);
    setTimeout(() => aturPercakapan((m) => [...m.filter((x) => !x.typing), { r: "a", text: reply }]), 900);
  };
  const c = {
    peran: peranAktif,
    jadwal,
    materi,
    laporanRusak,
    dibuka,
    percakapan,
    sekarang,
    praPilih,
    filterMateri,
    kirimPesan,
    tampilkanNotifikasi,
    buka: (k) => {
      aturFilterMateri("");
      aturMenuAktif(k);
    },
    bukaPemesanan: (id) => {
      aturPraPilih(id || "");
      aturMenuAktif("book");
    },
    bukaMateri: (id) => {
      aturFilterMateri(id);
      aturMenuAktif("materi");
    },
    simpanJadwal: (j) => {
      aturJadwal((p) => [...p, { ...j, id: "j" + Date.now(), oleh: peranAktif }]);
      tampilkanNotifikasi("Jadwal tersimpan dan disinkronkan ke Google Kalender. Mahasiswa dapat melihatnya di menu Jadwal Saya.");
    },
    hapusJadwal: (id) => {
      aturJadwal((p) => p.filter((j) => j.id !== id));
      aturMateri((p) => p.map((m) => m.jadwalId === id ? { ...m, jadwalId: null } : m));
      tampilkanNotifikasi("Jadwal dihapus.");
    },
    sinkronSemua: () => {
      const n = jadwal.filter((j) => j.oleh === peranAktif).length;
      tampilkanNotifikasi(n ? `${n} jadwal Anda disinkronkan ke Google Kalender` : "Belum ada jadwal untuk disinkronkan");
    },
    kirimMateri: (m) => {
      aturMateri((p) => [m, ...p]);
      tampilkanNotifikasi("Materi terkirim ke mahasiswa.");
    },
    hapusMateri: (m) => {
      m.berkas.forEach((b) => BerkasDB.hapus(b.id));
      aturMateri((p) => p.filter((x) => x.id !== m.id));
      tampilkanNotifikasi("Materi dihapus.");
    },
    tandaiDibuka: (id) => aturDibuka((p) => p.includes(id) ? p : [...p, id]),
    tambahLaporan: (r) => aturLaporanRusak((p) => [{ ...r, id: Date.now(), status: "Dalam Peninjauan", oleh: peranAktif }, ...p]),
    majukanStatus: (id) => aturLaporanRusak((p) => p.map((x) => x.id === id ? { ...x, status: x.status === "Dalam Peninjauan" ? "Dalam Perbaikan" : "Selesai" } : x)),
    aturUlangData: () => {
      if (!window.confirm("Atur ulang semua data ke contoh awal? Jadwal, materi, dan laporan yang Anda buat akan dihapus.")) return;
      materi.forEach((m) => m.berkas.forEach((b) => BerkasDB.hapus(b.id)));
      const d = buatDataContoh();
      simpanBerkasContoh();
      aturJadwal(d.jadwal);
      aturMateri(d.materi);
      aturLaporanRusak(d.laporan);
      aturDibuka(d.dibuka);
      tampilkanNotifikasi("Data contoh sudah diatur ulang.");
    }
  };
  const S = peranAktif && halamanUntuk(peranAktif, menuAktif);
  return React.createElement(React.Fragment, null, pembuka !== "selesai" && React.createElement(HalamanPembuka, { keluar: pembuka === "keluar" }), !peranAktif ? React.createElement("div", { className: "min-h-screen" }, React.createElement(HalamanMasuk, { onLogin: (p) => {
    aturPeranAktif(p);
    aturMenuAktif("dash");
    aturFilterMateri("");
  } })) : React.createElement(Kerangka, { menuAktif, peran: peranAktif, nav: (k) => k === "book" ? c.bukaPemesanan(praPilih) : c.buka(k), onLogout: () => aturPeranAktif(null) }, React.createElement(S, { key: menuAktif, c })), notifikasi && React.createElement("div", { role: "status", className: "fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white text-sm rounded-lg px-4 py-2 shadow-lg max-w-[90vw] text-center" }, notifikasi));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Aplikasi, null));
