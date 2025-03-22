import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import { Template, TemplateCategory } from '../types/template';

interface TemplateFormProps {
  template?: Partial<Template>;
  categories: TemplateCategory[];
  onSave: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ template, categories, onSave, onCancel, isDarkMode = false }) => {
  const [title, setTitle] = useState(template?.title || '');
  const [content, setContent] = useState(template?.content || '');
  const [category, setCategory] = useState(template?.category || categories[0]?.id || '');
  const [isPinned, setIsPinned] = useState(template?.isPinned || false);

  useEffect(() => {
    if (template) {
      setTitle(template.title || '');
      setContent(template.content || '');
      setCategory(template.category || categories[0]?.id || '');
      setIsPinned(template.isPinned || false);
    }
  }, [template, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      content,
      category,
      isPinned,
      isDefault: template?.isDefault || false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {template?.id ? 'Edit Template' : 'Create New Template'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          aria-label="Close">
          <FiX size={20} color={isDarkMode ? '#f1f5f9' : '#475569'} />
        </button>
      </div>

      <div>
        <label
          htmlFor="title"
          className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={`w-full rounded-md px-3 py-2 text-sm ${
            isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
          } border focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
          placeholder="Template title"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Category
        </label>
        <select
          id="category"
          required
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={`w-full rounded-md px-3 py-2 text-sm ${
            isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
          } border focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="content"
          className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Content
        </label>
        <textarea
          id="content"
          required
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={8}
          className={`w-full rounded-md px-3 py-2 text-sm ${
            isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
          } border focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
          placeholder="Template content with placeholders like [COMPANY_NAME]"
        />
      </div>

      <div className="flex items-center">
        <input
          id="isPinned"
          type="checkbox"
          checked={isPinned}
          onChange={e => setIsPinned(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="isPinned" className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Pin this template
        </label>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`mr-2 px-4 py-2 rounded-md text-sm font-medium ${
            isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}>
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-green-500 text-white text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center">
          <FiSave size={16} className="mr-1" />
          Save Template
        </button>
      </div>
    </form>
  );
};

export default TemplateForm;
