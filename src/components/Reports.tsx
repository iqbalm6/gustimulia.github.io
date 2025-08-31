import React, { useState } from 'react';
import { Download, Filter, BarChart3, Users, TrendingUp } from 'lucide-react';
import { Employee, Evaluation } from '../types';

interface ReportsProps {
  employees: Employee[];
  evaluations: Evaluation[];
}

const Reports: React.FC<ReportsProps> = ({ employees, evaluations }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  const periods = Array.from(new Set(evaluations.map(evaluation => evaluation.period)));

  const filteredEvaluations = evaluations.filter(evaluation => {
    const employee = employees.find(emp => emp.id === evaluation.employeeId);
    const matchesDepartment = !selectedDepartment || employee?.department === selectedDepartment;
    const matchesPeriod = !selectedPeriod || evaluation.period === selectedPeriod;
    return matchesDepartment && matchesPeriod;
  });

  const averageByDepartment = departments.map(dept => {
    const deptEmployees = employees.filter(emp => emp.department === dept);
    const deptEvaluations = filteredEvaluations.filter(evaluation => {
      const employee = employees.find(emp => emp.id === evaluation.employeeId);
      return employee?.department === dept;
    });
    
    const avgScore = deptEvaluations.length > 0
      ? deptEvaluations.reduce((sum, evaluation) => sum + evaluation.finalScore, 0) / deptEvaluations.length
      : 0;

    return {
      department: dept,
      employeeCount: deptEmployees.length,
      evaluationCount: deptEvaluations.length,
      averageScore: avgScore
    };
  });

  const topPerformers = filteredEvaluations
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 5)
    .map(evaluation => ({
      ...evaluation,
      employee: employees.find(emp => emp.id === evaluation.employeeId)
    }));

  const handleExport = () => {
    const csvContent = [
      ['Nama', 'Departemen', 'Periode', 'Produktivitas', 'Kualitas', 'Kerjasama', 'Ketepatan', 'Inisiatif', 'Skor Akhir', 'Status'],
      ...filteredEvaluations.map(evaluation => {
        const employee = employees.find(emp => emp.id === evaluation.employeeId);
        return [
          employee?.name || '',
          employee?.department || '',
          evaluation.period,
          evaluation.scores.productivity,
          evaluation.scores.quality,
          evaluation.scores.teamwork,
          evaluation.scores.punctuality,
          evaluation.scores.initiative,
          evaluation.finalScore,
          evaluation.status
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laporan-evaluasi-kinerja.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan Evaluasi</h1>
          <p className="text-gray-600 mt-2">Analisis dan laporan hasil penilaian kinerja</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Export Laporan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Evaluasi</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{filteredEvaluations.length}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rata-rata Skor</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {filteredEvaluations.length > 0 
                  ? (filteredEvaluations.reduce((sum, evaluation) => sum + evaluation.finalScore, 0) / filteredEvaluations.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Performa Baik</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {filteredEvaluations.filter(evaluation => evaluation.finalScore >= 8).length}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Perlu Perbaikan</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {filteredEvaluations.filter(evaluation => evaluation.finalScore < 6).length}
              </p>
            </div>
            <Filter className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Laporan</h3>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departemen</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Departemen</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Periode</option>
                {periods.map(period => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.employee?.name}</p>
                    <p className="text-sm text-gray-600">{item.employee?.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-green-600">{item.finalScore.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{item.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rata-rata Skor per Departemen</h3>
        <div className="space-y-4">
          {averageByDepartment.map((dept) => (
            <div key={dept.department} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({dept.evaluationCount} evaluasi dari {dept.employeeCount} karyawan)
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">{dept.averageScore.toFixed(1)}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(dept.averageScore / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;