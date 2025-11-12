
import React, { useState } from 'react';
import { Exam, Person, OdontogramToothState, ExamStatus } from '../../types';
import { CLINICAL_EVAL_FIELDS } from '../../constants';
import DownloadIcon from '../icons/DownloadIcon';
import { generateExamPdf } from '../../utils/pdfGenerator';

interface PdfPreviewProps {
  exam: Exam;
  person?: Person;
  onFinalize: () => Promise<void>;
}

const ODONTOGRAM_LEGEND_MAP: Record<OdontogramToothState, string> = {
    [OdontogramToothState.Sehat]: 'Sehat',
    [OdontogramToothState.Karies]: 'Karies',
    [OdontogramToothState.TambalanAmalgam]: 'Tambalan Amalgam',
    [OdontogramToothState.TambalanLain]: 'Tambalan Lain',
    [OdontogramToothState.Mahkota]: 'Mahkota',
    [OdontogramToothState.Hilang]: 'Hilang',
    [OdontogramToothState.SisaAkar]: 'Sisa Akar',
    [OdontogramToothState.Jembatan]: 'Jembatan',
    [OdontogramToothState.BelumErupsi]: 'Belum Erupsi',
};


const Watermark: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <p style={{ fontSize: '12rem' }} className="text-black font-black opacity-10 transform -rotate-45 select-none">
            RAHASIA
        </p>
    </div>
);

// Helper component for bordered fields
const Field = ({ label, value, className = '', children }: { label: string, value?: React.ReactNode, className?: string, children?: React.ReactNode }) => (
    <div className={`border border-black px-1 py-0 leading-tight flex flex-col ${className}`}>
        <div className="text-[8px] uppercase text-black font-bold">{label}</div>
        {value !== undefined && <div className="text-[10px] text-black font-bold flex-grow flex items-start pt-0.5">{value || <>&nbsp;</>}</div>}
        {children && <div className="flex-grow text-[10px] text-black flex items-start pt-0.5">{children}</div>}
    </div>
);


const Checkbox = ({ checked }: { checked: boolean }) => (
    <div className="w-3 h-3 border border-black flex items-center justify-center">
        {checked && <div className="w-2 h-2 bg-black" />}
    </div>
)

const OdontogramPreview = ({ data, catatan }: { data: any, catatan: any }) => {
    const layout = {
        upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
        upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
        lowerRight: [48, 47, 46, 45, 44, 43, 42, 41],
        lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
    };
    // FIX: Changed Tooth to a React.FC and made state optional to fix 'key' prop error and type mismatch.
    const Tooth: React.FC<{ id: number; state?: OdontogramToothState }> = ({ id, state }) => (
        <div className="text-center">
            <div className="w-5 h-5 border border-black flex items-center justify-center text-[10px] font-semibold text-black">{state || 'S'}</div>
            <div className="text-[9px] mt-px text-black">{id}</div>
        </div>
    );
    

    return (
        <div className="grid grid-cols-12 gap-1 text-[10px] p-1 text-black">
            <div className="col-span-8 p-1 border border-black">
                <p className="font-bold text-center text-[11px] mb-1 text-black">ODONTOGRAM RUMUS GIGI DUA ANGKA (FDI)</p>
                 <div className="grid grid-cols-2 gap-x-2">
                    <div className="flex justify-end gap-px">{layout.upperRight.map(id => <Tooth key={id} id={id} state={data?.[id]} />)}</div>
                    <div className="flex justify-start gap-px">{layout.upperLeft.map(id => <Tooth key={id} id={id} state={data?.[id]} />)}</div>
                </div>
                 <div className="grid grid-cols-2 gap-x-2 mt-2">
                    <div className="flex justify-end gap-px">{layout.lowerRight.map(id => <Tooth key={id} id={id} state={data?.[id]} />)}</div>
                    <div className="flex justify-start gap-px">{layout.lowerLeft.map(id => <Tooth key={id} id={id} state={data?.[id]} />)}</div>
                </div>
                <div className="text-[8px] mt-1 leading-tight text-black">
                    <p className="font-bold mb-px">Keterangan:</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0">
                        {Object.entries(ODONTOGRAM_LEGEND_MAP).map(([key, value]) => (
                            <span key={key} className="whitespace-nowrap">{`${key} = ${value}`}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="col-span-4 border border-black p-1 text-black">
                <p className="font-bold">KUALIFIKASI</p>
                <p>STAKES: <span className="font-bold">{catatan?.stakes || '-'}</span></p>
                <hr className="border-black my-1"/>
                <p className="font-bold">CATATAN:</p>
                <div className="font-normal space-y-px leading-tight text-[9px]">
                  <p>DMF: <span className="font-bold">{catatan?.catatan?.dmf}</span></p>
                  <p>Jml gigi vital: <span className="font-bold">{catatan?.catatan?.jumlahGigiVital}</span></p>
                  <p>Jml ttk kontak: <span className="font-bold">{catatan?.catatan?.jumlahTitikKontak}</span></p>
                  <p>Karang gigi: <span className="font-bold">{catatan?.catatan?.karangGigi}</span></p>
                  <p>Fissure stain: <span className="font-bold">{catatan?.catatan?.fissureStain}</span></p>
                  <p>Kelainan mulut: <span className="font-bold">{catatan?.catatan?.kelainanDalamMulut}</span></p>
                  <p>Kebersihan mulut: <span className="font-bold">{catatan?.catatan?.kebersihanMulut}</span></p>
                  <p>Diagnosa/Kelainan:</p>
                  <p className="font-bold whitespace-pre-wrap">{catatan?.catatan?.diagnosaKelainan}</p>
                </div>
            </div>
        </div>
    );
};

// FIX: Changed StatusBox to a React.FC to fix 'key' prop error.
const StatusBox: React.FC<{ label: string, checked: boolean }> = ({ label, checked }) => (
    <div className="flex items-center space-x-1">
        <div className={`w-4 h-4 border border-black text-center leading-tight font-bold text-[11px] flex items-center justify-center ${checked ? 'bg-black text-white' : 'text-black'}`}>{label}</div>
    </div>
);


const PdfPreview: React.FC<PdfPreviewProps> = ({ exam, person, onFinalize }) => {
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const s = exam.sections;
  const p = person;

  if (!p) return <div className="text-center">Loading person data...</div>;

  const handleFinalize = async () => {
      setIsFinalizing(true);
      setFeedback({ message: 'Memfinalisasi laporan...', type: 'info' });
      try {
          await onFinalize();
          setFeedback({ message: 'Laporan berhasil difinalisasi.', type: 'success' });
      } catch (error) {
          console.error("Failed to finalize exam:", error);
          setFeedback({ message: `Gagal memfinalisasi: ${(error as Error).message}`, type: 'error' });
      } finally {
          setIsFinalizing(false);
      }
  };

  const handleDownloadPdf = async () => {
      // The person object 'p' is checked for existence at the top of the component
      setIsDownloading(true);
      setFeedback({ message: 'Preparing PDF for download...', type: 'info' });

      try {
          await generateExamPdf(p!); // Use non-null assertion as 'p' is guaranteed to exist
          setFeedback({ message: 'Download started!', type: 'success' });
      } catch (error) {
          console.error("Error generating PDF:", error);
          const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
          setFeedback({ message: `Failed to generate PDF: ${errorMessage}`, type: 'error' });
      } finally {
          setIsDownloading(false);
      }
  };


  return (
    <div className="bg-gray-200 p-8 font-serif">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-xl font-bold text-tni-au-dark">Preview Laporan PDF</h3>
                <p className="text-gray-600">Ini adalah tampilan pratinjau dari dokumen PDF yang akan dihasilkan.</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
                 <div className="flex items-center space-x-3">
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isDownloading || isFinalizing}
                        className="flex items-center justify-center bg-tni-au hover:bg-tni-au-dark text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        {isDownloading ? 'Membuat PDF...' : 'Download PDF'}
                    </button>
                    {exam.status !== ExamStatus.Finalized && (
                        <button
                            onClick={handleFinalize}
                            disabled={isDownloading || isFinalizing}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isFinalizing ? 'Memfinalisasi...' : 'Finalisasi & Kunci Laporan'}
                        </button>
                    )}
                </div>

                {feedback && (
                    <p className={`text-sm font-semibold ${
                        feedback.type === 'success' ? 'text-green-700' :
                        feedback.type === 'error' ? 'text-red-600' :
                        'text-gray-700'
                    }`}>
                        {feedback.message}
                    </p>
                )}
                 {exam.status === ExamStatus.Finalized && !feedback && (
                    <p className="text-sm font-semibold text-green-700">
                        Laporan ini telah difinalisasi.
                    </p>
                )}
            </div>
        </div>

        {/* Page 1 */}
        <div id="pdf-page-1" className="bg-white shadow-lg p-10 mb-8 relative" style={{ width: '210mm', minHeight: '297mm', margin: 'auto' }}>
            <Watermark />
            <div className="relative z-10 text-black">
                <div className="text-center">
                    <p className="font-bold text-sm text-black">RAHASIA</p>
                    <h1 className="text-lg font-bold text-black">MARKAS BESAR ANGKATAN UDARA</h1>
                    <h2 className="text-lg font-bold text-black">DINAS KESEHATAN</h2>
                    <hr className="border-black my-2 border-2" />
                    <h3 className="text-md font-bold underline text-black">LAPORAN PEMERIKSAAN KESEHATAN BERKALA</h3>
                    <h3 className="text-md font-bold text-black">ANGGOTA TNI ANGKATAN UDARA</h3>
                </div>

                <div className="mt-4 grid grid-cols-12 gap-px text-xs">
                    <Field className="col-span-4 min-h-[32px]" label="1. NAMA LENGKAP" value={p.name} />
                    <Field className="col-span-4 min-h-[32px]" label="2. PANGKAT / NRP" value={`${p.rank} / ${p.nrp}`} />
                    <Field className="col-span-4 min-h-[32px]" label="3. MAKSUD PEMERIKSAAN" value={s.identitas.data.maksudPemeriksaan} />
                    <Field className="col-span-4 min-h-[32px]" label="4. TEMPAT / TGL. LAHIR" value={p.dob} />
                    <Field className="col-span-4 min-h-[32px]" label="5. KESATUAN / JABATAN" value={p.unit} />
                    <Field className="col-span-4 min-h-[32px]" label="6. TEMPAT TGL PEMERIKSAAN" value={s.identitas.data.tanggalPemeriksaan} />
                    <Field className="col-span-8 min-h-[32px]" label="7. ALAMAT RUMAH" value={p.address} />
                    <Field className="col-span-4 min-h-[32px]" label="8. AGAMA / SUKU" value={p.religion} />
                    <Field className="col-span-4 min-h-[32px]" label="9. NAMA AYAH/IBU/WALI/PEMBERITAHUAN" value={p.pemberitahuan} />
                    <Field className="col-span-2 min-h-[32px]" label="10. JENIS KELAMIN" value={p.gender} />
                    <Field className="col-span-3 min-h-[32px]" label="11. MASA KERJA DI MILITER" value={s.identitas.data.masaKerjaMiliter} />
                    <Field className="col-span-3 min-h-[32px]" label="11. SIPIL" value={s.identitas.data.masaKerjaSipil} />
                </div>
                
                <Field className="mt-px min-h-[36px]" label="12. ANAMNESA" value={<div className="whitespace-pre-wrap text-[11px]">{s.identitas.data.anamnesis}</div>} />

                <div className="border border-black mt-px text-[10px] text-black">
                    <div className="grid grid-cols-[30px_30px_30px_1fr] text-center font-bold">
                        <div className="border-r border-black px-1 py-0.5">NOR</div>
                        <div className="border-r border-black px-1 py-0.5">MAL</div>
                        <div className="border-r border-black px-1 py-0.5">AB-MAL</div>
                        <div className="px-1 py-0.5 text-left">TULISAN HASIL PEMERIKSAAN YANG ABNORMAL SECARA DETAIL SESUAI DENGAN NOMOR</div>
                    </div>
                     {CLINICAL_EVAL_FIELDS.map(f => {
                         const data = s.klinis.data[f.id] || { normal: true, abnormalDesc: '' };
                         return (
                            <div key={f.id} className="grid grid-cols-[30px_30px_30px_1fr] border-t border-black items-stretch min-h-[15px]">
                                <div className="border-r border-black px-1 py-0.5 text-center font-bold text-[8px] flex items-center justify-center">{f.id}</div>
                                <div className="border-r border-black px-1 py-0.5 flex justify-center items-center"><Checkbox checked={data.normal}/></div>
                                <div className="border-r border-black px-1 py-0.5 flex justify-center items-center"><Checkbox checked={!data.normal}/></div>
                                <div className="px-1 py-0.5 font-bold text-black text-left flex items-center">{data.abnormalDesc || <>&nbsp;</>}</div>
                            </div>
                         )
                     })}
                </div>
                
                <div className="border-l border-r border-b border-black mt-px text-black">
                     <div className="px-1 py-0.5 text-sm font-bold text-black border-b border-black">35. GIGI & ODONTOGRAM</div>
                     <OdontogramPreview data={s.gigi.data.odontogram} catatan={s.gigi.data} />
                </div>


                <p className="text-center font-bold mt-4 text-sm text-black">RAHASIA</p>
            </div>
        </div>
        
        {/* Page 2 */}
        <div id="pdf-page-2" className="bg-white shadow-lg p-10 relative" style={{ width: '210mm', minHeight: '297mm', margin: 'auto' }}>
            <Watermark />
            <div className="relative z-10 text-black text-sm">
                 <p className="text-center font-bold text-sm">RAHASIA</p>
                 <div className="mt-4 grid grid-cols-3 gap-px">
                     <Field className="h-20" label="36. RONTGEN" value={<div className="whitespace-pre-wrap text-[11px]">{s.penunjang.data.rontgen}</div>} />
                     <Field className="h-20" label="37. ECG" value={<div className="whitespace-pre-wrap text-[11px]">{s.penunjang.data.ecg}</div>} />
                     <Field className="h-20" label="38. PEMERIKSAAN SPESIALISTIS LAIN" value={<div className="whitespace-pre-wrap text-[11px]">{s.penunjang.data.pemeriksaanSpesialisLain}</div>} />
                 </div>
                 <p className="text-center font-bold mt-2 mb-0.5 text-sm">UKURAN-UKURAN DAN PEMERIKSAAN LAIN</p>
                 <div className="grid grid-cols-12 gap-px text-[10px]">
                    <Field className="col-span-3 h-8" label="39. BERAT BADAN :" value={`${s.vital.data.beratBadan} kg`} />
                    <Field className="col-span-3 h-8" label="40. TINGGI BADAN :" value={`${s.vital.data.tinggiBadan} cm`} />
                    <Field className="col-span-3 h-8" label="41. BENTUK BADAN :" value={s.vital.data.bentukBadan} />
                    <Field className="col-span-3 h-8" label="42. TENSI" value={s.vital.data.tensi} />

                    <Field className="col-span-3 h-8" label="43. NADI" value={`${s.vital.data.nadi} x/m`} />
                    <Field className="col-span-3 h-8" label="44. TEMP" value={`${s.vital.data.temp} °C`} />
                    <Field className="col-span-6 h-8" label="46. LINGKARAN DADA :" value={`Exp: ${s.vital.data.lingkarDadaExp} cm Ins: ${s.vital.data.lingkarDadaInsp} cm`} />
                    
                    <Field className="col-span-3 h-8" label="47. LINGKARAN PERUT :" value={`${s.vital.data.lingkarPerut} cm`} />
                    <Field className="col-span-3 h-8" label="48. WARNA RAMBUT :" value={s.vital.data.warnaRambut} />
                    <Field className="col-span-3 h-8" label="49. WARNA MATA" value={s.vital.data.warnaMata} />
                    <Field className="col-span-3 h-8" label="51. MEMBEDAKAN WARNA" value={s.mata_tht.data.membedakanWarna} />
                    
                    <Field className="col-span-12 h-8" label="50. TANDA-TANDA IDENTIFIKASI LAIN :" value={s.vital.data.tandaIdentifikasiLain} />

                    <Field className="col-span-3 h-8" label="45. VISUS">
                        <div className="grid grid-cols-2 font-bold w-full">
                            <div>OD: {s.mata_tht.data.visusOD}</div>
                            <div>OS: {s.mata_tht.data.visusOS}</div>
                        </div>
                    </Field>
                    <Field className="col-span-3 h-8" label="KOREKSI SAMPAI">
                         <div className="grid grid-cols-2 font-bold w-full">
                            <div>OD: {s.mata_tht.data.koreksiOD}</div>
                            <div>OS: {s.mata_tht.data.koreksiOS}</div>
                        </div>
                    </Field>
                    <Field className="col-span-6 h-8" label="54. SUARA BISIKAN">
                         <div className="grid grid-cols-2 font-bold w-full">
                            <div>AD: {s.mata_tht.data.suaraBisikanAD}</div>
                            <div>AS: {s.mata_tht.data.suaraBisikanAS}</div>
                        </div>
                    </Field>
                    <Field className="col-span-6 h-8" label="52. PEMERIKSAAN PERIMETRIS" value={s.mata_tht.data.pemeriksaanPerimetris} />
                    <Field className="col-span-6 h-8" label="53. TEKANAN INTRAOCULAIR (IOP)">
                        <div className="grid grid-cols-2 font-bold w-full">
                           <div>OD: {s.mata_tht.data.tekananIntaoculairOD}</div>
                           <div>OS: {s.mata_tht.data.tekananIntaoculairOS}</div>
                        </div>
                    </Field>
                 </div>

                 <div className="grid grid-cols-12 gap-px mt-2 text-[10px]">
                     <Field className="col-span-4 h-16" label="56. DARAH">
                        <div className="font-bold space-y-px text-[10px]">
                            <p>HB: {s.lab.data.darah?.hb}</p>
                            <p>LEUCO: {s.lab.data.darah?.leuco}</p>
                            <p>B.S.E.: {s.lab.data.darah?.bse}</p>
                            <p>DIF: {s.lab.data.darah?.dif}</p>
                        </div>
                     </Field>
                      <Field className="col-span-4 h-16" label="57. SEROLOGI">
                        <div className="font-bold space-y-px text-[10px]">
                            <p>Hbs Ag: {s.lab.data.serologi?.hbsag}</p>
                            <p>FDRL: {s.lab.data.serologi?.fdrl}</p>
                            <p>HIV: {s.lab.data.serologi?.hiv}</p>
                        </div>
                     </Field>
                     <Field className="col-span-4 row-span-2" label="55. URINE">
                        <div className="grid grid-cols-2 font-bold text-[10px]">
                           <div>
                                <p>BJ: {s.lab.data.urine?.bj}</p>
                                <p>WARNA: {s.lab.data.urine?.warna}</p>
                                <p>PROT: {s.lab.data.urine?.prot}</p>
                                <p>RED: {s.lab.data.urine?.red}</p>
                                <p>BIL: {s.lab.data.urine?.bil}</p>
                           </div>
                           <div>
                                <p className="underline">SEDIMENT:</p>
                                <p>LEUCO: {s.lab.data.urine?.sedimentLeuco}</p>
                                <p>ERI: {s.lab.data.urine?.sedimentEri}</p>
                                <p>KRISTAL: {s.lab.data.urine?.sedimentKristal}</p>
                                <p>LAIN-LAIN: {s.lab.data.urine?.sedimentLain}</p>
                           </div>
                        </div>
                     </Field>
                     <Field className="col-span-4 h-16" label="58. GOL DARAH" value={s.lab.data.golDarah} />
                     <Field className="col-span-4 h-16" label="59. PEMERIKSAAN LABORATORIUM LAINNYA" value={s.lab.data.pemeriksaanLabLainnya} />
                 </div>
                 
                 <div className="grid grid-cols-12 gap-px mt-2">
                    <Field className="col-span-5" label="60. STATUS FISIK">
                        <div className="flex space-x-2 font-bold text-sm pt-1">
                            {['U','A','B','D','L','G','J'].map(st => <StatusBox key={st} label={st} checked={(s.resume.data.statusFisik || []).includes(st)} />)}
                        </div>
                    </Field>
                    <Field className="col-span-3" label="61. KUALIFIKASI">
                         <div className="flex space-x-2 font-bold text-sm pt-1">
                            {['I','II','III','IV'].map(k => <StatusBox key={k} label={k} checked={s.resume.data.kualifikasi === k} />)}
                        </div>
                    </Field>
                    <Field className="col-span-4" label="62. KODE TUGAS">
                        <div className="grid grid-cols-2 text-[9px] gap-1 font-bold pt-1">
                            <div><Checkbox checked={(s.resume.data.kodeTugas || []).includes('PINBANG AKTIF')} /> PINBANG AKTIF</div>
                            <div><Checkbox checked={(s.resume.data.kodeTugas || []).includes('AP. LAIN')} /> AP. LAIN</div>
                            <div><Checkbox checked={(s.resume.data.kodeTugas || []).includes('PASUKAN KHUSUS')} /> PASUKAN KHUSUS</div>
                            <div><Checkbox checked={(s.resume.data.kodeTugas || []).includes('MILITER BIASA')} /> MILITER BIASA</div>
                            <div><Checkbox checked={(s.resume.data.kodeTugas || []).includes('SIPIL')} /> SIPIL</div>
                        </div>
                    </Field>
                 </div>

                 <Field className="mt-2 h-24" label="63. RESUME (Tulis Kelainan / Diagnosis / Stakes sesuai nomor)" value={<div className="whitespace-pre-wrap text-[11px]">{s.resume.data.resume}</div>} />
                 <Field className="mt-px" label="64. KESIMPULAN" value={s.resume.data.kesimpulan} />
                 <Field className="mt-2 h-24" label="65. REKOMENDASI (Tindak lanjut, Follow Up, Disposisi Aeromedis)" value={<div className="whitespace-pre-wrap text-[11px]">{s.resume.data.rekomendasi}</div>} />

                 <div className="grid grid-cols-2 gap-px mt-2 text-sm text-black">
                     <div className="border border-black p-1 text-center">
                        <p>66. DOKTER YANG MEMERIKSA:</p>
                        <div className="h-10" />
                        <p className="font-bold underline">{s.resume.data.dokterPemeriksa?.nama}</p>
                        <p>Jabatan: {s.resume.data.dokterPemeriksa?.jabatan}</p>
                     </div>
                     <div className="border border-black p-1 text-center">
                        <p>67. DISYAHKAN / DIKETAHUI OLEH:</p>
                        <div className="h-10" />
                        <p className="font-bold underline">{s.resume.data.penanggungJawab?.nama}</p>
                        <p>Pangkat: {s.resume.data.penanggungJawab?.pangkat}</p>
                        <p>Jabatan: {s.resume.data.penanggungJawab?.jabatan}</p>
                     </div>
                 </div>

                 <p className="text-center font-bold mt-4 text-sm text-black">RAHASIA</p>
            </div>
        </div>
    </div>
  );
};

export default PdfPreview;
