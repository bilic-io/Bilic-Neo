import React, { useState, useEffect } from 'react';
import { FiSave, FiEdit2 } from 'react-icons/fi';
import { MdOutlineBusiness } from 'react-icons/md';

interface CompanyInfo {
  name: string;
  industry: string;
  website: string;
  country: string;
  employees: string;
  description: string;
}

interface CompanyInfoFormProps {
  isDarkMode?: boolean;
  onSave?: (info: CompanyInfo) => void;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ isDarkMode = false, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    industry: '',
    website: '',
    country: '',
    employees: '',
    description: '',
  });

  // Load saved company info from storage if available
  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        if (chrome && chrome.storage) {
          chrome.storage.local.get(['companyInfo'], result => {
            if (result.companyInfo) {
              setCompanyInfo(result.companyInfo);
            }
          });
        }
      } catch (error) {
        console.error('Failed to load company info:', error);
      }
    };

    loadCompanyInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    try {
      if (chrome && chrome.storage) {
        chrome.storage.local.set({ companyInfo }, () => {
          setIsEditing(false);
          if (onSave) {
            onSave(companyInfo);
          }
        });
      }
    } catch (error) {
      console.error('Failed to save company info:', error);
    }
  };

  return (
    <div className={`company-info-card mt-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow`}>
      <div className="company-info-header flex items-center justify-between mb-4">
        <div className="flex items-center">
          <MdOutlineBusiness size={20} color="#22c55e" className="mr-2" />
          <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Company Information
          </h3>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50'}`}
          aria-label={isEditing ? 'Save company information' : 'Edit company information'}>
          {isEditing ? (
            <FiSave size={18} color="#22c55e" onClick={handleSave} />
          ) : (
            <FiEdit2 size={18} color="#22c55e" />
          )}
        </button>
      </div>

      {isEditing ? (
        <form className="space-y-3">
          <div>
            <label
              htmlFor="name"
              className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Company Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={companyInfo.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
            />
          </div>

          <div>
            <label
              htmlFor="industry"
              className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={companyInfo.industry}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}>
              <option value="">Select Industry</option>
              <option value="Finance">Finance</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Cryptocurrency">Cryptocurrency</option>
              <option value="Blockchain">Blockchain</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="website"
              className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={companyInfo.website}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={companyInfo.country}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
            />
          </div>

          <div>
            <label
              htmlFor="employees"
              className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Number of Employees
            </label>
            <select
              id="employees"
              name="employees"
              value={companyInfo.employees}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}>
              <option value="">Select Size</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501+">501+</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Company Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={companyInfo.description}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500">
              Save Company Information
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {companyInfo.name ? (
            <>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Company Name
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{companyInfo.name}</p>
                </div>

                <div>
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Industry</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {companyInfo.industry || 'Not specified'}
                  </p>
                </div>

                <div>
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Website</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {companyInfo.website ? (
                      <a
                        href={companyInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:underline">
                        {companyInfo.website}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>

                <div>
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Country</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {companyInfo.country || 'Not specified'}
                  </p>
                </div>

                <div>
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employees</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {companyInfo.employees || 'Not specified'}
                  </p>
                </div>

                {companyInfo.description && (
                  <div>
                    <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Description
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {companyInfo.description}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>No company information added yet.</p>
              <p className="mt-2 text-sm">Click the edit button to add your company details.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyInfoForm;
