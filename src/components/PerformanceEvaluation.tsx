import React, { useState } from 'react';
import { Plus, Search, Star, Calendar, ClipboardCheck } from 'lucide-react';
import { Employee, Evaluation } from '../types';
import EvaluationModal from './EvaluationModal';

interface PerformanceEvaluationProps {
  employees: Employee[];
  evaluations: Evaluation[];
  setEvaluations: (evaluations: Evaluation[]) => void;
}

const PerformanceEvaluation: React.FC<PerformanceEvaluationProps> = ({ 
  employees, 
  evaluations, 
  setEvaluations 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEvaluations = evaluations.filter(evaluation => {
    const employee = employees.find(emp => emp.id === evaluation.employeeId);
    return employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           employee?.department.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleNewEvaluation = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const handleSaveEvaluation = (evaluationData: Omit<Evaluation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvaluation: Evaluation = {
      ...evaluationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEvaluations([...evaluations, newEvaluation]);
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
      submitted: { label: 'Disubmit', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Disetujui', color: 'bg-green-100 text-green-800' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Penilaian Kinerja</h1>
          <p className="text-gray-600 mt-2">Kelola evaluasi kinerja karyawan</p>
        </div>
        <button
          onClick={handleNewEvaluation}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Buat Evaluasi Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari evaluasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Karyawan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Periode</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Skor Akhir</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEvaluations.map((evaluation) => {
                const employee = employees.find(emp => emp.id === evaluation.employeeId);
                return (
                  <tr key={evaluation.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {employee?.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{employee?.name}</p>
                          <p className="text-sm text-gray-500">{employee?.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {evaluation.period}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2 text-yellow-400" />
                        <span className={`font-bold text-lg px-2 py-1 rounded ${getScoreColor(evaluation.finalScore)}`}>
                          {evaluation.finalScore}/10
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(evaluation.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(evaluation.createdAt).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredEvaluations.length === 0 && (
          <div className="p-8 text-center">
            <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada evaluasi yang tersedia</p>
          </div>
        )}
      </div>

      {showModal && (
        <EvaluationModal
          employees={employees}
          onSave={handleSaveEvaluation}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PerformanceEvaluation;