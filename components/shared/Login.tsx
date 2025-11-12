
import React, { useState } from 'react';
import { UserRole } from '../../types';
import { ROLES } from '../../constants';
import Logo from '../icons/Logo';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(ROLES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tni-au-dark via-tni-au to-tni-au-light p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transition-all duration-500 hover:scale-105">
        <div className="text-center mb-8">
            <Logo className="h-20 w-20 mx-auto mb-4 text-tni-au-dark"/>
            <h1 className="text-3xl font-bold text-tni-au-dark">Sistem Rikkes TNI AU</h1>
            <p className="text-gray-600 mt-2">Silakan pilih peran Anda untuk masuk</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-2">
              Peran Pengguna
            </label>
            <select
              id="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-tni-au focus:border-tni-au"
            >
              {ROLES.map((role) => (
                <option key={role} value={role} className="capitalize">
                  {role.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-tni-au hover:bg-tni-au-dark text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;