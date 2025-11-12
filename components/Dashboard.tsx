
import React, { useState, useMemo } from 'react';
// FIX: Import ExamSection to resolve type error in filter.
import { Exam, ExamStatus, SectionStatus, UserRole, Person, SectionCode, ExamSection } from '../types';
import LoadingSpinner from './shared/LoadingSpinner';
import SearchIcon from './icons/SearchIcon';
import PlusIcon from './icons/PlusIcon';
import AddPersonelModal from './shared/AddPersonelModal';

interface DashboardProps {
  exams: Exam[];
  onSelectExam: (examId: string) => void;
  loading: boolean;
  userRole: UserRole;
  personLookup: Record<string, Person>;
  onAddPersonel: (personData: Omit<Person, 'id'>, purpose: string) => Promise<void>;
}

const getStatusChipStyle = (status: ExamStatus) => {
  switch (status) {
    case ExamStatus.InProgress: return 'bg-blue-100 text-blue-800 border-blue-200';
    case ExamStatus.PendingReview: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case ExamStatus.Finalized: return 'bg-green-100 text-green-800 border-green-200';
    case ExamStatus.RevisionNeeded: return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const ExamCard: React.FC<{ exam: Exam; onSelectExam: (examId: string) => void; person?: Person }> = ({ exam, onSelectExam, person }) => {
    const totalSections = Object.keys(exam.sections).length;
    // FIX: Explicitly type 's' as ExamSection to resolve 'unknown' type error.
    const submittedSections = Object.values(exam.sections).filter((s: ExamSection) => s.status === SectionStatus.Submitted).length;
    const progress = totalSections > 0 ? Math.round((submittedSections / totalSections) * 100) : 0;

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
            <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-tni-au-dark">{person?.name}</h3>
                        <p className="text-sm text-gray-500">NRP: {person?.nrp}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusChipStyle(exam.status)}`}>
                        {exam.status}
                    </span>
                </div>
            </div>
            <div className="p-5 space-y-3 flex-grow">
                <p className="text-sm text-gray-600"><span className="font-semibold">Pangkat:</span> {person?.rank}</p>
                <p className="text-sm text-gray-600"><span className="font-semibold">Satuan:</span> {person?.unit}</p>
                <p className="text-sm text-gray-600"><span className="font-semibold">Tujuan:</span> {exam.purpose}</p>
            </div>
            <div className="px-5 py-4 bg-gray-50/70 rounded-b-xl">
                 <div className="mb-2">
                    <div className="flex justify-between text-sm font-medium text-tni-au-dark">
                        <span>Progres</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-tni-au-light rounded-full h-2.5 mt-1">
                        <div className="bg-tni-au h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <button onClick={() => onSelectExam(exam.id)} className="w-full mt-4 text-center bg-tni-au hover:bg-tni-au-dark text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                    Lihat Detail
                </button>
            </div>
        </div>
    );
}

const Dashboard: React.FC<DashboardProps> = ({ exams, onSelectExam, loading, userRole, personLookup, onAddPersonel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExamStatus | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const filteredExams = useMemo(() => {
    let filtered = exams;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(exam => exam.status === statusFilter);
    }
    
    // Apply date range filter (uses YYYY-MM-DD string comparison)
    if (startDate || endDate) {
      filtered = filtered.filter(exam => {
        const examDateStr = exam.sections[SectionCode.Identitas]?.data?.tanggalPemeriksaan;
        if (!examDateStr) return false;

        let pass = true;
        if (startDate && examDateStr < startDate) {
          pass = false;
        }
        if (endDate && examDateStr > endDate) {
          pass = false;
        }
        return pass;
      });
    }

    // Then apply search term filter
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(exam => {
            const person = personLookup[exam.personId];
            return person?.name.toLowerCase().includes(term) || person?.nrp.toLowerCase().includes(term);
        });
    }
    return filtered;
  }, [exams, searchTerm, statusFilter, startDate, endDate, personLookup]);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
  }

  const roleName = userRole.replace('_', ' ');

  return (
    <>
    <AddPersonelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPersonel={onAddPersonel}
    />
    <div className="space-y-8">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-bold text-tni-au-dark">Dashboard Pemeriksaan</h2>
                <p className="mt-1 text-gray-600">Menampilkan semua data pemeriksaan yang relevan untuk Anda sebagai <span className="capitalize font-semibold">{roleName}</span>.</p>
            </div>
             {userRole === UserRole.Admin && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center bg-tni-au hover:bg-tni-au-dark text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Tambah Personel Baru
                </button>
            )}
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-end">
                {/* Status Filter */}
                <div className="xl:col-span-1">
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                        Filter Status
                    </label>
                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as ExamStatus | 'all')}
                        className="mt-1 w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-tni-au focus:border-tni-au sm:text-sm rounded-lg shadow-sm"
                    >
                        <option value="all">Semua Status</option>
                        {Object.values(ExamStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                {/* Start Date Filter */}
                <div>
                    <label htmlFor="start-date-filter" className="block text-sm font-medium text-gray-700">
                        Dari Tanggal
                    </label>
                    <input type="date" id="start-date-filter" value={startDate} onChange={e => setStartDate(e.target.value)} max={endDate}
                        className="mt-1 w-full px-3 py-3 text-base border-gray-300 focus:outline-none focus:ring-tni-au focus:border-tni-au sm:text-sm rounded-lg shadow-sm"
                    />
                </div>
                 {/* End Date Filter */}
                <div>
                    <label htmlFor="end-date-filter" className="block text-sm font-medium text-gray-700">
                        Sampai Tanggal
                    </label>
                     <input type="date" id="end-date-filter" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate}
                        className="mt-1 w-full px-3 py-3 text-base border-gray-300 focus:outline-none focus:ring-tni-au focus:border-tni-au sm:text-sm rounded-lg shadow-sm"
                    />
                </div>
                {/* Search Bar */}
                <div className="md:col-span-2 xl:col-span-2">
                    <label htmlFor="search-input" className="block text-sm font-medium text-gray-700">
                        Cari Nama / NRP
                    </label>
                    <div className="mt-1 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="search-input"
                            placeholder="Ketik untuk mencari..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-tni-au"
                        />
                    </div>
                </div>
                {/* Reset Button */}
                <div>
                    <button onClick={handleResetFilters}
                        className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-tni-au"
                    >
                        Reset Filter
                    </button>
                </div>
            </div>
        </div>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredExams.length > 0 ? (
            filteredExams.map(exam => <ExamCard key={exam.id} exam={exam} onSelectExam={onSelectExam} person={personLookup[exam.personId]} />)
        ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">Tidak Ditemukan</h3>
                <p className="text-gray-500 mt-2">Tidak ada data pemeriksaan yang cocok dengan filter atau pencarian Anda.</p>
            </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Dashboard;
