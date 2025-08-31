import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Employee, Evaluation } from '../types';

interface EvaluationModalProps {
  employees: Employee[];
  onSave: (evaluation: Omit<Evaluation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({ employees, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    evaluatorId: '1',
    period: '',
    scores: {
      productivity: 0,
      quality: 0,
      teamwork: 0,
      punctuality: 0,
      initiative: 0
    },
    comments: '',
    status: 'draft' as 'draft' | 'submitted' | 'approved'
  });

  const scoreLabels = {
    productivity: 'Produktivitas',
    quality: 'Kualitas Kerja',
    teamwork: 'Kerjasama Tim',
    punctuality: 'Ketepatan Waktu',
    initiative: 'Inisiatif'
  };

  const calculateFinalScore = () => {
    const scores = Object.values(formData.scores);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalScore = calculateFinalScore();
    
    onSave({
      ...formData,
      finalScore
    });
  };

  const handleScoreChange = (criteria: keyof typeof formData.scores, value: number) => {
    setFormData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [criteria]: value
      }
    }));
  };

  const renderStarRating = (criteria: keyof typeof formData.scores) => {
    const currentScore = formData.scores[criteria];
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleScoreChange(criteria, star)}
            className={`w-6 h-6 transition-colors duration-150 ${
              star <= currentScore
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star className="w-full h-full fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {currentScore}/10
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Buat Evaluasi Kinerja</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Karyawan
              </label>
              <select
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Pilih Karyawan</option>
                {employees.filter(emp => emp.status === 'active').map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
                Periode Evaluasi
              </label>
              <input
                type="text"
                id="period"
                value={formData.period}
                onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Q1 2024"
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Kriteria Penilaian</h3>
            
            {Object.entries(scoreLabels).map(([criteria, label]) => (
              <div key={criteria} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <label className="text-sm font-medium text-gray-700">{label}</label>
                  <span className="text-sm text-gray-500">Skala 1-10</span>
                </div>
                {renderStarRating(criteria as keyof typeof formData.scores)}
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
              Komentar dan Catatan
            </label>
            <textarea
              id="comments"
              rows={4}
              value={formData.comments}
              onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Berikan feedback dan saran untuk karyawan..."
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Skor Akhir:</span>
              <span className="text-2xl font-bold text-blue-600">
                {calculateFinalScore().toFixed(1)}/10
              </span>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
            >
              Simpan Evaluasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationModal;