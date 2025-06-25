import React from 'react';
import { Calendar, FileText, Edit, Check, X } from 'lucide-react';
import { Test } from '../types';

interface TestListProps {
  tests: Test[];
  onTestEdit: (test: Test) => void;
  onTestDelete: (id: string) => void;
}

export const TestList: React.FC<TestListProps> = ({ tests, onTestEdit, onTestDelete }) => {
  if (tests.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tests created</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first test.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Created Tests</h3>
      {tests.map((test) => (
        <div key={test.id} className="card">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-base font-medium text-gray-900 mb-3">{test.question}</h4>
              <div className="space-y-2">
                {test.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className={`text-sm ${option.isCorrect ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
                      {option.text}
                    </span>
                    {option.isCorrect && (
                      <Check size={16} className="text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onTestEdit(test)}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit test"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onTestDelete(test.id)}
                className="p-2 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                title="Delete test"
              >
                <X size={16} />
              </button>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar size={14} />
                <span>{test.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};