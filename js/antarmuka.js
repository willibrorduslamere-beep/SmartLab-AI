// Komponen UI dasar (Kartu, Tombol, Bidang, Lencana) dan status peminjaman
const Kartu = ({ className = "", children }) => React.createElement("div", { className: `bg-white border border-slate-200 rounded-xl ${className}` }, children);
const Tombol = ({ variant = "primary", className = "", ...p }) => React.createElement("button", { ...p, className: `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 ${variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"} ${className}` });
const Bidang = ({ label, children }) => React.createElement("label", { className: "block text-sm font-semibold mb-3" }, label, React.createElement("div", { className: "mt-1 font-normal" }, children));
const kelasInput = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600";
const Judul = ({ children, sub }) => React.createElement("div", { className: "mb-4" }, React.createElement("h1", { className: "text-2xl font-bold" }, children), sub && React.createElement("p", { className: "text-sm text-slate-600" }, sub));
const Lencana = ({ c, children }) => React.createElement("span", { className: `inline-block text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${c === "solid" ? "bg-blue-600 text-white" : c === "outline" ? "border border-blue-600 text-blue-700" : "bg-slate-100 text-slate-600"}` }, children);
const statusPinjam = (b, sekarang) => {
  const s = waktuSlot(b.date, b.start), e = waktuSlot(b.date, b.start + b.dur);
  if (sekarang >= e) return { t: "Selesai", c: "gray" };
  if (sekarang >= s) return { t: "Sedang Berlangsung", c: "solid" };
  const m = Math.round((s - sekarang) / 6e4);
  return { t: "Mulai " + (m < 60 ? `dalam ${m} menit` : m < 1440 ? `dalam ${Math.round(m / 60)} jam` : `dalam ${Math.round(m / 1440)} hari`), c: "outline" };
};
