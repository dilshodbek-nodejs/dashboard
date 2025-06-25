import React from 'react';
import { FileText, PenTool, Menu, X } from 'lucide-react';

interface SidebarProps {
  activeSection: 'tests' | 'blogs';
  onSectionChange: (section: 'tests' | 'blogs') => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  isOpen, 
  onToggle 
}) => {
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={onToggle}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 mt-8 lg:mt-0">Dashboard</h1>
          
          <nav className="space-y-2">
            <button
              onClick={() => {
                onSectionChange('tests');
                onToggle();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                activeSection === 'tests'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText size={20} />
              <span>Test Creation</span>
            </button>
            
            <button
              onClick={() => {
                onSectionChange('blogs');
                onToggle();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                activeSection === 'blogs'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <PenTool size={20} />
              <span>Blog Writing</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};