import React from 'react';
import { TemplateCategory } from '../types/template';
import { FiPlus } from 'react-icons/fi';

interface TemplateCategoriesProps {
  categories: TemplateCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onAddCategory: () => void;
  isDarkMode?: boolean;
}

const TemplateCategories: React.FC<TemplateCategoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  isDarkMode = false,
}) => {
  return (
    <div className="template-categories mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Categories</h3>
        <button
          type="button"
          onClick={onAddCategory}
          className={`p-1 rounded-full ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50'
          } text-green-500 hover:text-green-600`}
          aria-label="Add new category">
          <FiPlus size={16} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-green-500 text-white'
              : isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
          All
        </button>

        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center ${
              selectedCategory === category.id
                ? 'bg-green-500 text-white'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
            {category.icon && <span className="mr-1">{category.icon}</span>}
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateCategories;
