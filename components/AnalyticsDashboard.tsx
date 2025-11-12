
import React, { useMemo, useEffect, useRef } from 'react';
import { Exam, Person, ExamStatus, SectionCode } from '../types';
import { CLINICAL_EVAL_FIELDS } from '../constants';

declare const Chart: any;

interface AnalyticsDashboardProps {
  exams: Exam[];
  personLookup: Record<string, Person>;
}

const StatCard: React.FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-2 text-3xl font-bold text-tni-au-dark">{value}</p>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-tni-au-dark mb-4">{title}</h3>
        <div className="h-80">{children}</div>
    </div>
);

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ exams, personLookup }) => {
    
    const analyticsData = useMemo(() => {
        if (exams.length === 0) {
            return {
                totalExams: 0,
                inProgressExams: 0,
                finalizedExams: 0,
                avgCompletionDays: 0,
                healthStatusCounts: {},
                topAbnormalFindings: [],
                statusByUnit: {},
            };
        }

        const finalized = exams.filter(e => e.status === ExamStatus.Finalized);
        
        // Avg Completion Time
        let totalDays = 0;
        finalized.forEach(exam => {
            const startDateStr = exam.sections[SectionCode.Identitas]?.data?.tanggalPemeriksaan;
            const endDateStr = exam.sections[SectionCode.Resume]?.lastUpdated;
            if (startDateStr && endDateStr) {
                const start = new Date(startDateStr).getTime();
                const end = new Date(endDateStr).getTime();
                if (!isNaN(start) && !isNaN(end)) {
                    // FIX: Use numeric timestamps from .getTime() for the calculation to prevent type errors when subtracting dates.
                    totalDays += (end - start) / (1000 * 60 * 60 * 24);
                }
            }
        });

        // Health Status Counts
        const healthStatusCounts = exams.reduce((acc, exam) => {
            const conclusion = exam.sections.resume?.data?.kesimpulan;
            if (conclusion) {
                acc[conclusion] = (acc[conclusion] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        // Top Abnormal Findings
        const abnormalFindings = exams.flatMap(exam =>
            Object.entries(exam.sections.klinis?.data || {})
        )
        .filter(([, finding]) => !(finding as any).normal)
        .map(([id]) => CLINICAL_EVAL_FIELDS.find(f => f.id === id)?.label || 'Unknown')
        .reduce((acc, label) => {
            acc[label] = (acc[label] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const topAbnormalFindings = Object.entries(abnormalFindings)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
            
        // Status by Unit
        const statusByUnit = exams.reduce((acc, exam) => {
            const unit = personLookup[exam.personId]?.unit || 'Unknown';
            const conclusion = exam.sections.resume?.data?.kesimpulan;
            if (!acc[unit]) {
                acc[unit] = { 'BAIK': 0, 'BAIK DENGAN CATATAN': 0, 'TIDAK BAIK': 0 };
            }
            if (conclusion && acc[unit][conclusion] !== undefined) {
                acc[unit][conclusion]++;
            }
            return acc;
        }, {} as Record<string, Record<string, number>>);


        return {
            totalExams: exams.length,
            inProgressExams: exams.filter(e => e.status === ExamStatus.InProgress).length,
            finalizedExams: finalized.length,
            avgCompletionDays: finalized.length > 0 ? Math.round(totalDays / finalized.length) : 0,
            healthStatusCounts,
            topAbnormalFindings,
            statusByUnit
        };
    }, [exams, personLookup]);

    const statusChartRef = useRef<HTMLCanvasElement>(null);
    const findingsChartRef = useRef<HTMLCanvasElement>(null);
    const unitChartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const charts: any[] = [];
        // Health Status Chart (Pie)
        if (statusChartRef.current && Object.keys(analyticsData.healthStatusCounts).length > 0) {
            const ctx = statusChartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(analyticsData.healthStatusCounts),
                    datasets: [{
                        data: Object.values(analyticsData.healthStatusCounts),
                        backgroundColor: ['#2E7D32', '#F9A825', '#C62828'],
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }}}
            });
            charts.push(chart);
        }

        // Top Abnormal Findings Chart (Bar)
        if (findingsChartRef.current && analyticsData.topAbnormalFindings.length > 0) {
            const ctx = findingsChartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: analyticsData.topAbnormalFindings.map(f => f[0].split('. ')[1]),
                    datasets: [{
                        label: 'Jumlah Kasus',
                        data: analyticsData.topAbnormalFindings.map(f => f[1]),
                        backgroundColor: '#00529B',
                    }]
                },
                options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }}}
            });
            charts.push(chart);
        }
        
        // Status by Unit Chart (Bar)
        if (unitChartRef.current && Object.keys(analyticsData.statusByUnit).length > 0) {
            const ctx = unitChartRef.current.getContext('2d');
            const labels = Object.keys(analyticsData.statusByUnit);
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        { label: 'BAIK', data: labels.map(l => analyticsData.statusByUnit[l]['BAIK']), backgroundColor: '#2E7D32' },
                        { label: 'BAIK DENGAN CATATAN', data: labels.map(l => analyticsData.statusByUnit[l]['BAIK DENGAN CATATAN']), backgroundColor: '#F9A825' },
                        { label: 'TIDAK BAIK', data: labels.map(l => analyticsData.statusByUnit[l]['TIDAK BAIK']), backgroundColor: '#C62828' },
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true }}}
            });
            charts.push(chart);
        }

        return () => charts.forEach(chart => chart.destroy());
    }, [analyticsData]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-tni-au-dark">Dashboard Analitik</h2>
        <p className="mt-1 text-gray-600">Ringkasan data dari seluruh pemeriksaan kesehatan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Total Pemeriksaan" value={analyticsData.totalExams} description="Jumlah total laporan" />
          <StatCard title="Laporan In Progress" value={analyticsData.inProgressExams} description="Laporan yang masih berjalan" />
          <StatCard title="Laporan Final" value={analyticsData.finalizedExams} description="Laporan yang telah selesai" />
          <StatCard title="Rata-rata Waktu Penyelesaian" value={`${analyticsData.avgCompletionDays} hari`} description="Dari periksa hingga final" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ChartCard title="Distribusi Status Kesehatan">
              <canvas ref={statusChartRef}></canvas>
          </ChartCard>
          <ChartCard title="5 Temuan Abnormal Paling Umum">
              <canvas ref={findingsChartRef}></canvas>
          </ChartCard>
          <div className="xl:col-span-2">
            <ChartCard title="Status Kesehatan per Kesatuan">
                <canvas ref={unitChartRef}></canvas>
            </ChartCard>
          </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
