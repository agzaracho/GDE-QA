import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { Home, ChevronDown } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onModuleChange: (module: string) => void;
  selectedModule: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onModuleChange, selectedModule, children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modules = ['ACCESO', 'EU', 'GEDO', 'CCOO', 'EE'];
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const isAdminPanel = location.pathname === '/admin';
  const isEditPage = location.pathname.includes('/edit-');

  const handleModuleChange = (module: string) => {
    onModuleChange(module);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold">GDA QA</Link>
          <Link to="/" className="ml-4 hover:text-gray-300">
            <Home size={24} />
          </Link>
        </div>
        <nav className="flex items-center">
          {!isAdminPanel && !isEditPage && (
            <div className="relative mr-4" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded transition duration-300 ease-in-out"
              >
                {selectedModule} <ChevronDown size={16} className="ml-1" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-10" onMouseLeave={handleMouseLeave}>
                  {modules.map((module) => (
                    <a
                      key={module}
                      href="#"
                      className={`block px-4 py-2 text-sm ${
                        module === selectedModule ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-600'
                      } transition duration-300 ease-in-out`}
                      onClick={() => handleModuleChange(module)}
                    >
                      {module}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
          {user ? (
            <>
              <span className="mr-4">{user.username}</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="mr-4 bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-400">
                  Admin Panel
                </Link>
              )}
              <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Login</Link>
          )}
          {children}
        </nav>
      </div>
    </header>
  );
};

export default Header;