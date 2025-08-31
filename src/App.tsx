import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import PerformanceEvaluation from './components/PerformanceEvaluation';
import Reports from './components/Reports';
import Sidebar from './components/Sidebar';
import { User, Employee, Evaluation } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Budi Santoso',
      position: 'Software Developer',
      department: 'IT',
      email: 'budi@company.com',
      joinDate: '2023-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sari Dewi',
      position: 'Marketing Manager',
      department: 'Marketing',
      email: 'sari@company.com',
      joinDate: '2022-05-20',
      status: 'active'
    }
  ]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard employees={employees} evaluations={evaluations} />;
      case 'employees':
        return <EmployeeManagement employees={employees} setEmployees={setEmployees} />;
      case 'evaluations':
        return <PerformanceEvaluation employees={employees} evaluations={evaluations} setEvaluations={setEvaluations} />;
      case 'reports':
        return <Reports employees={employees} evaluations={evaluations} />;
      default:
        return <Dashboard employees={employees} evaluations={evaluations} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 ml-64">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;