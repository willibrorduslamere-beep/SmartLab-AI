// Halaman Asisten AI Lab
const TANYA_CEPAT = ["Bagaimana cara mengoperasikan Osiloskop Digital?", "Aturan keselamatan untuk Lemari Asam", "Cara kalibrasi pH Meter"];
const BASIS_JAWABAN = [
  [["osiloskop", "oscilloscope"], "Langkah 1: Hubungkan probe ke kanal input dan jepit klip ground ke titik referensi. Langkah 2: Tekan Auto Set. Langkah 3: Atur Volts/Div dan Time/Div sampai gelombang stabil. Langkah 4: Kompensasi probe dengan sinyal gelombang kotak bawaan bila bentuknya miring."],
  [["asam", "fume", "hood"], "Aturan keselamatan Lemari Asam: jaga kaca depan pada tinggi kerja yang ditandai, bekerja minimal 15 cm di dalam lemari, jangan menutup penyekat belakang, pakai kacamata, sarung tangan, dan jas lab, serta pastikan indikator aliran udara menyala."],
  [["ph meter", "kalibrasi"], "Kalibrasi pH Meter: bilas elektroda, lalu kalibrasi berurutan dengan larutan buffer pH 7,00, pH 4,00, dan pH 10,00. Bilas di antara larutan buffer, pastikan kemiringan (slope) 95–105%, dan simpan elektroda dalam larutan penyimpanan."],
  [["jangka", "caliper"], "Jangka Sorong Digital: bersihkan rahang dan tekan NOL saat tertutup, jepit benda dengan lembut, baca layar, lalu ulangi tiga kali dan rata-ratakan."],
  [["mikrometer"], "Mikrometer sekrup: putar pemutar gigi (ratchet) sampai berbunyi klik, baca skala selubung lalu tambahkan skala bidal. Cek kesalahan nol sebelum mengukur."],
  [["pinjam", "pesan", "booking"], "Buka menu Pemesanan Cerdas, pilih slot kosong (maksimal 2 jam), isi keperluan, lalu konfirmasi untuk menyinkronkan ke Google Kalender."]
];
function AsistenAI({ c }) {
  const [t, setT] = useState("");
  const end = useRef();
  const fr = useRef();
  useEffect(() => {
    end.current && end.current.scrollIntoView({ block: "nearest" });
  }, [c.percakapan]);
  const kirimDariInput = (v) => {
    const x = (v ?? t).trim();
    if (!x) return;
    c.kirimPesan(x);
    setT("");
  };
  return React.createElement("div", null, React.createElement(Judul, null, "Asisten AI Lab"), React.createElement("div", { className: "grid lg:grid-cols-4 gap-4" }, React.createElement(Kartu, { className: "p-4 self-start" }, React.createElement("h2", { className: "font-semibold mb-3" }, "Pertanyaan Cepat"), React.createElement("div", { className: "space-y-2" }, TANYA_CEPAT.map((q) => React.createElement("button", { key: q, onClick: () => kirimDariInput(q), className: "w-full text-left text-sm border border-blue-600 text-blue-700 rounded-lg px-3 py-2 hover:bg-blue-50" }, q)))), React.createElement(Kartu, { className: "lg:col-span-3 flex flex-col h-[540px] max-h-[75vh]" }, React.createElement("div", { className: "flex-1 overflow-y-auto p-4 space-y-3" }, c.percakapan.map((m, i) => m.r === "u" ? React.createElement("div", { key: i, className: "flex justify-end" }, React.createElement("div", { className: "max-w-[80%] bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm" }, m.text)) : React.createElement("div", { key: i, className: "flex items-start gap-2" }, React.createElement("div", { className: "w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0" }, "S"), React.createElement("div", { className: "max-w-[85%] bg-blue-600 text-white rounded-xl px-4 py-2 text-sm" }, m.typing ? "Sedang mengetik…" : m.text))), React.createElement("div", { ref: end })), React.createElement("div", { className: "p-3 border-t border-slate-200 flex items-center gap-2" }, React.createElement("input", { ref: fr, type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
    if (e.target.files[0]) {
      c.kirimPesan(`[Foto] ${e.target.files[0].name}`, e.target.files[0]);
      e.target.value = "";
    }
  } }), React.createElement("input", { className: kelasInput, placeholder: "Ketik pesan…", value: t, onChange: (e) => setT(e.target.value), onKeyDown: (e) => e.key === "Enter" && kirimDariInput() }), React.createElement("button", { onClick: () => fr.current.click(), "aria-label": "Lampirkan foto", className: "p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" }, React.createElement(IkonKlip, { className: "w-4 h-4" })), React.createElement("button", { onClick: () => kirimDariInput(), "aria-label": "Kirim", className: "w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700" }, React.createElement(IkonKirim, { className: "w-4 h-4" }))))));
}
