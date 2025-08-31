import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  FileText, 
  LogOut,
  Building2
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Data Karyawan', icon: Users },
    { id: 'evaluations', label: 'Penilaian Kinerja', icon: ClipboardCheck },
    { id: 'reports', label: 'Laporan', icon: FileText },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Evaluasi Kinerja</h2>
            <p className="text-sm text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <p className="text-xs text-blue-600 capitalize">{user.role}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;