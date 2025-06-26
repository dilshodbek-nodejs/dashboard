import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { Test, TestOption, TestTopic } from '../types';

interface TestCreationProps {
  onTestCreate: (test: Omit<Test, 'id' | 'createdAt'>) => void;
  onTestUpdate?: (test: Test) => void;
  editingTest?: Test | null;
  onCancelEdit?: () => void;
}

export const TestCreation: React.FC<TestCreationProps> = ({ 
  onTestCreate, 
  onTestUpdate, 
  editingTest, 
  onCancelEdit 
}) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<TestOption[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]);
  const [topics, setTopics] = useState<TestTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  useEffect(() => {
    fetch('/api/tests/topics')
      .then(res => res.json())
      .then(data => setTopics(data.map((t: any) => ({
        id: t._id,
        title: t.title,
        description: t.description,
        createdAt: t.createdAt
      }))));
  }, []);

  useEffect(() => {
    if (editingTest) {
      setQuestion(editingTest.question);
      setOptions(editingTest.options);
      setSelectedTopic(editingTest.topic || '');
    }
  }, [editingTest]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index
    }));
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { text: '', isCorrect: false }]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const resetForm = () => {
    setQuestion('');
    setOptions([
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]);
    setSelectedTopic('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && options.every(opt => opt.text.trim()) && options.some(opt => opt.isCorrect)) {
      const testData = {
        question: question.trim(),
        options: options.filter(opt => opt.text.trim()),
        topic: selectedTopic || undefined
      };

      if (editingTest && onTestUpdate) {
        onTestUpdate({
          ...editingTest,
          ...testData
        });
      } else {
        onTestCreate(testData);
      }
      
      resetForm();
    }
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {editingTest ? 'Edit Test' : 'Create New Test'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <select
              id="topic"
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="input-field"
              required
            >
              <option value="" disabled>Select a topic</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>{topic.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Enter your test question..."
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Answer Options
              </label>
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  <Plus size={16} />
                  <span>Add Option</span>
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="input-field"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleCorrectAnswerChange(index)}
                    className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                      option.isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                    title="Mark as correct answer"
                  >
                    <Check size={16} />
                  </button>
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Click the check mark to select the correct answer
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            {editingTest && (
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary">
              {editingTest ? 'Update Test' : 'Create Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};