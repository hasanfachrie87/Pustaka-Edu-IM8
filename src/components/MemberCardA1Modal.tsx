import React from 'react';
import { Printer, X, QrCode, ShieldCheck, CheckCircle2, User, Sparkles } from 'lucide-react';
import { Member, formatDateId } from '../lib/supabase';

interface MemberCardA1ModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  schoolName?: string;
  kepalaNama?: string;
  kepalaNip?: string;
}

const SCHOOL_LOGO_PATH = '/assets/aistudio/LOGO_SMP_d7966259.png';

export const MemberCardA1Modal: React.FC<MemberCardA1ModalProps> = ({
  isOpen,
  onClose,
  member,
  schoolName = 'SMP IT Insan Madani 8 Kota Tangerang Selatan',
  kepalaNama = 'Drs. H. Mulyadi, M.Pd.',
  kepalaNip = '197808152005011003',
}) => {
  if (!isOpen || !member) return null;

  const todayStr = formatDateId(new Date().toISOString().split('T')[0]);

  // Generate deterministic barcode stripe pattern from member ID & nomor_induk
  const generateBarcodeBars = () => {
    const raw = `${member.nomor_induk}${member.id.replace(/\D/g, '')}9981`;
    const widths = [2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 2, 1, 4, 1, 2, 3, 1, 2];
    return widths.map((w, idx) => ({
      width: `${w * 2}px`,
      isBlack: idx % 2 === 0,
      key: `bar-${idx}`,
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:static print:bg-white print:p-0">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl shadow-2xl my-4 sm:my-8 print:border-none print:shadow-none print:my-0 print-only-sheet overflow-hidden">
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 bg-slate-50 no-print">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F2557] text-white flex items-center justify-center shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-display font-bold text-slate-900">
                  Cetak Kartu Anggota Ukuran A1
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-100 text-blue-800 rounded-md">
                  A1 (841 × 594 mm) Landscape
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Format poster & kartu tanda anggota beresolusi tinggi, siap cetak untuk {member.nama}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Ukuran A1 (Print)
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet (Ukuran A1 Landscape Formatted) */}
        <div className="p-4 sm:p-8 bg-slate-100/60 print:bg-white print:p-0 flex justify-center">
          <div className="w-full max-w-4xl bg-white border-4 border-[#0F2557] rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden print-a1-card text-slate-900">
            {/* Background Decorative Ribbons & Watermark */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-50/50 pointer-events-none -z-0" />
            <div className="absolute right-8 top-8 opacity-5 pointer-events-none -z-0">
              <img src={SCHOOL_LOGO_PATH} alt="" className="w-96 h-96 object-contain" />
            </div>

            {/* HEADER KARTU RESMI A1 */}
            <div className="border-b-4 border-[#0F2557] pb-4 mb-6 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 border-2 border-emerald-600 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={SCHOOL_LOGO_PATH}
                    alt="Logo Sekolah"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold tracking-widest text-emerald-800 uppercase">
                    PERPUSTAKAAN SEKOLAH
                  </p>
                  <h1 className="text-lg sm:text-2xl font-display font-black text-[#0F2557] tracking-tight uppercase leading-tight">
                    {schoolName}
                  </h1>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                    Jl. Insan Madani No. 8, Tangerang Selatan · Telp/WA: (021) 7458-1234 · Website: smpit-insanmadani8.sch.id
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end shrink-0">
                <div className="px-3.5 py-1.5 rounded-lg bg-[#0F2557] text-white text-xs font-bold uppercase tracking-wider text-center">
                  KARTU TANDA ANGGOTA RESMI
                </div>
                <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-1">
                  STANDAR UKURAN BESAR A1
                </div>
              </div>
            </div>

            {/* CARD BODY: 3 BALANCED COLUMNS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 items-stretch">
              {/* Kolom 1: Foto / Avatar & Status Keanggotaan (3 cols) */}
              <div className="md:col-span-3 flex flex-col items-center justify-center text-center p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
                <div className="w-28 h-36 rounded-xl bg-gradient-to-b from-blue-100 to-blue-200 border-2 border-blue-400 flex flex-col items-center justify-center text-blue-900 shadow-inner relative overflow-hidden">
                  <User className="w-16 h-16 text-[#0F2557]" />
                  <span className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                    PASFOTO 3×4
                  </span>
                  <div className="absolute bottom-1 right-1 bg-emerald-600 text-white p-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mt-3 w-full">
                  <span
                    className={`inline-block w-full py-1 px-2 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      member.tipe === 'Guru'
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {member.tipe === 'Guru' ? 'GURU / PENDIDIK' : 'PESERTA DIDIK'}
                  </span>
                  <div className="flex items-center justify-center gap-1 mt-2 text-[11px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Status: Terverifikasi Aktif</span>
                  </div>
                </div>
              </div>

              {/* Kolom 2: Identitas Lengkap Anggota (6 cols) */}
              <div className="md:col-span-6 flex flex-col justify-between p-4 bg-white border-2 border-blue-100 rounded-2xl space-y-3">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Nama Lengkap Anggota
                  </p>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#0F2557] tracking-tight leading-snug">
                    {member.nama}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">
                      {member.tipe === 'Guru' ? 'NIP / NUPTK' : 'Nomor Induk Siswa (NIS)'}
                    </p>
                    <p className="font-mono text-sm font-bold text-slate-900 mt-0.5">
                      {member.nomor_induk}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">Username Login</p>
                    <p className="font-mono text-sm font-bold text-emerald-700 mt-0.5">
                      {member.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">Kelas / Unit Kerja</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{member.kelas_unit}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">Nomor Telepon / WA</p>
                    <p className="font-mono font-medium text-slate-800 mt-0.5">{member.telepon}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>ID Anggota: <span className="font-mono font-semibold">{member.id}</span></span>
                  <span>Masa Berlaku: <strong className="text-slate-800">Aktif Selama di Sekolah</strong></span>
                </div>
              </div>

              {/* Kolom 3: Barcode, QR Code & Verifikasi Mesin (3 cols) */}
              <div className="md:col-span-3 flex flex-col items-center justify-between p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-300 shadow-2xs">
                    <QrCode className="w-20 h-20 text-[#0F2557]" />
                  </div>
                  <p className="text-[10px] font-mono font-bold text-slate-700 mt-1">
                    VERIFIKASI-IM8-{member.nomor_induk}
                  </p>
                </div>

                {/* Simulated High-Res Barcode */}
                <div className="w-full mt-2 pt-2 border-t border-slate-200 flex flex-col items-center">
                  <div className="h-8 flex items-center justify-center gap-[2px]">
                    {generateBarcodeBars().map((b) => (
                      <span
                        key={b.key}
                        style={{ width: b.width }}
                        className={`h-full ${b.isBlack ? 'bg-black' : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] font-semibold tracking-widest text-slate-600 mt-1">
                    *{member.nomor_induk}*
                  </span>
                  <span className="text-[9px] text-slate-500">Scan Barcode Sirkulasi</span>
                </div>
              </div>
            </div>

            {/* TATA TERTIB & TANDA TANGAN RESMI */}
            <div className="mt-6 pt-4 border-t-2 border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-end relative z-10">
              {/* Tata Tertib (7 cols) */}
              <div className="md:col-span-7 text-[11px] text-slate-600 space-y-1 bg-blue-50/50 p-3.5 rounded-xl border border-blue-200/60">
                <p className="font-bold text-[#0F2557] flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Ketentuan & Tata Tertib Pemilik Kartu:
                </p>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-700 leading-relaxed">
                  <li>Kartu ini adalah kartu identitas resmi peminjaman buku di Perpustakaan SMP IT Insan Madani 8.</li>
                  <li>Wajib ditunjukkan kepada petugas perpustakaan pada setiap transaksi peminjaman dan pengembalian.</li>
                  <li>Keterlambatan pengembalian buku dikenakan denda sesuai regulasi (Rp 1.000 / hari).</li>
                  <li>Dilarang meminjamkan atau memindahtangankan kartu anggota ini kepada pihak lain.</li>
                </ol>
              </div>

              {/* Tanda Tangan & Cap Resmi (5 cols) */}
              <div className="md:col-span-5 flex items-center justify-between text-xs text-slate-800 pt-2">
                <div className="text-center min-w-[120px]">
                  <p className="text-[11px] text-slate-500">Tanda Tangan Anggota,</p>
                  <div className="h-12 flex items-end justify-center">
                    <span className="text-[10px] text-slate-400 italic">( Tanda Tangan )</span>
                  </div>
                  <p className="font-semibold text-slate-900 border-t border-slate-300 pt-0.5 mt-1">
                    {member.nama}
                  </p>
                </div>

                <div className="text-center min-w-[150px] relative">
                  <p className="text-[11px] text-slate-500">Tangerang Selatan, {todayStr}</p>
                  <p className="font-semibold text-[#0F2557] text-[11px]">Kepala Perpustakaan,</p>
                  
                  {/* Stempel Cap Basah Simulasi */}
                  <div className="absolute right-0 top-3 w-16 h-16 rounded-full border-2 border-emerald-700/60 flex items-center justify-center text-emerald-800 rotate-12 pointer-events-none opacity-80">
                    <div className="text-[7px] font-black uppercase tracking-tighter text-center leading-none">
                      PERPUSTAKAAN<br />SMP IT<br />INSAN MADANI 8
                    </div>
                  </div>

                  <div className="h-10" />
                  <p className="font-bold underline text-slate-900 border-t border-slate-300 pt-0.5">
                    {kepalaNama}
                  </p>
                  <p className="font-mono text-[10px] text-slate-600">NIP. {kepalaNip}</p>
                </div>
              </div>
            </div>

            {/* A1 Dimensions Footer Tag */}
            <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Sistem Informasi Perpustakaan Pustaka Insan Madani 8</span>
              <span>Dokumen Resmi Format Cetak Poster A1 (841mm × 594mm Landscape)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
