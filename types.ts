export enum UserRole {
  Admin = 'admin',
  Dokter_Umum = 'dokter_umum',
  Dokter_Gigi = 'dokter_gigi',
  ATLM_Lab = 'atlm_lab',
  Radiografer = 'radiografer',
  Reviewer = 'reviewer',
}

export enum ExamStatus {
  InProgress = 'In Progress',
  PendingReview = 'Pending Review',
  Finalized = 'Finalized',
  RevisionNeeded = 'Revision Needed',
}

export enum SectionStatus {
  Draft = 'Draft',
  Submitted = 'Submitted',
}

export enum SectionCode {
  Identitas = 'identitas',
  Klinis = 'klinis',
  Gigi = 'gigi',
  Vital = 'vital',
  MataTHT = 'mata_tht',
  Penunjang = 'penunjang',
  Lab = 'lab',
  Resume = 'resume',
}

export interface Person {
  id: string;
  nrp: string;
  name: string;
  rank: string;
  unit: string;
  dob: string;
  address: string;
  religion: string;
  gender: 'Laki-laki' | 'Perempuan';
  pemberitahuan: string; // Corresponds to field 9: NAMA AYAH/IBU/WALI/PEMBERITAHUAN
}

export type OdontogramData = {
  [toothId: string]: OdontogramToothState;
};

export enum OdontogramToothState {
    Sehat = 'S',
    Karies = 'K',
    TambalanAmalgam = 'Am',
    TambalanLain = 'SI',
    Mahkota = 'M',
    Hilang = 'H',
    SisaAkar = 'SA',
    Jembatan = 'J',
    BelumErupsi = 'BE',
}

// Data structures for each section, matching the form
export interface IdentityData {
  maksudPemeriksaan: string;
  tanggalPemeriksaan: string;
  masaKerjaMiliter: string;
  masaKerjaSipil: string;
  anamnesis: string;
}

export interface ClinicalEvalData {
  [key: string]: { normal: boolean; abnormalDesc: string };
}

export interface DentalData {
  odontogram: OdontogramData;
  stakes: string;
  catatan: {
    oklusi: string;
    kebersihanMulut: string;
    frekuensiSikatGigi: string;
    kelainanDalamMulut: string;
    karangGigi: 'Ada' | 'Tidak Ada' | '';
    diagnosaKelainan: string;
    dmf: number;
    jumlahGigiVital: string;
    jumlahTitikKontak: string;
    fissureStain: string;
  };
}

export interface VitalsData {
  beratBadan: string;
  tinggiBadan: string;
  bentukBadan: string;
  tensi: string;
  nadi: string;
  temp: string;
  lingkarDadaExp: string;
  lingkarDadaInsp: string;
  lingkarPerut: string;
  warnaRambut: string;
  warnaMata: string;
  tandaIdentifikasiLain: string;
}

export interface MataTHTData {
  visusOD: string;
  visusOS: string;
  koreksiOD: string;
  koreksiOS: string;
  membedakanWarna: string;
  pemeriksaanPerimetris: string;
  tekananIntaoculairOD: string;
  tekananIntaoculairOS: string;
  suaraBisikanAS: string;
  suaraBisikanAD: string;
}

export interface SupportingTestsData {
  rontgen: string;
  ecg: string;
  pemeriksaanSpesialisLain: string;
}

export interface LabData {
  darah: {
    hb: string;
    leuco: string;
    bse: string;
    dif: string;
  };
  serologi: {
    hbsag: string;
    fdrl: string;
    hiv: string;
  };
  urine: {
    bj: string;
    warna: string;
    prot: string;
    red: string;
    bil: string;
    sedimentLeuco: string;
    sedimentEri: string;
    sedimentKristal: string;
    sedimentLain: string;
  };
  golDarah: string;
  pemeriksaanLabLainnya: string;
}

export interface ResumeData {
  statusFisik: string[];
  kualifikasi: string;
  kodeTugas: string[];
  resume: string;
  kesimpulan: 'BAIK' | 'BAIK DENGAN CATATAN' | 'TIDAK BAIK' | '';
  rekomendasi: string;
  dokterPemeriksa: {
    nama: string;
    jabatan: string;
  };
  penanggungJawab: {
    nama: string;
    pangkat: string;
    jabatan: string;
  };
}

export interface ExamSection {
  code: SectionCode;
  status: SectionStatus;
  lastUpdated: string;
  updatedBy: UserRole;
  data: any; // This will hold one of the detailed data interfaces above
  revisionReason?: string;
}

export interface Exam {
  id: string;
  personId: string;
  purpose: string; // Kept for dashboard summary
  status: ExamStatus;
  sections: Record<SectionCode, ExamSection>;
}