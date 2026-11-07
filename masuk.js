// Halaman login mahasiswa
function HalamanMasuk({ onLogin, onOverview }) {
  const [peran, aturPeran] = useState("Mahasiswa");
  const [nim, setNim] = useState("");
  const [tglLahir, aturTglLahir] = useState("");
  const [galat, aturGalat] = useState("");
  const dref = useRef();
  const fmtDob = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    return d.length > 4 ? `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}` : d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };
  const kirimForm = (e) => {
    e.preventDefault();
    if (!/^\d{6,15}$/.test(nim.trim())) return aturGalat("NIM harus berupa angka (6–15 digit).");
    const m = tglLahir.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    const dt = m && new Date(+m[3], +m[2] - 1, +m[1]);
    if (!m || dt.getDate() !== +m[1] || dt.getMonth() !== +m[2] - 1 || dt > hariIni) return aturGalat("Tanggal lahir tidak valid. Gunakan format HH/BB/TTTT.");
    aturGalat("");
    onLogin();
  };
  return React.createElement("div", { className: "min-h-full bg-slate-50 flex flex-col items-center justify-center p-4 py-10" }, React.createElement("div", { className: "mb-6" }, React.createElement(Logo, { big: true })), React.createElement(Kartu, { className: "w-full max-w-sm p-6 shadow-sm" }, React.createElement("form", { onSubmit: kirimForm }, React.createElement("div", { className: "text-sm font-semibold mb-2" }, "Peran"), React.createElement("div", { className: "grid grid-cols-3 gap-1 p-1 border border-slate-200 rounded-lg mb-4", role: "tablist" }, ["Mahasiswa", "Asisten Dosen", "Dosen"].map((r) => React.createElement("button", { type: "button", role: "tab", "aria-selected": peran === r, key: r, onClick: () => aturPeran(r), className: `rounded-md py-2 text-xs sm:text-sm font-semibold ${peran === r ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-50"}` }, r))), peran !== "Mahasiswa" ? React.createElement("p", { className: "text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4" }, "Alur untuk ", peran, " belum tersedia pada versi ini. Pilih peran Mahasiswa untuk masuk.") : React.createElement(React.Fragment, null, React.createElement(Bidang, { label: "NIM (Nomor Induk Mahasiswa)" }, React.createElement("input", { className: kelasInput, inputMode: "numeric", placeholder: "24081010045", value: nim, onChange: (e) => setNim(e.target.value.replace(/\D/g, "")), autoComplete: "off" })), React.createElement(Bidang, { label: "Tanggal Lahir (HH-BB-TTTT)" }, React.createElement("div", { className: "relative" }, React.createElement("input", { className: kelasInput + " pr-10", inputMode: "numeric", placeholder: "HH/BB/TTTT", value: tglLahir, onChange: (e) => aturTglLahir(fmtDob(e.target.value)) }), React.createElement("button", { type: "button", "aria-label": "Pilih tanggal", onClick: () => {
    try {
      dref.current.showPicker();
    } catch (_) {
    }
  }, className: "absolute right-2 top-2 text-slate-500" }, React.createElement(IkonKalender, { className: "w-5 h-5" })), React.createElement("input", { ref: dref, type: "date", tabIndex: -1, className: "absolute right-2 top-8 w-0 h-0 opacity-0", onChange: (e) => {
    const v = e.target.value;
    if (v) {
      const [y, m, d] = v.split("-");
      aturTglLahir(`${d}/${m}/${y}`);
    }
  } })))), galat && React.createElement("p", { className: "text-sm text-red-600 mb-3", role: "alert" }, galat), React.createElement(Tombol, { type: "submit", className: "w-full py-2.5", disabled: peran !== "Mahasiswa" }, "Masuk ke SmartLab AI"), React.createElement("p", { className: "text-xs text-slate-500 text-center mt-4" }, "Lupa NIM atau kendala akses? Hubungi Admin Lab"))), React.createElement("p", { className: "mt-4 text-xs text-slate-400" }, "Versi 3.1"));
}
