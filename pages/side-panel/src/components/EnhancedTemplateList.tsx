import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiDownload, FiUpload, FiStar } from 'react-icons/fi';
import type { Template, TemplateCategory } from '../types/template';
import TemplateCategories from './TemplateCategories';
import TemplateForm from './TemplateForm';
import CategoryForm from './CategoryForm';
import { TemplateService } from '../services/templateService';

interface TemplateListProps {
  onTemplateSelect: (content: string) => void;
  isDarkMode?: boolean;
}

const EnhancedTemplateList: React.FC<TemplateListProps> = ({ onTemplateSelect, isDarkMode = false }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      try {
        await TemplateService.initialize();
        const loadedTemplates = await TemplateService.getTemplates();
        const loadedCategories = await TemplateService.getCategories();

        setTemplates(loadedTemplates);
        setCategories(loadedCategories);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to load templates:', error);
      }
    };

    loadData();
  }, []);

  // Filter templates based on selected category and search term
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort templates with pinned ones first, then alphabetically
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return a.title.localeCompare(b.title);
  });

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setShowTemplateForm(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setShowTemplateForm(true);
  };

  const handleSaveTemplate = async (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingTemplate) {
        // Update existing template
        const updated = await TemplateService.updateTemplate(editingTemplate.id, template);
        if (updated) {
          setTemplates(prev => prev.map(t => (t.id === editingTemplate.id ? updated : t)));
        }
      } else {
        // Add new template
        const newTemplate = await TemplateService.addTemplate(template);
        setTemplates(prev => [...prev, newTemplate]);
      }

      setShowTemplateForm(false);
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const success = await TemplateService.deleteTemplate(templateId);
        if (success) {
          setTemplates(prev => prev.filter(t => t.id !== templateId));
        }
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };

  const handleTogglePinTemplate = async (templateId: string, isPinned: boolean) => {
    try {
      const updated = await TemplateService.updateTemplate(templateId, { isPinned: !isPinned });
      if (updated) {
        setTemplates(prev => prev.map(t => (t.id === templateId ? updated : t)));
      }
    } catch (error) {
      console.error('Failed to update template:', error);
    }
  };

  const handleAddCategory = () => {
    setShowCategoryForm(true);
  };

  const handleSaveCategory = async (category: Omit<TemplateCategory, 'id'>) => {
    try {
      const newCategory = await TemplateService.addCategory(category);
      setCategories(prev => [...prev, newCategory]);
      setShowCategoryForm(false);
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleExportTemplates = () => {
    try {
      const jsonData = TemplateService.exportTemplates(templates);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'neo-templates.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export templates:', error);
    }
  };

  const handleImportTemplates = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async event => {
        const content = event.target?.result as string;
        const success = await TemplateService.importTemplates(content);

        if (success) {
          // Reload templates after import
          const loadedTemplates = await TemplateService.getTemplates();
          setTemplates(loadedTemplates);
        } else {
          alert('Failed to import templates. The file may be invalid.');
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  if (!isInitialized) {
    return (
      <div className="template-list-container p-3">
        <div className={`flex justify-center items-center h-32 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading templates...
        </div>
      </div>
    );
  }

  return (
    <div className="template-list-container p-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-base font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Templates</h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleExportTemplates}
            className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50'
            } text-green-500 hover:text-green-600`}
            aria-label="Export templates"
            title="Export templates">
            <FiDownload size={16} />
          </button>
          <button
            type="button"
            onClick={handleImportTemplates}
            className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50'
            } text-green-500 hover:text-green-600`}
            aria-label="Import templates"
            title="Import templates">
            <FiUpload size={16} />
          </button>
          <button
            type="button"
            onClick={handleAddTemplate}
            className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50'
            } text-green-500 hover:text-green-600`}
            aria-label="Add new template"
            title="Add new template">
            <FiPlus size={16} />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className={`flex items-center px-3 py-2 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <FiSearch size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`ml-2 bg-transparent border-none focus:outline-none text-sm w-full ${
              isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      <TemplateCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onAddCategory={handleAddCategory}
        isDarkMode={isDarkMode}
      />

      {sortedTemplates.length === 0 ? (
        <div className={`py-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {searchTerm ? <p>No templates match your search.</p> : <p>No templates in this category. Add some!</p>}
        </div>
      ) : (
        <div className="template-list space-y-2 mt-2">
          {sortedTemplates.map(template => {
            const category = categories.find(c => c.id === template.category);

            return (
              <div
                key={template.id}
                className={`template-item relative ${template.isPinned ? 'border-l-2 border-green-500 pl-2' : ''}`}>
                <button
                  type="button"
                  onClick={() => onTemplateSelect(template.content)}
                  className="template-button w-full text-left">
                  <div
                    className={`template-title text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                    {template.title}
                  </div>
                  {category && (
                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {category.icon} {category.name}
                    </div>
                  )}
                </button>
                <div className="template-actions absolute right-1 top-1">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleTogglePinTemplate(template.id, template.isPinned || false);
                    }}
                    className={`p-1 rounded-full ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    } ${template.isPinned ? 'text-green-500' : 'text-gray-400'}`}
                    aria-label={template.isPinned ? 'Unpin template' : 'Pin template'}>
                    <FiStar size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleEditTemplate(template);
                    }}
                    className={`p-1 rounded-full ${
                      isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                    }`}
                    aria-label="Edit template">
                    <FiEdit2 size={14} />
                  </button>
                  {!template.isDefault && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteTemplate(template.id);
                      }}
                      className={`p-1 rounded-full ${
                        isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                      }`}
                      aria-label="Delete template">
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Template Form Modal */}
      {showTemplateForm && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black bg-opacity-70' : 'bg-gray-500 bg-opacity-50'}`}>
          <div
            className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <TemplateForm
              template={editingTemplate || undefined}
              categories={categories}
              onSave={handleSaveTemplate}
              onCancel={() => setShowTemplateForm(false)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black bg-opacity-70' : 'bg-gray-500 bg-opacity-50'}`}>
          <div
            className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <CategoryForm
              onSave={handleSaveCategory}
              onCancel={() => setShowCategoryForm(false)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTemplateList;
