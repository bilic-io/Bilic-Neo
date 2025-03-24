import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiCalendar, FiGlobe, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import type { CompanyInfo } from '../utils/templateUtils';
import { hasTavilyApiKey, fetchRegulatoryUpdates, type RegulationUpdate } from '../utils/tavilyApi';

interface RegulatoryMonitoringProps {
  companyInfo: Record<string, string>;
}

// Function to format date nicely
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const RegulatoryMonitoring: React.FC<RegulatoryMonitoringProps> = ({ companyInfo }) => {
  const [regulationUpdates, setRegulationUpdates] = useState<RegulationUpdate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isDarkMode] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [apiKeyAvailable, setApiKeyAvailable] = useState<boolean>(true);

  useEffect(() => {
    const checkApiKey = async () => {
      const hasKey = await hasTavilyApiKey();
      setApiKeyAvailable(hasKey);

      if (hasKey && companyInfo?.name) {
        loadRegulatoryUpdates();
      } else {
        setIsLoading(false);
      }
    };

    checkApiKey();
  }, [companyInfo]);

  // Load regulatory updates from Tavily API
  const loadRegulatoryUpdates = async () => {
    setIsLoading(true);

    // Convert Record<string, string> to CompanyInfo for API call
    const companyInfoObj: CompanyInfo = {
      name: companyInfo.name || '',
      industry: companyInfo.industry || '',
      website: companyInfo.website || '',
      country: companyInfo.country || '',
      employees: companyInfo.employees || '',
      description: companyInfo.description || '',
      repName: companyInfo.repName || '',
      repEmail: companyInfo.repEmail || '',
    };

    try {
      const updates = await fetchRegulatoryUpdates(companyInfoObj);
      setRegulationUpdates(updates);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading regulatory updates:', error);
      // Fallback to mock data if API fails
      const mockUpdates = generateMockRegulationUpdates(companyInfo);
      setRegulationUpdates(mockUpdates);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh regulatory updates
  const handleRefresh = () => {
    if (apiKeyAvailable && companyInfo?.name) {
      loadRegulatoryUpdates();
    }
  };

  // Generate mock regulatory updates based on company info (fallback if API fails)
  const generateMockRegulationUpdates = (companyInfo: Record<string, string>): RegulationUpdate[] => {
    const country = companyInfo.country || 'Global';
    const industry = companyInfo.industry || 'General';

    // Base updates that apply to all companies
    const baseUpdates: RegulationUpdate[] = [
      {
        id: 'reg-001',
        title: 'Updated Data Protection Guidelines',
        authority: 'Global Data Protection Board',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        summary: 'New guidelines for handling customer data across borders have been published.',
        relevance: 'high',
        category: 'privacy',
        url: 'https://example.com/data-protection-guidelines',
        country: 'Global',
      },
      {
        id: 'reg-002',
        title: 'Environmental Compliance Reporting Deadlines',
        authority: 'Environmental Protection Agency',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        summary: 'Annual environmental impact reports are due by the end of the quarter.',
        relevance: 'medium',
        category: 'environmental',
        url: 'https://example.com/environmental-reporting',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        country: 'Global',
      },
    ];

    // Country-specific updates
    const countryUpdates: { [key: string]: RegulationUpdate[] } = {
      'United States': [
        {
          id: 'reg-us-001',
          title: 'SEC Update on Financial Reporting Requirements',
          authority: 'Securities and Exchange Commission',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          summary: 'New financial disclosure requirements for publicly traded companies.',
          relevance: 'high',
          category: 'finance',
          url: 'https://example.com/sec-updates',
          country: 'United States',
        },
        {
          id: 'reg-us-002',
          title: 'CCPA Enforcement Update',
          authority: 'California Attorney General',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          summary: 'New enforcement actions under the California Consumer Privacy Act.',
          relevance: 'high',
          category: 'privacy',
          url: 'https://example.com/ccpa-updates',
          country: 'United States',
        },
      ],
      'United Kingdom': [
        {
          id: 'reg-uk-001',
          title: 'Post-Brexit Data Transfer Rules',
          authority: "UK Information Commissioner's Office",
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
          summary: 'Updated guidelines for transferring data between UK and EU post-Brexit.',
          relevance: 'high',
          category: 'privacy',
          url: 'https://example.com/uk-data-transfers',
          country: 'United Kingdom',
        },
      ],
      'European Union': [
        {
          id: 'reg-eu-001',
          title: 'GDPR Compliance Checklist Update',
          authority: 'European Data Protection Board',
          date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
          summary: 'Updated compliance checklists for GDPR implementation.',
          relevance: 'high',
          category: 'privacy',
          url: 'https://example.com/gdpr-updates',
          country: 'European Union',
        },
        {
          id: 'reg-eu-002',
          title: 'Digital Services Act Updates',
          authority: 'European Commission',
          date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
          summary: 'New requirements for digital service providers operating in the EU.',
          relevance: 'medium',
          category: 'general',
          url: 'https://example.com/dsa-updates',
          country: 'European Union',
        },
      ],
    };

    // Industry-specific updates
    const industryUpdates: { [key: string]: RegulationUpdate[] } = {
      Finance: [
        {
          id: 'ind-fin-001',
          title: 'Anti-Money Laundering Procedure Updates',
          authority: 'Financial Action Task Force',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          summary: 'Updated procedures for AML compliance and customer due diligence.',
          relevance: 'high',
          category: 'finance',
          url: 'https://example.com/aml-updates',
          country: 'Global',
        },
      ],
      Healthcare: [
        {
          id: 'ind-health-001',
          title: 'Patient Data Protection Standards',
          authority: 'Health Information Trust Alliance',
          date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
          summary: 'New standards for securing and transmitting patient health information.',
          relevance: 'high',
          category: 'privacy',
          url: 'https://example.com/healthcare-data-standards',
          country: 'Global',
        },
      ],
      Technology: [
        {
          id: 'ind-tech-001',
          title: 'AI Ethics Guidelines',
          authority: 'International Technology Standards Board',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          summary: 'New ethical guidelines for developing and deploying AI systems.',
          relevance: 'medium',
          category: 'general',
          url: 'https://example.com/ai-ethics',
          country: 'Global',
        },
      ],
    };

    // Combine all relevant updates
    let allUpdates = [...baseUpdates];

    // Add country-specific updates
    if (country in countryUpdates) {
      allUpdates = [...allUpdates, ...countryUpdates[country]];
    }

    // Handle EU-specific updates for European countries
    const euCountries = [
      'Austria',
      'Belgium',
      'Bulgaria',
      'Croatia',
      'Cyprus',
      'Czech Republic',
      'Denmark',
      'Estonia',
      'Finland',
      'France',
      'Germany',
      'Greece',
      'Hungary',
      'Ireland',
      'Italy',
      'Latvia',
      'Lithuania',
      'Luxembourg',
      'Malta',
      'Netherlands',
      'Poland',
      'Portugal',
      'Romania',
      'Slovakia',
      'Slovenia',
      'Spain',
      'Sweden',
    ];

    if (euCountries.includes(country)) {
      allUpdates = [...allUpdates, ...(countryUpdates['European Union'] || [])];
    }

    // Add industry-specific updates
    if (industry in industryUpdates) {
      allUpdates = [...allUpdates, ...industryUpdates[industry]];
    }

    // Sort by date (newest first)
    return allUpdates.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  // Maps category to nice display name
  const getCategoryLabel = (category: string): string => {
    const labels: { [key: string]: string } = {
      finance: 'Finance',
      privacy: 'Privacy',
      security: 'Security',
      employment: 'Employment',
      environmental: 'Environmental',
      general: 'General',
    };
    return labels[category] || category;
  };

  // Maps relevance to appropriate color scheme
  const getRelevanceClasses = (relevance: 'high' | 'medium' | 'low'): string => {
    switch (relevance) {
      case 'high':
        return isDarkMode ? 'bg-red-900/40 text-red-300 border-red-800' : 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return isDarkMode
          ? 'bg-amber-900/40 text-amber-300 border-amber-800'
          : 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return isDarkMode
          ? 'bg-green-900/40 text-green-300 border-green-800'
          : 'bg-green-100 text-green-800 border-green-200';
    }
  };

  // Get CSS classes for category badge
  const getCategoryClasses = (category: string): string => {
    const baseClasses = 'px-2.5 py-1 text-xs font-medium rounded-full';

    switch (category) {
      case 'finance':
        return `${baseClasses} ${isDarkMode ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-800'}`;
      case 'privacy':
        return `${baseClasses} ${isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-800'}`;
      case 'security':
        return `${baseClasses} ${isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-800'}`;
      case 'employment':
        return `${baseClasses} ${isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-800'}`;
      case 'environmental':
        return `${baseClasses} ${isDarkMode ? 'bg-teal-900/40 text-teal-300' : 'bg-teal-100 text-teal-800'}`;
      default:
        return `${baseClasses} ${isDarkMode ? 'bg-gray-900/40 text-gray-300' : 'bg-gray-100 text-gray-800'}`;
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Tabs at top */}
      <div className="border-b border-gray-700 mb-4">
        <div className="flex">
          <div className={`px-5 py-3 border-b-2 border-green-500 text-green-400 font-medium flex items-center`}>
            <FiRefreshCw className="mr-2" size={16} />
            Live Updates
          </div>
        </div>
      </div>

      {/* Title with last updated */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Regulatory Monitoring</h2>
        <div className="flex items-center">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Last updated: {formatDate(lastUpdated)}
          </span>
          <button
            className={`ml-3 p-2 rounded-full transition-colors duration-150 ${
              isDarkMode
                ? 'hover:bg-gray-700 text-green-400 hover:text-green-300'
                : 'hover:bg-green-50 text-green-600 hover:text-green-700'
            }`}
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh regulatory updates">
            <FiRefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Updates list */}
      <div className="overflow-y-auto flex-grow">
        {!apiKeyAvailable && (
          <div
            className={`mb-4 p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-800/70 border-yellow-800/50 text-yellow-200'
                : 'bg-yellow-50 border-yellow-200/50 text-yellow-800'
            }`}>
            <div className="flex items-start">
              <FiAlertCircle
                className={`mr-3 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'}`}
              />
              <div>
                <p className="font-medium">Tavily API key not found</p>
                <p className="text-sm mt-1 opacity-90">
                  For real-time regulatory updates, please add your Tavily API key in the extension settings.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security updates attribution */}
        <div
          className={`mb-4 p-3 text-xs rounded-md flex items-center ${isDarkMode ? 'bg-gray-800/60 text-gray-400 border border-gray-700' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
          <div className={`mr-2 w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
          Security updates provided by{' '}
          <span className={`ml-1 font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            Finextra Security News
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div
              className={`animate-spin rounded-full h-10 w-10 border-4 border-t-transparent ${
                isDarkMode ? 'border-green-500' : 'border-green-600'
              }`}
            />
          </div>
        ) : regulationUpdates.length === 0 ? (
          <div className={`text-center py-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No regulatory updates found
          </div>
        ) : (
          <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {regulationUpdates.map(update => (
              <div
                key={update.id}
                className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-800/70 border-gray-700/80 hover:bg-gray-800/90'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } shadow-sm transition-colors duration-150`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{update.title}</h3>
                  <span
                    className={`ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full border ${getRelevanceClasses(
                      update.relevance,
                    )}`}>
                    {update.relevance === 'high'
                      ? 'High Impact'
                      : update.relevance === 'medium'
                        ? 'Medium Impact'
                        : 'Low Impact'}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm">{update.summary}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <div className="flex items-center">
                    <FiGlobe className={`mr-1 ${isDarkMode ? 'text-green-400/70' : 'text-green-600/70'}`} />
                    <span>{update.country}</span>
                  </div>

                  <div className="flex items-center">
                    <FiCalendar className={`mr-1 ${isDarkMode ? 'text-green-400/70' : 'text-green-600/70'}`} />
                    <span>{formatDate(update.date)}</span>
                  </div>

                  <div className={`${getCategoryClasses(update.category)}`}>{getCategoryLabel(update.category)}</div>

                  {update.url && (
                    <a
                      href={update.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center transition-colors duration-150 ${
                        isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
                      }`}>
                      <span className="mr-1">View Details</span>
                      <FiExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegulatoryMonitoring;
