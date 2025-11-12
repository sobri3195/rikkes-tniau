import { UserRole, SectionCode, Exam, Person, ExamStatus, SectionStatus, OdontogramToothState } from './types';

export const ROLES: UserRole[] = [
  UserRole.Admin,
  UserRole.Dokter_Umum,
  UserRole.Dokter_Gigi,
  UserRole.ATLM_Lab,
  UserRole.Radiografer,
  UserRole.Reviewer,
];

export const SECTION_CONFIG: Record<SectionCode, { title: string; roles: UserRole[] }> = {
  [SectionCode.Identitas]: { title: 'Identitas & Anamnesis (1-12)', roles: [UserRole.Dokter_Umum] },
  [SectionCode.Klinis]: { title: 'Evaluasi Klinis (13-34)', roles: [UserRole.Dokter_Umum] },
  [SectionCode.Gigi]: { title: 'Gigi & Odontogram (35)', roles: [UserRole.Dokter_Gigi] },
  [SectionCode.Penunjang]: { title: 'Pemeriksaan Penunjang (36-38)', roles: [UserRole.Radiografer] },
  [SectionCode.Vital]: { title: 'Ukuran & Pemeriksaan Lain (39-53)', roles: [UserRole.Dokter_Umum] },
  [SectionCode.MataTHT]: { title: 'Pemeriksaan Mata & THT (45, 51-54)', roles: [UserRole.Dokter_Umum] },
  [SectionCode.Lab]: { title: 'Laboratorium (55-59)', roles: [UserRole.ATLM_Lab] },
  [SectionCode.Resume]: { title: 'Resume & Rekomendasi (60-67)', roles: [UserRole.Reviewer] },
};

// FIX: Moved CLINICAL_EVAL_FIELDS before its usage to resolve block-scoped variable error.
export const CLINICAL_EVAL_FIELDS = [
    { id: '13', label: '13. KEPALA, MUKA, LEHER, KULIT KEPALA' },
    { id: '14', label: '14. HIDUNG' },
    { id: '15', label: '15. SINUS-SINUS' },
    { id: '16', label: '16. MULUT, TENGGOROKAN, TONSIL-TONSIL' },
    { id: '17', label: '17. TELINGA' },
    { id: '18', label: '18. MEMBRANA TYMPANI' },
    { id: '19', label: '19. MATA (KEDUDUKAN, VISUS & REFRAKSI)' },
    { id: '20', label: '20. OPTHALMOSCOPY' },
    { id: '21', label: '21. PUPIL (BENTUK, REAKSI)' },
    { id: '22', label: '22. GERAKAN MATA, BIDANG PENGLIHATAN' },
    { id: '23', label: '23. DADA DAN PARU-PARU' },
    { id: '24', label: '24. JANTUNG (BESAR, FREKUENSI, IRAMA, BUNYI-BUNYI)' },
    { id: '25', label: '25. ABDOMEN & VISCERA (HERNIA)' },
    { id: '26', label: '26. ANUS-RECTUM (HAEMORRHOID) & FISTULA' },
    { id: '27', label: '27. SISTEM ENDOKRIN (TANDA-TANDA HIPER/HIPO)' },
    { id: '28', label: '28. SISTEM GENITO URINARIA' },
    { id: '29', label: '29. EXTREMITAS ATAS & BAWAH' },
    { id: '30', label: '30. OTOT-OTOT, KEKUATAN (OTOT-OTOT)' },
    { id: '31', label: '31. KAKI (BENTUK, PES PLANUS)' },
    { id: '32', label: '32. KULIT (KELAINAN-LYMPHE)' },
    { id: '33', label: '33. TULANG BELAKANG-PELVIS' },
    { id: '34', label: '34. NEUROLOGI (REFLEX, KESEIMBANGAN)' },
];


// FIX: Export MOCK_PERSONS to allow it to be imported in other files.
export const MOCK_PERSONS: Person[] = [
  { 
    id: 'p1', 
    nrp: '512345', 
    name: 'Budi Santoso', 
    rank: 'Serma', 
    unit: 'Skadron Udara 3', 
    dob: '1985-05-20',
    address: 'Jl. Rajawali No. 1, Komplek Halim P.',
    religion: 'Islam',
    gender: 'Laki-laki',
    pemberitahuan: 'Siti Aminah (Istri)'
  },
  { 
    id: 'p2', 
    nrp: '678910', 
    name: 'Agus Wijaya', 
    rank: 'Lettu Pnb', 
    unit: 'Skadron Udara 11', 
    dob: '1990-11-15',
    address: 'Jl. Merpati No. 5, Komplek Iswahyudi',
    religion: 'Kristen Protestan',
    gender: 'Laki-laki',
    pemberitahuan: 'Maria Hartono (Istri)'
  },
  { 
    id: 'p3', 
    nrp: '112233', 
    name: 'Citra Lestari', 
    rank: 'Kapten Adm', 
    unit: 'RSAU Esnawan Antariksa', 
    dob: '1988-02-10',
    address: 'Jl. Garuda No. 12, Jakarta Timur',
    religion: 'Islam',
    gender: 'Perempuan',
    pemberitahuan: 'Rian Pratama (Suami)'
  },
];

const createInitialSections = (role: UserRole): Record<SectionCode, any> => ({
    [SectionCode.Identitas]: {
        code: SectionCode.Identitas, status: SectionStatus.Draft, lastUpdated: new Date().toISOString(), updatedBy: role,
        data: { 
            maksudPemeriksaan: 'Pemeriksaan Berkala Tahunan',
            tanggalPemeriksaan: '2024-07-28',
            masaKerjaMiliter: '15 Tahun',
            masaKerjaSipil: '0 Tahun',
            anamnesis: 'Tidak ada keluhan berarti. Riwayat hipertensi terkontrol.' 
        }
    },
    [SectionCode.Klinis]: {
        code: SectionCode.Klinis, status: SectionStatus.Draft, lastUpdated: new Date().toISOString(), updatedBy: role,
        data: { 
            '13': { normal: true, abnormalDesc: '' },
            '14': { normal: true, abnormalDesc: '' },
            '24': { normal: false, abnormalDesc: 'Bunyi jantung I-II murni, regular, bising (-)' },
        }
    },
    [SectionCode.Gigi]: {
        code: SectionCode.Gigi, status: SectionStatus.Draft, lastUpdated: new Date().toISOString(), updatedBy: role,
        data: {
          odontogram: { '11': OdontogramToothState.Sehat, '26': OdontogramToothState.Karies, '46': OdontogramToothState.Hilang },
          stakes: 'II',
          catatan: {
            oklusi: 'Normal bite',
            kebersihanMulut: 'Baik',
            frekuensiSikatGigi: '2x sehari',
            kelainanDalamMulut: 'Tidak ada',
            karangGigi: 'Tidak Ada',
            diagnosaKelainan: 'Karies profunda gigi 26',
            dmf: 2,
            jumlahGigiVital: '29',
            jumlahTitikKontak: '14',
            fissureStain: 'Tidak ada'
          }
        }
    },
    [SectionCode.Vital]: {
        code: SectionCode.Vital, status: SectionStatus.Draft, lastUpdated: new Date().toISOString(), updatedBy: role,
        data: {
            beratBadan: '72',
            tinggiBadan: '175',
            bentukBadan: 'Atletis',
            tensi: '120/80',
            nadi: '72',
            temp: '36.5',
            lingkarDadaExp: '90',
            lingkarDadaInsp: '94',
            lingkarPerut: '85',
            warnaRambut: 'Hitam',
            warnaMata: 'Coklat',
            tandaIdentifikasiLain: 'Tahi lalat di pipi kanan',
        }
    },
    [SectionCode.MataTHT]: {
        code: SectionCode.MataTHT, status: SectionStatus.Draft, lastUpdated: new Date().toISOString(), updatedBy: role,
        data: {
            visusOD: '6/6', visusOS: '6/6',
            koreksiOD: '-', koreksiOS: '-',
            membedakanWarna: 'Baik',
            pemeriksaanPerimetris: 'Normal',
            tekananIntaoculairOD: 'Normal',
            tekananIntaoculairOS: 'Normal',
            suaraBisikanAS: '6m', suaraBisikanAD: '6m',
        }
    },
    [SectionCode.Penunjang]: {
        code: SectionCode.Penunjang, status: SectionStatus.Draft, lastUpdated: new Date().toISOString(), updatedBy: role,
        data: { rontgen: 'Cor dan pulmo dalam batas normal.', ecg: 'Irama sinus, normal.', pemeriksaanSpesialisLain: 'Konsul Jantung: Tidak ada kelainan' }
    },
    [SectionCode.Lab]: {
        code: SectionCode.Lab, status: SectionStatus.Draft, lastUpdated: new Date().toISOString(), updatedBy: role,
        data: {
          darah: { hb: '15.1', leuco: '7500', bse: '10', dif: 'N' },
          serologi: { hbsag: 'Non-reaktif', fdrl: 'Non-reaktif', hiv: 'Non-reaktif' },
          urine: { bj: '1.015', warna: 'Kuning jernih', prot: 'Neg', red: 'Neg', bil: 'Neg', sedimentLeuco: '0-1', sedimentEri: '0-1', sedimentKristal: 'Neg', sedimentLain: 'Neg' },
          golDarah: 'O+',
          pemeriksaanLabLainnya: 'Tidak ada'
        }
    },
    [SectionCode.Resume]: {
        code: SectionCode.Resume, status: SectionStatus.Draft, lastUpdated: new Date().toISOString(), updatedBy: role,
        data: {
          statusFisik: ['U', 'A', 'B'],
          kualifikasi: 'II',
          kodeTugas: ['MILITER BIASA'],
          resume: 'Secara umum kondisi kesehatan baik.',
          kesimpulan: 'BAIK',
          rekomendasi: 'Lanjutkan pola hidup sehat. Kontrol hipertensi secara rutin.',
          dokterPemeriksa: { nama: 'dr. Hartono', jabatan: 'Dokter Umum RSAU' },
          penanggungJawab: { nama: 'dr. Indah Permata, Sp.JP', pangkat: 'Kolonel Kes', jabatan: 'Ka. Tim Rikkes' }
        }
    }
});


const COMPLETE_EXAM_SECTIONS_CITRA = {
    [SectionCode.Identitas]: {
        code: SectionCode.Identitas, status: SectionStatus.Submitted, lastUpdated: '2024-07-30T09:00:00Z', updatedBy: UserRole.Dokter_Umum,
        data: { 
            maksudPemeriksaan: 'Pemeriksaan Rutin & Kenaikan Pangkat',
            tanggalPemeriksaan: '2024-07-29',
            masaKerjaMiliter: '14 Tahun',
            masaKerjaSipil: '0 Tahun',
            anamnesis: 'Keluhan nyeri punggung bawah hilang timbul sejak 3 bulan terakhir, terutama setelah aktivitas berat. Riwayat gastritis 1 tahun lalu, terkontrol dengan obat. Tidak ada riwayat operasi besar.' 
        }
    },
    [SectionCode.Klinis]: {
        code: SectionCode.Klinis, status: SectionStatus.Submitted, lastUpdated: '2024-07-30T09:05:00Z', updatedBy: UserRole.Dokter_Umum,
        data: Object.fromEntries(CLINICAL_EVAL_FIELDS.map(field => {
            if (field.id === '25') return [field.id, { normal: false, abnormalDesc: 'Nyeri tekan ringan regio epigastrium.' }];
            if (field.id === '33') return [field.id, { normal: false, abnormalDesc: 'Skoliosis thoracolumbal ringan.' }];
            return [field.id, { normal: true, abnormalDesc: '' }];
        }))
    },
    [SectionCode.Gigi]: {
        code: SectionCode.Gigi, status: SectionStatus.Submitted, lastUpdated: '2024-07-30T09:15:00Z', updatedBy: UserRole.Dokter_Gigi,
        data: {
          odontogram: { 
            '18': OdontogramToothState.BelumErupsi, '28': OdontogramToothState.BelumErupsi,
            '17': OdontogramToothState.Karies,
            '36': OdontogramToothState.TambalanLain,
            '47': OdontogramToothState.SisaAkar,
            '46': OdontogramToothState.Mahkota
          },
          stakes: 'II',
          catatan: {
            oklusi: 'Normal bite',
            kebersihanMulut: 'Cukup',
            frekuensiSikatGigi: '2x sehari',
            kelainanDalamMulut: 'Tidak ada',
            karangGigi: 'Ada, minimal',
            diagnosaKelainan: 'Karies media (17), Sisa akar (47) - perlu ekstraksi. Gigi 36 perlu evaluasi tambalan.',
            dmf: 5,
            jumlahGigiVital: '28',
            jumlahTitikKontak: '12',
            fissureStain: 'Ada pada gigi 37'
          }
        }
    },
    [SectionCode.Vital]: {
        code: SectionCode.Vital, status: SectionStatus.Submitted, lastUpdated: '2024-07-30T09:02:00Z', updatedBy: UserRole.Dokter_Umum,
        data: {
            beratBadan: '68', tinggiBadan: '168', bentukBadan: 'Normal',
            tensi: '115/75', nadi: '70', temp: '36.6',
            lingkarDadaExp: '86', lingkarDadaInsp: '90',
            lingkarPerut: '80', warnaRambut: 'Hitam',
            warnaMata: 'Hitam', tandaIdentifikasiLain: 'Tidak ada tanda khusus.',
        }
    },
    [SectionCode.MataTHT]: {
        code: SectionCode.MataTHT, status: SectionStatus.Submitted, lastUpdated: '2024-07-30T09:04:00Z', updatedBy: UserRole.Dokter_Umum,
        data: {
            visusOD: '6/6', visusOS: '6/6',
            koreksiOD: '-', koreksiOS: '-',
            membedakanWarna: 'Baik', pemeriksaanPerimetris: 'Normal',
            tekananIntaoculairOD: '14 mmHg',
            tekananIntaoculairOS: '14 mmHg',
            suaraBisikanAS: '5m', suaraBisikanAD: '6m',
        }
    },
    [SectionCode.Penunjang]: {
        code: SectionCode.Penunjang, status: SectionStatus.Submitted, lastUpdated: '2024-07-30T10:00:00Z', updatedBy: UserRole.Radiografer,
        data: { 
            rontgen: 'CTR < 50%. Tampak skoliosis thoracolumbalis ringan. Cor dan pulmo tidak tampak kelainan.', 
            ecg: 'Normal sinus rhythm, HR 70 bpm. Axis normal. PR interval dan QRS duration dalam batas normal.', 
            pemeriksaanSpesialisLain: 'Konsul orthopedi: Fisioterapi untuk skoliosis dan back pain.'
        }
    },
    [SectionCode.Lab]: {
        code: SectionCode.Lab, status: SectionStatus.Submitted, lastUpdated: '2024-07-30T09:45:00Z', updatedBy: UserRole.ATLM_Lab,
        data: {
          darah: { hb: '13.8', leuco: '7100', bse: '11', dif: 'N' },
          serologi: { hbsag: 'Non-reaktif', fdrl: 'Non-reaktif', hiv: 'Non-reaktif' },
          urine: { bj: '1.018', warna: 'Kuning', prot: 'Neg', red: 'Neg', bil: 'Neg', sedimentLeuco: '0-1', sedimentEri: '0-1', sedimentKristal: 'Neg', sedimentLain: 'Neg' },
          golDarah: 'B+',
          pemeriksaanLabLainnya: 'Fungsi hati (SGOT/SGPT) dalam batas normal. Gula darah sewaktu: 98 mg/dL.'
        }
    },
    [SectionCode.Resume]: {
        code: SectionCode.Resume, status: SectionStatus.Draft, lastUpdated: '2024-07-30T11:00:00Z', updatedBy: UserRole.Reviewer,
        data: {
          statusFisik: ['U', 'A', 'B'],
          kualifikasi: 'II',
          kodeTugas: ['MILITER BIASA'],
          resume: '25. Gastritis (anamnesis), nyeri tekan epigastrium.\n33. Skoliosis thoracolumbal ringan.\n35. Karies (17), Sisa Akar (47).',
          kesimpulan: 'BAIK DENGAN CATATAN',
          rekomendasi: 'Konservasi gigi 17, ekstraksi sisa akar 47. Lanjutkan fisioterapi untuk skoliosis. Kontrol gastritis bila perlu.',
          dokterPemeriksa: { nama: 'dr. Amanda Sari', jabatan: 'Dokter Pemeriksa' },
          penanggungJawab: { nama: 'dr. Hendra Wijaya, Sp.OK', pangkat: 'Kolonel Kes', jabatan: 'Kepala Lakespra' }
        }
    }
};


export const MOCK_EXAMS: Exam[] = [
  {
    id: 'exam001', personId: 'p1', purpose: 'Pemeriksaan Berkala Tahunan',
    status: ExamStatus.InProgress,
    sections: {
      ...createInitialSections(UserRole.Dokter_Umum),
      [SectionCode.Gigi]: { code: SectionCode.Gigi, status: SectionStatus.Submitted, lastUpdated: '2024-07-29T10:00:00Z', updatedBy: UserRole.Dokter_Gigi, data: createInitialSections(UserRole.Dokter_Gigi)[SectionCode.Gigi].data },
      [SectionCode.Lab]: { code: SectionCode.Lab, status: SectionStatus.Submitted, lastUpdated: '2024-07-29T11:00:00Z', updatedBy: UserRole.ATLM_Lab, data: createInitialSections(UserRole.ATLM_Lab)[SectionCode.Lab].data }
    }
  },
  {
    id: 'exam002', personId: 'p2', purpose: 'Seleksi Pendidikan',
    status: ExamStatus.PendingReview,
    sections: Object.values(SectionCode).reduce((acc, code) => {
        const role = SECTION_CONFIG[code].roles[0] || UserRole.Admin;
        acc[code] = { code, status: SectionStatus.Submitted, lastUpdated: '2024-07-29T14:00:00Z', updatedBy: role, data: createInitialSections(role)[code].data };
        return acc;
    }, {} as Record<SectionCode, any>)
  },
  {
    id: 'exam003', personId: 'p3', purpose: 'Seleksi Pendidikan Seskoau',
    status: ExamStatus.Finalized,
    sections: {
      ...COMPLETE_EXAM_SECTIONS_CITRA,
      [SectionCode.Resume]: { ...COMPLETE_EXAM_SECTIONS_CITRA[SectionCode.Resume], status: SectionStatus.Submitted }
    }
  },
];

export const MOCK_PERSON_LOOKUP: Record<string, Person> = MOCK_PERSONS.reduce((acc, person) => {
  acc[person.id] = person;
  return acc;
}, {} as Record<string, Person>);