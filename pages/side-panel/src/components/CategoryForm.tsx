import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import { TemplateCategory } from '../types/template';

interface CategoryFormProps {
  category?: Partial<TemplateCategory>;
  onSave: (category: Omit<TemplateCategory, 'id'>) => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

const EMOJI_OPTIONS = [
  '🔍',
  '📝',
  '🌐',
  '🔒',
  '📧',
  '⚖️',
  '🎯',
  '🔎',
  '📊',
  '📈',
  '🧩',
  '🎓',
  '💼',
  '🔔',
  '📑',
  '✅',
  '📱',
  '💻',
  '🌟',
  '✨',
];

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel, isDarkMode = false }) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [icon, setIcon] = useState(category?.icon || EMOJI_OPTIONS[0]);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
      setIcon(category.icon || EMOJI_OPTIONS[0]);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      icon,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {category?.id ? 'Edit Category' : 'Create New Category'}
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
          htmlFor="name"
          className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Category Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          className={`w-full rounded-md px-3 py-2 text-sm ${
            isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
          } border focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
          placeholder="Category name"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Description (Optional)
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className={`w-full rounded-md px-3 py-2 text-sm ${
            isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
          } border focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
          placeholder="Brief description of this category"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Icon
        </label>
        <div className="grid grid-cols-10 gap-2">
          {EMOJI_OPTIONS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => setIcon(emoji)}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                icon === emoji
                  ? 'bg-green-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
              }`}>
              {emoji}
            </button>
          ))}
        </div>
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
          Save Category
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
