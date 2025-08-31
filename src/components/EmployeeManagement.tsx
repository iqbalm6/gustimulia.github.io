import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, MapPin } from 'lucide-react';
import { Employee } from '../types';
import EmployeeModal from './EmployeeModal';

interface EmployeeManagementProps {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, setEmployees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const handleSaveEmployee = (employeeData: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...employeeData, id: editingEmployee.id }
          : emp
      ));
    } else {
      const newEmployee: Employee = {
        ...employeeData,
        id: Date.now().toString()
      };
      setEmployees([...employees, newEmployee]);
    }
    setShowModal(false);
    setEditingEmployee(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Karyawan</h1>
          <p className="text-gray-600 mt-2">Kelola informasi karyawan perusahaan</p>
        </div>
        <button
          onClick={handleAddEmployee}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Karyawan</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari karyawan..."
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Posisi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Departemen</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {employee.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                        <p className="text-sm text-gray-500">Bergabung: {new Date(employee.joinDate).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.position}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.department}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {employee.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada karyawan yang ditemukan</p>
          </div>
        )}
      </div>

      {showModal && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={handleSaveEmployee}
          onClose={() => {
            setShowModal(false);
            setEditingEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;