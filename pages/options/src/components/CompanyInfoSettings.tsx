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
  repName: string;
  repEmail: string;
}

interface CompanyInfoSettingsProps {
  isDarkMode?: boolean;
}

export const CompanyInfoSettings = ({ isDarkMode = false }: CompanyInfoSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    industry: '',
    website: '',
    country: '',
    employees: '',
    description: '',
    repName: '',
    repEmail: '',
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
        });
      }
    } catch (error) {
      console.error('Failed to save company info:', error);
    }
  };

  return (
    <section className="space-y-6">
      <div
        className={`rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-green-100 bg-white'} p-6 text-left shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MdOutlineBusiness size={24} color="#22c55e" className="mr-2" />
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Company Profile
            </h2>
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

        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Your company information will be used to personalize compliance templates and regulatory assessments. This
          data helps Bilic Neo provide more accurate compliance guidance specific to your industry and business size.
        </p>

        {isEditing ? (
          <form className="space-y-4">
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
                <option value="501-1000">501-1000</option>
                <option value="1001+">1001+</option>
              </select>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
              <h3 className={`text-md font-medium mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Company Representative
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="repName"
                    className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Representative Name
                  </label>
                  <input
                    type="text"
                    id="repName"
                    name="repName"
                    value={companyInfo.repName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`mt-1 block w-full rounded-md ${
                      isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                    } border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="repEmail"
                    className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Representative Email
                  </label>
                  <input
                    type="email"
                    id="repEmail"
                    name="repEmail"
                    value={companyInfo.repEmail}
                    onChange={handleChange}
                    placeholder="representative@company.com"
                    className={`mt-1 block w-full rounded-md ${
                      isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                    } border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
                  />
                </div>
              </div>
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
              <div className="grid grid-cols-2 gap-4">
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
                  <div className="col-span-2">
                    <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Description
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {companyInfo.description}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>No company information added yet.</p>
                <p className="mt-2 text-sm">Click the edit button to add your company details.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyInfoSettings;
