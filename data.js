// Data alat/ruang dan fungsi bantu tanggal
const nol = (n) => String(n).padStart(2, "0");
const isoTanggal = (d) => `${d.getFullYear()}-${nol(d.getMonth() + 1)}-${nol(d.getDate())}`;
const urai = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const tambahHari = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const hariSenin = (d) => tambahHari(d, -((d.getDay() + 6) % 7));
const formatTanggal = (d) => d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
const waktuSlot = (date, h) => {
  const d = urai(date);
  d.setHours(h, 0, 0, 0);
  return d;
};
const hariIni = /* @__PURE__ */ new Date();
const JAM = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const RUANGAN = [["r1", "Lab Fisika & Tambang 1"], ["r2", "Lab Fisika & Tambang 2"], ["r3", "Lab Kimia Dasar"], ["r4", "Lab Geologi"]].map(([id, name]) => ({ id, name }));
const ALAT = [
  { id: "e1", name: "Osiloskop Digital DS1054Z", st: "Tersedia", spesifikasi: "100 MHz, 4 kanal, 1 GS/s", keys: ["osiloskop", "oscilloscope"] },
  { id: "e2", name: "Jangka Sorong Digital 150 mm", st: "Tersedia", spesifikasi: "0–150 mm, resolusi 0,01 mm", keys: ["jangka", "caliper"] },
  { id: "e3", name: "Spektrofotometer UV-Vis", st: "Sedang Digunakan", spesifikasi: "190–1100 nm", keys: ["spektro"] },
  { id: "e4", name: "Mikrometer Sekrup 0–25 mm", st: "Tersedia", spesifikasi: "Resolusi 0,001 mm", keys: ["mikrometer", "micrometer"] },
  { id: "e5", name: "pH Meter Benchtop", st: "Pemeliharaan", spesifikasi: "0–14 pH, akurasi ±0,01", keys: ["ph"] },
  { id: "e6", name: "Set Ayakan Batuan ASTM", st: "Tersedia", spesifikasi: "8 ukuran mesh", keys: ["ayakan", "sieve"] },
  { id: "e7", name: "Lemari Asam (Fume Hood)", st: "Sedang Digunakan", spesifikasi: "Lebar 1,2 m, 0,5 m/s", keys: ["asam", "hood"] },
  { id: "e8", name: "Timbangan Analitik 220 g", st: "Tersedia", spesifikasi: "Ketelitian 0,1 mg", keys: ["timbang", "balance"] }
];
const SUMBER = [...RUANGAN, ...ALAT];
const namaSumber = (id) => SUMBER.find((r) => r.id === id).name;
const kelasStatus = { "Tersedia": "bg-green-100 text-green-700", "Sedang Digunakan": "bg-orange-100 text-orange-700", "Pemeliharaan": "bg-gray-200 text-gray-700" };
const MENU_MAHASISWA = [["dash", "Beranda", IkonRumah], ["jadwal", "Jadwal Saya", IkonKalender], ["materi", "Materi", IkonBuku], ["inv", "Inventaris Langsung", IkonPindai], ["ai", "Asisten AI Lab", IkonRobot], ["dmg", "Lapor Kerusakan", IkonDokumen]];
const MENU_STAF = [["dash", "Beranda", IkonRumah], ["book", "Pemesanan Cerdas", IkonKalender], ["materi", "Kirim Materi", IkonKirim], ["inv", "Inventaris Langsung", IkonPindai], ["ai", "Asisten AI Lab", IkonRobot], ["dmg", "Lapor Kerusakan", IkonDokumen]];
const menuUntuk = (peran) => peran === "Mahasiswa" ? MENU_MAHASISWA : MENU_STAF;
