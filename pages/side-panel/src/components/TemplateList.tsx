/* eslint-disable react/prop-types */
interface Template {
  id: string;
  title: string;
  content: string;
}

interface TemplateListProps {
  templates: Template[];
  onTemplateSelect: (content: string) => void;
  isDarkMode?: boolean;
}

const TemplateList: React.FC<TemplateListProps> = ({ templates, onTemplateSelect, isDarkMode = false }) => {
  return (
    <div className="template-list-container p-3">
      <h3 className={`mb-4 text-base font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Templates</h3>
      <div className="template-list">
        {templates.map(template => (
          <button
            type="button"
            key={template.id}
            onClick={() => onTemplateSelect(template.content)}
            className="template-item">
            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
              {template.title}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateList;
