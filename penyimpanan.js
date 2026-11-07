// Penyimpanan: data di localStorage, berkas materi di IndexedDB (cadangan: memori), dan data contoh
const KUNCI_DATA = "smartlab_data_v1";
const muatData = () => {
  try {
    const t = localStorage.getItem(KUNCI_DATA);
    const d = t && JSON.parse(t);
    if (d && d.v === 1) return d;
  } catch (e) {
  }
  return null;
};
const simpanData = (d) => {
  try {
    localStorage.setItem(KUNCI_DATA, JSON.stringify({ ...d, v: 1 }));
  } catch (e) {
  }
};
const memBerkas = /* @__PURE__ */ new Map();
const bukaDB = () => new Promise((selesai, gagal) => {
  try {
    const r = indexedDB.open("smartlab_berkas", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("berkas", { keyPath: "id" });
    r.onsuccess = () => selesai(r.result);
    r.onerror = () => gagal(r.error);
  } catch (e) {
    gagal(e);
  }
});
const BerkasDB = {
  async simpan(id, blob) {
    memBerkas.set(id, blob);
    try {
      const db = await bukaDB();
      await new Promise((selesai, gagal) => {
        const t = db.transaction("berkas", "readwrite");
        t.objectStore("berkas").put({ id, blob });
        t.oncomplete = selesai;
        t.onerror = () => gagal(t.error);
      });
    } catch (e) {
    }
  },
  async ambil(id) {
    if (memBerkas.has(id)) return memBerkas.get(id);
    try {
      const db = await bukaDB();
      return await new Promise((selesai, gagal) => {
        const r = db.transaction("berkas").objectStore("berkas").get(id);
        r.onsuccess = () => selesai(r.result ? r.result.blob : null);
        r.onerror = () => gagal(r.error);
      });
    } catch (e) {
      return null;
    }
  },
  async hapus(id) {
    memBerkas.delete(id);
    try {
      const db = await bukaDB();
      await new Promise((selesai, gagal) => {
        const t = db.transaction("berkas", "readwrite");
        t.objectStore("berkas").delete(id);
        t.oncomplete = selesai;
        t.onerror = () => gagal(t.error);
      });
    } catch (e) {
    }
  }
};
const labelTipe = (nama) => {
  const e = (nama.split(".").pop() || "").toLowerCase();
  return { pdf: "PDF", ppt: "PowerPoint", pptx: "PowerPoint", doc: "Word", docx: "Word", xls: "Excel", xlsx: "Excel", csv: "Excel", png: "Gambar", jpg: "Gambar", jpeg: "Gambar", gif: "Gambar", webp: "Gambar", mp4: "Video", zip: "Arsip", rar: "Arsip", txt: "Teks" }[e] || "Berkas";
};
const ukuranTeks = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${Math.round(b / 1024)} KB` : `${(b / 1048576).toFixed(1)} MB`;
const unduhBerkas = async (b) => {
  const blob = await BerkasDB.ambil(b.id);
  if (!blob) return false;
  const u = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = u;
  a.download = b.nama;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 4e3);
  return true;
};
const bukaBerkas = async (b) => {
  const w = window.open("", "_blank");
  const blob = await BerkasDB.ambil(b.id);
  if (!blob) {
    if (w) w.close();
    return false;
  }
  if (!w) return unduhBerkas(b);
  const u = URL.createObjectURL(blob);
  w.location.href = u;
  setTimeout(() => URL.revokeObjectURL(u), 6e4);
  return true;
};
const PDF_A = "JVBERi0xLjQKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9Db250ZW50cyA0IDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4+Pj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDM1Mz4+CnN0cmVhbQpCVCAvRjEgMjAgVGYgNjAgNzgwIFRkIChQYW5kdWFuIFByYWt0aWt1bSBQZW5ndWt1cmFuKSBUaiBFVApCVCAvRjEgMTIgVGYgNjAgNzQwIFRkIChDb250b2ggbWF0ZXJpIFNtYXJ0TGFiIEFJLikgVGogRVQKQlQgL0YxIDEyIFRmIDYwIDcxOCBUZCAoMS4gUGVsYWphcmkgZnVuZ3NpIGphbmdrYSBzb3JvbmcgZGFuIG1pa3JvbWV0ZXIgc2VrcnVwLikgVGogRVQKQlQgL0YxIDEyIFRmIDYwIDY5NiBUZCAoMi4gU2lhcGthbiBidWt1IGNhdGF0YW4gZGFuIGthbGt1bGF0b3IuKSBUaiBFVApCVCAvRjEgMTIgVGYgNjAgNjc0IFRkICgzLiBEYXRhbmcgMTAgbWVuaXQgc2ViZWx1bSBwcmFrdGlrdW0gZGltdWxhaS4pIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTQgMDAwMDAgbiAKMDAwMDAwMDEwNSAwMDAwMCBuIAowMDAwMDAwMjE3IDAwMDAwIG4gCjAwMDAwMDA2MTggMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo2ODEKJSVFT0YK", PDF_B = "JVBERi0xLjQKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9Db250ZW50cyA0IDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4+Pj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDM2Mj4+CnN0cmVhbQpCVCAvRjEgMjAgVGYgNjAgNzgwIFRkIChLZXNlbGFtYXRhbiBLZXJqYSBkaSBMYWJvcmF0b3JpdW0pIFRqIEVUCkJUIC9GMSAxMiBUZiA2MCA3NDAgVGQgKENvbnRvaCBtYXRlcmkgU21hcnRMYWIgQUkuKSBUaiBFVApCVCAvRjEgMTIgVGYgNjAgNzE4IFRkICgxLiBQYWthaSBqYXMgbGFiLCBrYWNhbWF0YSwgZGFuIHNhcnVuZyB0YW5nYW4uKSBUaiBFVApCVCAvRjEgMTIgVGYgNjAgNjk2IFRkICgyLiBLZXJqYWthbiBiYWhhbiBraW1pYSBkaSBkYWxhbSBsZW1hcmkgYXNhbS4pIFRqIEVUCkJUIC9GMSAxMiBUZiA2MCA2NzQgVGQgKDMuIExhcG9ya2FuIHR1bXBhaGFuIGF0YXUga2VydXNha2FuIGFsYXQga2UgYXNpc3Rlbi4pIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTQgMDAwMDAgbiAKMDAwMDAwMDEwNSAwMDAwMCBuIAowMDAwMDAwMjE3IDAwMDAwIG4gCjAwMDAwMDA2MjcgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo2OTAKJSVFT0YK";
const keBlobPdf = (b64) => {
  const s = atob(b64), a = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
  return new Blob([a], { type: "application/pdf" });
};
const simpanBerkasContoh = () => {
  BerkasDB.simpan("b1", keBlobPdf(PDF_A));
  BerkasDB.simpan("b2", keBlobPdf(PDF_B));
};
const buatDataContoh = () => {
  const d = (n) => isoTanggal(tambahHari(hariIni, n));
  const lalu = (h) => new Date(Date.now() - h * 36e5).toISOString();
  return {
    jadwal: [
      { id: "j1", res: "r1", date: d(2), start: 9, dur: 2, kegiatan: "Praktikum Fisika Dasar: Jangka Sorong & Mikrometer", kelas: "Kelas Q2", oleh: "Dosen" },
      { id: "j2", res: "r3", date: d(3), start: 13, dur: 2, kegiatan: "Praktikum Kimia Dasar: Keselamatan Lab", kelas: "Kelas Q2", oleh: "Asisten Dosen" },
      { id: "j3", res: "r2", date: d(5), start: 8, dur: 2, kegiatan: "Praktikum Osiloskop dan Pengukuran Sinyal", kelas: "Kelas Q3", oleh: "Asisten Dosen" },
      { id: "j4", res: "r4", date: d(6), start: 10, dur: 2, kegiatan: "Praktikum Geologi: Pengenalan Mineral dan Batuan", kelas: "Kelas Q1", oleh: "Dosen" }
    ],
    materi: [
      { id: "m1", judul: "Panduan Praktikum Pengukuran", jadwalId: "j1", keterangan: "Baca panduan ini sebelum masuk lab. Bawa kalkulator dan buku catatan.", oleh: "Asisten Dosen", kirim: lalu(20), berkas: [{ id: "b1", nama: "Panduan-Praktikum-Pengukuran.pdf", tipe: "PDF", ukuran: 861 }] },
      { id: "m2", judul: "Keselamatan Kerja di Laboratorium Kimia", jadwalId: "j2", keterangan: "Pelajari aturan keselamatan. Wajib memakai jas lab dan kacamata pelindung.", oleh: "Dosen", kirim: lalu(44), berkas: [{ id: "b2", nama: "Keselamatan-Kerja-Lab.pdf", tipe: "PDF", ukuran: 870 }] }
    ],
    laporan: [
      { id: 1, eq: "e5", sev: "Parah", deskripsi: "Elektroda tidak stabil", status: "Dalam Perbaikan", oleh: "Asisten Dosen" },
      { id: 2, eq: "e3", sev: "Ringan", deskripsi: "Dudukan kuvet longgar", status: "Dalam Peninjauan", oleh: "Dosen" }
    ],
    dibuka: []
  };
};
