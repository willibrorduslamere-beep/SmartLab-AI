// Halaman Inventaris Langsung & Pemindai Visi AI
function Inventaris({ c }) {
  const [q, setQ] = useState("");
  const [st, setSt] = useState("Semua");
  const [gambar, aturGambar] = useState(null);
  const [memindai, aturMemindai] = useState(false);
  const [res, setRes] = useState(null);
  const fr = useRef();
  const [kamera, aturKamera] = useState(false);
  const [galatKamera, aturGalatKamera] = useState("");
  const videoRef = useRef();
  const aliran = useRef(null);
  const rows = ALAT.filter((e) => (st === "Semua" || e.st === st) && e.name.toLowerCase().includes(q.toLowerCase()));
  const pindai = (url, nama) => {
    setRes(null);
    aturMemindai(true);
    aturGambar(url || null);
    const n = (nama || "").toLowerCase();
    const cocok = ALAT.find((e) => e.keys.some((k) => n.includes(k))) || (url ? ALAT[Math.floor(Math.random() * ALAT.length)] : ALAT[0]);
    setTimeout(() => {
      aturMemindai(false);
      setRes({ e: cocok, keyakinan: url ? Math.round(93 + Math.random() * 6) : 98 });
    }, 1800);
  };
  const matikanKamera = () => {
    if (aliran.current) {
      aliran.current.getTracks().forEach((t) => t.stop());
      aliran.current = null;
    }
    aturKamera(false);
  };
  const bukaKamera = async () => {
    aturGalatKamera("");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return aturGalatKamera("Kamera tidak tersedia di browser ini. Buka lewat localhost, HTTPS, atau Go Live.");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      aliran.current = s;
      aturGambar(null);
      setRes(null);
      aturKamera(true);
    } catch (err) {
      aturGalatKamera(err.name === "NotAllowedError" ? "Izin kamera ditolak. Klik ikon gembok di address bar, lalu izinkan kamera." : err.name === "NotFoundError" ? "Kamera tidak ditemukan di perangkat ini." : "Kamera tidak bisa dibuka. Pastikan tidak sedang dipakai aplikasi lain.");
    }
  };
  const ambilFoto = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const kanvas = document.createElement("canvas");
    kanvas.width = v.videoWidth;
    kanvas.height = v.videoHeight;
    kanvas.getContext("2d").drawImage(v, 0, 0);
    const url = kanvas.toDataURL("image/jpeg", 0.85);
    matikanKamera();
    pindai(url, "");
  };
  useEffect(() => {
    if (kamera && videoRef.current && aliran.current) {
      videoRef.current.srcObject = aliran.current;
      videoRef.current.play().catch(() => {
      });
    }
  }, [kamera]);
  useEffect(() => () => {
    if (aliran.current) aliran.current.getTracks().forEach((t) => t.stop());
  }, []);
  return React.createElement("div", null, React.createElement(Judul, null, "Inventaris Langsung & Pemindai"), React.createElement("div", { className: "flex flex-col md:flex-row gap-2 mb-3" }, React.createElement("div", { className: "relative flex-1" }, React.createElement(IkonCari, { className: "w-4 h-4 absolute left-3 top-2.5 text-slate-500" }), React.createElement("input", { className: kelasInput + " pl-9", placeholder: "Cari alat", value: q, onChange: (e) => setQ(e.target.value) })), React.createElement("div", { className: "flex gap-1 overflow-x-auto" }, ["Semua", "Tersedia", "Sedang Digunakan", "Pemeliharaan"].map((s) => React.createElement("button", { key: s, onClick: () => setSt(s), className: `whitespace-nowrap px-3 py-2 rounded-lg text-sm border ${st === s ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200"}` }, s)))), React.createElement("div", { className: "grid lg:grid-cols-5 gap-4" }, React.createElement(Kartu, { className: "lg:col-span-3 p-4" }, React.createElement("h2", { className: "font-semibold mb-2" }, "Katalog"), React.createElement("ul", { className: "space-y-2 max-h-[420px] overflow-y-auto" }, rows.map((e) => {
    const cocok = res && res.e.id === e.id;
    return React.createElement("li", { key: e.id, className: `flex items-center gap-3 p-2.5 rounded-lg border ${cocok ? "border-blue-600 bg-blue-50" : "border-slate-200"}` }, React.createElement("div", { className: "w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0" }, React.createElement(IkonLabu, { className: "w-5 h-5 text-blue-600" })), React.createElement("div", { className: "flex-1 min-w-0" }, React.createElement("div", { className: "font-semibold text-sm" }, e.name), React.createElement("div", { className: "text-xs text-slate-500" }, e.spesifikasi)), React.createElement("span", { className: `text-xs font-medium px-2 py-0.5 rounded ${kelasStatus[e.st]}` }, e.st));
  }), !rows.length && React.createElement("li", { className: "py-6 text-sm text-slate-500" }, "Tidak ada alat yang cocok dengan filter ini."))), React.createElement(Kartu, { className: "lg:col-span-2 p-4 self-start" }, React.createElement("h2", { className: "font-semibold mb-3" }, "Pemindai Visi AI"), React.createElement("div", { className: "relative aspect-[4/3] rounded-lg bg-slate-900 overflow-hidden flex items-center justify-center" }, kamera ? React.createElement("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, className: "absolute inset-0 w-full h-full object-cover" }) : gambar ? React.createElement("img", { src: gambar, alt: "Foto alat", className: "absolute inset-0 w-full h-full object-cover" }) : React.createElement(IkonLabu, { className: "w-10 h-10 text-slate-500" }), ["top-3 left-3 border-t-4 border-l-4", "top-3 right-3 border-t-4 border-r-4", "bottom-3 left-3 border-b-4 border-l-4", "bottom-3 right-3 border-b-4 border-r-4"].map((k) => React.createElement("span", { key: k, className: `absolute w-8 h-8 border-blue-500 ${k}` })), (memindai || kamera) && React.createElement("div", { className: "absolute inset-x-4 h-0.5 bg-blue-500", style: { animation: "pindai 1.2s linear infinite alternate" } })), React.createElement("input", { ref: fr, type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
    const f = e.target.files[0];
    if (f) {
      matikanKamera();
      pindai(URL.createObjectURL(f), f.name);
    }
    e.target.value = "";
  } }), React.createElement("div", { className: "flex flex-wrap gap-2 mt-3" }, kamera ? React.createElement(React.Fragment, null, React.createElement(Tombol, { className: "flex-1", onClick: ambilFoto }, React.createElement(IkonKamera, { className: "w-4 h-4" }), "Ambil & Pindai"), React.createElement(Tombol, { variant: "outline", onClick: matikanKamera }, "Tutup kamera")) : React.createElement(React.Fragment, null, React.createElement(Tombol, { className: "flex-1", onClick: bukaKamera, disabled: memindai }, React.createElement(IkonKamera, { className: "w-4 h-4" }), "Buka kamera"), React.createElement(Tombol, { variant: "outline", onClick: () => fr.current.click(), disabled: memindai }, React.createElement(IkonUnggah, { className: "w-4 h-4" }), "Unggah foto"), React.createElement(Tombol, { variant: "outline", onClick: () => pindai(null), disabled: memindai }, "Contoh"))), kamera && React.createElement("p", { className: "text-xs text-slate-500 mt-2" }, "Arahkan kamera ke alat, lalu tekan Ambil & Pindai."), galatKamera && React.createElement("p", { className: "text-sm text-red-600 mt-2", role: "alert" }, galatKamera), memindai && React.createElement("p", { className: "text-sm text-slate-500 mt-3 flex items-center gap-2" }, React.createElement(IkonMemuat, { className: "w-4 h-4 animate-spin" }), "Mengenali alat…"), res && React.createElement("div", { className: "mt-3 border border-slate-200 rounded-lg p-3" }, React.createElement("div", { className: "font-semibold text-sm" }, "Kecocokan ", res.keyakinan, "% - ", res.e.name), React.createElement("div", { className: "text-xs text-slate-600 my-1" }, res.e.spesifikasi), React.createElement("span", { className: `text-xs font-medium px-2 py-0.5 rounded ${kelasStatus[res.e.st]}` }, res.e.st), React.createElement("div", { className: "flex gap-2 mt-3" }, React.createElement(Tombol, { className: "flex-1 !py-1.5", disabled: res.e.st === "Pemeliharaan", onClick: () => c.bukaPemesanan(res.e.id) }, "Pinjam Sekarang"), React.createElement(Tombol, { variant: "outline", className: "flex-1 !py-1.5", onClick: () => c.kirimPesan(`Bagaimana cara memakai ${res.e.name}?`) }, "Tanya AI"))))));
}
