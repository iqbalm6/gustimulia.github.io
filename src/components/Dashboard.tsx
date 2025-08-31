import React from 'react';
import { Users, ClipboardCheck, TrendingUp, Calendar } from 'lucide-react';
import { Employee, Evaluation } from '../types';

interface DashboardProps {
  employees: Employee[];
  evaluations: Evaluation[];
}

const Dashboard: React.FC<DashboardProps> = ({ employees, evaluations }) => {
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const completedEvaluations = evaluations.filter(evaluation => evaluation.status === 'approved').length;
  const averageScore = evaluations.length > 0 
    ? evaluations.reduce((sum, evaluation) => sum + evaluation.finalScore, 0) / evaluations.length 
    : 0;

  const stats = [
    {
      title: 'Total Karyawan Aktif',
      value: activeEmployees,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Evaluasi Selesai',
      value: completedEvaluations,
      icon: ClipboardCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Rata-rata Skor',
      value: averageScore.toFixed(1),
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Periode Aktif',
      value: '2024',
      icon: Calendar,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  const recentEvaluations = evaluations.slice(-5).reverse();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Selamat datang di Sistem Evaluasi Kinerja Karyawan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluasi Terbaru</h3>
          <div className="space-y-3">
            {recentEvaluations.length > 0 ? (
              recentEvaluations.map((evaluation) => {
                const employee = employees.find(emp => emp.id === evaluation.employeeId);
                return (
                  <div key={evaluation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{employee?.name}</p>
                      <p className="text-sm text-gray-600">{employee?.position}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-600">{evaluation.finalScore}</p>
                      <p className="text-xs text-gray-500">{evaluation.period}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">Belum ada evaluasi</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Departemen</h3>
          <div className="space-y-3">
            {Array.from(new Set(employees.map(emp => emp.department))).map((dept) => {
              const count = employees.filter(emp => emp.department === dept).length;
              const percentage = (count / employees.length) * 100;
              
              return (
                <div key={dept} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{dept}</span>
                    <span className="text-sm text-gray-500">{count} orang</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;