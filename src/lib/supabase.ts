import { createClient } from '@supabase/supabase-js';

// Normalize user-provided Supabase URL (ensure .co suffix if omitted)
const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://psgijbjlkmxivkngxljb.supabase.co';
export const SUPABASE_URL = rawUrl.endsWith('.supabase') ? `${rawUrl}.co` : rawUrl;
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZ2lqYmpsa214aXZrbmd4bGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMTU3NTgsImV4cCI6MjEwODg5MTc1OH0.D6jTu5BNMFZJmg1txglT9QFr49NX1p3KXDYBScW1JMg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Book {
  id: string;
  judul: string;
  penulis: string;
  penerbit: string;
  tahun_terbit: number;
  kategori: string;
  isbn: string;
  stok_total: number;
  stok_tersedia: number;
  cover_url: string;
  rating?: number;
  created_at?: string;
}

export interface Member {
  id: string;
  nomor_induk: string; // NIS (Siswa) atau NIP/NUPTK (Guru)
  username: string; // Username login Siswa / Guru
  nama: string;
  tipe: 'Siswa' | 'Guru';
  kelas_unit: string;
  telepon: string;
  created_at?: string;
}

export interface LoanTransaction {
  id: string;
  buku_id: string;
  anggota_id: string;
  tanggal_pinjam: string; // YYYY-MM-DD
  tanggal_tenggat: string; // YYYY-MM-DD
  tanggal_kembali: string | null; // YYYY-MM-DD or null
  status: 'Dipinjam' | 'Dikembalikan';
  denda_dibayar: number;
  catatan?: string;
  created_at?: string;
}

export const FINE_PER_DAY = 1000; // Rp 1.000 per hari keterlambatan

/**
 * Menghitung jumlah hari keterlambatan dan total denda otomatis (Rp1.000/hari)
 */
export function calculateFine(
  tanggalTenggat: string,
  tanggalKembali: string | null,
  status: 'Dipinjam' | 'Dikembalikan',
  referenceDateStr?: string
): { lateDays: number; fineAmount: number; isOverdue: boolean } {
  const due = new Date(`${tanggalTenggat}T00:00:00`);
  const compareDate =
    status === 'Dikembalikan' && tanggalKembali
      ? new Date(`${tanggalKembali}T00:00:00`)
      : referenceDateStr
      ? new Date(`${referenceDateStr}T00:00:00`)
      : new Date(new Date().toISOString().split('T')[0] + 'T00:00:00');

  const diffTime = compareDate.getTime() - due.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const lateDays = Math.max(0, diffDays);
  const fineAmount = lateDays * FINE_PER_DAY;

  return {
    lateDays,
    fineAmount,
    isOverdue: lateDays > 0,
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateId(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'bk-101',
    judul: 'Bumi Manusia',
    penulis: 'Pramoedya Ananta Toer',
    penerbit: 'Lentera Dipantara',
    tahun_terbit: 2005,
    kategori: 'Sastra & Fiksi',
    isbn: '978-979-97312-3-4',
    stok_total: 8,
    stok_tersedia: 6,
    cover_url: '/src/assets/images/cover_bumi_manusia_1793331549425.jpg',
    rating: 4.9,
  },
  {
    id: 'bk-102',
    judul: 'Fisika Dasar Jilid 1 (Edisi 7)',
    penulis: 'David Halliday & Robert Resnick',
    penerbit: 'Penerbit Erlangga',
    tahun_terbit: 2018,
    kategori: 'Sains & Matematika',
    isbn: '978-602-298-712-3',
    stok_total: 12,
    stok_tersedia: 11,
    cover_url: '/src/assets/images/cover_fisika_dasar_1793331551410.jpg',
    rating: 4.8,
  },
  {
    id: 'bk-103',
    judul: 'Algoritma dan Pemrograman Modern',
    penulis: 'Rinaldi Munir',
    penerbit: 'Informatika Bandung',
    tahun_terbit: 2021,
    kategori: 'Teknologi & Komputer',
    isbn: '978-623-7131-44-1',
    stok_total: 10,
    stok_tersedia: 9,
    cover_url: '/src/assets/images/cover_algoritma_pemrograman_1793331551544.jpg',
    rating: 4.9,
  },
  {
    id: 'bk-105',
    judul: 'Laskar Pelangi',
    penulis: 'Andrea Hirata',
    penerbit: 'Bentang Pustaka',
    tahun_terbit: 2008,
    kategori: 'Sastra & Fiksi',
    isbn: '978-979-3062-79-2',
    stok_total: 9,
    stok_tersedia: 8,
    cover_url: '/src/assets/images/cover_laskar_pelangi_1793331552838.jpg',
    rating: 4.8,
  },
  {
    id: 'bk-104',
    judul: 'Sejarah Nasional Indonesia: Zaman Pergerakan',
    penulis: 'Sartono Kartodirdjo',
    penerbit: 'Balai Pustaka',
    tahun_terbit: 2016,
    kategori: 'Sejarah & Sosial',
    isbn: '978-979-407-192-2',
    stok_total: 6,
    stok_tersedia: 6,
    cover_url: '',
    rating: 4.7,
  },
  {
    id: 'bk-106',
    judul: 'Biologi Campbell Edisi 8 Jilid 1',
    penulis: 'Neil A. Campbell & Jane B. Reece',
    penerbit: 'Penerbit Erlangga',
    tahun_terbit: 2019,
    kategori: 'Sains & Matematika',
    isbn: '978-979-075-688-5',
    stok_total: 7,
    stok_tersedia: 7,
    cover_url: '',
    rating: 4.9,
  },
  {
    id: 'bk-107',
    judul: 'Kamus Besar Bahasa Indonesia Edisi Kelima',
    penulis: 'Badan Pengembangan dan Pembinaan Bahasa',
    penerbit: 'Balai Pustaka',
    tahun_terbit: 2020,
    kategori: 'Referensi & Bahasa',
    isbn: '978-602-437-099-2',
    stok_total: 5,
    stok_tersedia: 5,
    cover_url: '',
    rating: 4.6,
  },
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mb-201',
    nomor_induk: '20241001',
    username: 'nadia',
    nama: 'Nadia Putri Maharani',
    tipe: 'Siswa',
    kelas_unit: 'IX-A',
    telepon: '0812-3456-7890',
  },
  {
    id: 'mb-202',
    nomor_induk: '20241002',
    username: 'rizky',
    nama: 'Rizky Pratama Wijaya',
    tipe: 'Siswa',
    kelas_unit: 'VIII-B',
    telepon: '0813-9876-5432',
  },
  {
    id: 'mb-203',
    nomor_induk: '20241003',
    username: 'aulia',
    nama: 'Aulia Rahman Hakim',
    tipe: 'Siswa',
    kelas_unit: 'VII-C',
    telepon: '0857-2345-6789',
  },
  {
    id: 'mb-204',
    nomor_induk: '19850412201001',
    username: 'hendra',
    nama: 'Drs. Hendra Kusuma, M.Pd.',
    tipe: 'Guru',
    kelas_unit: 'Guru IPA & Sains',
    telepon: '0811-2233-4455',
  },
  {
    id: 'mb-205',
    nomor_induk: '19910823201502',
    username: 'siti',
    nama: 'Siti Aminah, S.Kom.',
    tipe: 'Guru',
    kelas_unit: 'Guru Informatika',
    telepon: '0821-8765-1122',
  },
];

// Create realistic dates relative to today so overdue calculations are immediately visible
function getRelativeDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export const INITIAL_LOANS: LoanTransaction[] = [
  {
    id: 'trx-301',
    buku_id: 'bk-101',
    anggota_id: 'mb-201',
    tanggal_pinjam: getRelativeDate(-12),
    tanggal_tenggat: getRelativeDate(-5), // Terlambat 5 hari -> Denda Rp 5.000
    tanggal_kembali: null,
    status: 'Dipinjam',
    denda_dibayar: 0,
    catatan: 'Peminjaman untuk tugas resensi sastra Indonesia',
  },
  {
    id: 'trx-302',
    buku_id: 'bk-102',
    anggota_id: 'mb-202',
    tanggal_pinjam: getRelativeDate(-4),
    tanggal_tenggat: getRelativeDate(3), // Masih dalam masa pinjam (sisa 3 hari)
    tanggal_kembali: null,
    status: 'Dipinjam',
    denda_dibayar: 0,
    catatan: 'Persiapan olimpiade fisika sekolah',
  },
  {
    id: 'trx-303',
    buku_id: 'bk-103',
    anggota_id: 'mb-203',
    tanggal_pinjam: getRelativeDate(-9),
    tanggal_tenggat: getRelativeDate(-2), // Terlambat 2 hari -> Denda Rp 2.000
    tanggal_kembali: null,
    status: 'Dipinjam',
    denda_dibayar: 0,
    catatan: 'Praktikum struktur data kelas X',
  },
  {
    id: 'trx-304',
    buku_id: 'bk-105',
    anggota_id: 'mb-201',
    tanggal_pinjam: getRelativeDate(-20),
    tanggal_tenggat: getRelativeDate(-13),
    tanggal_kembali: getRelativeDate(-10), // Terlambat 3 hari saat dikembalikan -> Denda Rp 3.000
    status: 'Dikembalikan',
    denda_dibayar: 3000,
    catatan: 'Sudah dikembalikan dan denda lunas',
  },
  {
    id: 'trx-305',
    buku_id: 'bk-101',
    anggota_id: 'mb-204',
    tanggal_pinjam: getRelativeDate(-6),
    tanggal_tenggat: getRelativeDate(1),
    tanggal_kembali: null,
    status: 'Dipinjam',
    denda_dibayar: 0,
    catatan: 'Referensi bahan ajar lintas minat',
  },
];

export const SUPABASE_SQL_SCHEMA = `-- ============================================================================
-- SKRIP SQL PERPUSTAKAAN SEKOLAH (PUSTAKAEDU) UNTUK SUPABASE
-- Jalankan skrip ini di SQL Editor Supabase Anda:
-- https://supabase.com/dashboard/project/psgijbjlkmxivkngxljb/sql/new
-- ============================================================================

-- 1. TABEL BUKU (books)
CREATE TABLE IF NOT EXISTS public.books (
  id TEXT PRIMARY KEY,
  judul TEXT NOT NULL,
  penulis TEXT NOT NULL,
  penerbit TEXT NOT NULL,
  tahun_terbit INTEGER NOT NULL,
  kategori TEXT NOT NULL,
  isbn TEXT NOT NULL,
  stok_total INTEGER NOT NULL DEFAULT 1,
  stok_tersedia INTEGER NOT NULL DEFAULT 1,
  cover_url TEXT DEFAULT '',
  rating NUMERIC DEFAULT 4.8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kolom tambahan jika tabel sudah ada sebelumnya
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.8;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS cover_url TEXT DEFAULT '';

-- 2. TABEL ANGGOTA (members) - Siswa & Guru
CREATE TABLE IF NOT EXISTS public.members (
  id TEXT PRIMARY KEY,
  nomor_induk TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  nama TEXT NOT NULL,
  tipe TEXT NOT NULL CHECK (tipe IN ('Siswa', 'Guru')),
  kelas_unit TEXT NOT NULL,
  telepon TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kolom tambahan jika tabel sudah ada sebelumnya
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS username TEXT DEFAULT '';

-- 3. TABEL TRANSAKSI PEMINJAMAN (loans)
CREATE TABLE IF NOT EXISTS public.loans (
  id TEXT PRIMARY KEY,
  buku_id TEXT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  anggota_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  tanggal_pinjam DATE NOT NULL,
  tanggal_tenggat DATE NOT NULL,
  tanggal_kembali DATE,
  status TEXT NOT NULL CHECK (status IN ('Dipinjam', 'Dikembalikan')),
  denda_dibayar INTEGER NOT NULL DEFAULT 0,
  catatan TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROW LEVEL SECURITY (RLS) & POLICY AKSES PUBLIK (ANON KEY)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public access to books" ON public.books;
CREATE POLICY "Allow public access to books" ON public.books FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to members" ON public.members;
CREATE POLICY "Allow public access to members" ON public.members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to loans" ON public.loans;
CREATE POLICY "Allow public access to loans" ON public.loans FOR ALL USING (true) WITH CHECK (true);

-- 5. SEED DATA AWAL BUKU
INSERT INTO public.books (id, judul, penulis, penerbit, tahun_terbit, kategori, isbn, stok_total, stok_tersedia, cover_url, rating)
VALUES
  ('bk-101', 'Bumi Manusia', 'Pramoedya Ananta Toer', 'Lentera Dipantara', 2005, 'Sastra & Fiksi', '978-979-97312-3-4', 8, 6, '/src/assets/images/cover_bumi_manusia_1793331549425.jpg', 4.9),
  ('bk-102', 'Fisika Dasar Jilid 1 (Edisi 7)', 'David Halliday & Robert Resnick', 'Penerbit Erlangga', 2018, 'Sains & Matematika', '978-602-298-712-3', 12, 11, '/src/assets/images/cover_fisika_dasar_1793331551410.jpg', 4.8),
  ('bk-103', 'Algoritma dan Pemrograman Modern', 'Rinaldi Munir', 'Informatika Bandung', 2021, 'Teknologi & Komputer', '978-623-7131-44-1', 10, 9, '/src/assets/images/cover_algoritma_pemrograman_1793331551544.jpg', 4.9),
  ('bk-105', 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2008, 'Sastra & Fiksi', '978-979-3062-79-2', 9, 8, '/src/assets/images/cover_laskar_pelangi_1793331552838.jpg', 4.8),
  ('bk-104', 'Sejarah Nasional Indonesia: Zaman Pergerakan', 'Sartono Kartodirdjo', 'Balai Pustaka', 2016, 'Sejarah & Sosial', '978-979-407-192-2', 6, 6, '', 4.7),
  ('bk-106', 'Biologi Campbell Edisi 8 Jilid 1', 'Neil A. Campbell & Jane B. Reece', 'Penerbit Erlangga', 2019, 'Sains & Matematika', '978-979-075-688-5', 7, 7, '', 4.9),
  ('bk-107', 'Kamus Besar Bahasa Indonesia Edisi Kelima', 'Badan Pengembangan dan Pembinaan Bahasa', 'Balai Pustaka', 2020, 'Referensi & Bahasa', '978-602-437-099-2', 5, 5, '', 4.6)
ON CONFLICT (id) DO UPDATE SET
  judul = EXCLUDED.judul,
  penulis = EXCLUDED.penulis,
  penerbit = EXCLUDED.penerbit,
  tahun_terbit = EXCLUDED.tahun_terbit,
  kategori = EXCLUDED.kategori,
  isbn = EXCLUDED.isbn,
  stok_total = EXCLUDED.stok_total,
  stok_tersedia = EXCLUDED.stok_tersedia,
  cover_url = EXCLUDED.cover_url,
  rating = EXCLUDED.rating;

-- 6. SEED DATA AWAL ANGGOTA (Siswa & Guru dengan Username)
INSERT INTO public.members (id, nomor_induk, username, nama, tipe, kelas_unit, telepon)
VALUES
  ('mb-201', '20241001', 'nadia', 'Nadia Putri Maharani', 'Siswa', 'IX-A', '0812-3456-7890'),
  ('mb-202', '20241002', 'rizky', 'Rizky Pratama Wijaya', 'Siswa', 'VIII-B', '0813-9876-5432'),
  ('mb-203', '20241003', 'aulia', 'Aulia Rahman Hakim', 'Siswa', 'VII-C', '0857-2345-6789'),
  ('mb-204', '19850412201001', 'hendra', 'Drs. Hendra Kusuma, M.Pd.', 'Guru', 'Guru IPA & Sains', '0811-2233-4455'),
  ('mb-205', '19910823201502', 'siti', 'Siti Aminah, S.Kom.', 'Guru', 'Guru Informatika', '0821-8765-1122')
ON CONFLICT (id) DO UPDATE SET
  nomor_induk = EXCLUDED.nomor_induk,
  username = EXCLUDED.username,
  nama = EXCLUDED.nama,
  tipe = EXCLUDED.tipe,
  kelas_unit = EXCLUDED.kelas_unit,
  telepon = EXCLUDED.telepon;

-- 7. SEED DATA AWAL PEMINJAMAN
INSERT INTO public.loans (id, buku_id, anggota_id, tanggal_pinjam, tanggal_tenggat, tanggal_kembali, status, denda_dibayar, catatan)
VALUES
  ('trx-301', 'bk-101', 'mb-201', CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE - INTERVAL '5 days', NULL, 'Dipinjam', 0, 'Peminjaman tugas resensi sastra Indonesia'),
  ('trx-302', 'bk-102', 'mb-202', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE + INTERVAL '3 days', NULL, 'Dipinjam', 0, 'Persiapan olimpiade sains'),
  ('trx-303', 'bk-103', 'mb-203', CURRENT_DATE - INTERVAL '9 days', CURRENT_DATE - INTERVAL '2 days', NULL, 'Dipinjam', 0, 'Praktikum informatika'),
  ('trx-304', 'bk-105', 'mb-201', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE - INTERVAL '10 days', 'Dikembalikan', 3000, 'Sudah dikembalikan dan denda lunas'),
  ('trx-305', 'bk-101', 'mb-204', CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE + INTERVAL '1 day', NULL, 'Dipinjam', 0, 'Referensi bahan ajar guru')
ON CONFLICT (id) DO UPDATE SET
  buku_id = EXCLUDED.buku_id,
  anggota_id = EXCLUDED.anggota_id,
  tanggal_pinjam = EXCLUDED.tanggal_pinjam,
  tanggal_tenggat = EXCLUDED.tanggal_tenggat,
  tanggal_kembali = EXCLUDED.tanggal_kembali,
  status = EXCLUDED.status,
  denda_dibayar = EXCLUDED.denda_dibayar,
  catatan = EXCLUDED.catatan;
`;
