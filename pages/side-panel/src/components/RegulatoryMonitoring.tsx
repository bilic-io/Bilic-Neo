import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiCalendar, FiGlobe, FiFilter, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
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

// Function to properly format JSON content
const formatJsonContent = (content: string): JSX.Element | string => {
  // Check if content appears to be JSON
  if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
    try {
      // Try to parse the JSON
      const jsonObj = JSON.parse(content);

      // Format the JSON object as a readable structure
      return (
        <div className="text-left">
          {Object.entries(jsonObj).map(([key, value]) => (
            <div key={key} className="mb-1">
              <span className="font-medium">{key.replace(/_/g, ' ')}:</span>{' '}
              {typeof value === 'string' ? value : JSON.stringify(value)}
            </div>
          ))}
        </div>
      );
    } catch (e) {
      // If parsing fails, return the original content
      return content;
    }
  }
  return content;
};

export const RegulatoryMonitoring: React.FC<RegulatoryMonitoringProps> = ({ companyInfo }) => {
  const [regulationUpdates, setRegulationUpdates] = useState<RegulationUpdate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
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

  // Filter regulations by category
  const getFilteredUpdates = () => {
    if (activeFilter === 'all') {
      return regulationUpdates;
    }
    return regulationUpdates.filter(update => update.category === activeFilter);
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
    const countryUpdates: Record<string, RegulationUpdate[]> = {
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
    const industryUpdates: Record<string, RegulationUpdate[]> = {
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
    const labels: Record<string, string> = {
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
          ? 'bg-blue-900/40 text-blue-300 border-blue-800'
          : 'bg-blue-100 text-blue-800 border-blue-200';
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
    <div className="h-full flex flex-col">
      {/* Header with title and refresh button */}
      <div className="flex items-center justify-between mb-5">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Regulatory Monitoring
        </h2>
        <div className="flex items-center space-x-3">
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Last updated: {formatDate(lastUpdated)}
          </span>
          <button
            className={`p-2 rounded-full transition-colors duration-150 ${
              isDarkMode
                ? 'hover:bg-gray-700 text-green-400 hover:text-green-300 bg-gray-800/60'
                : 'hover:bg-green-50 text-green-600 hover:text-green-700'
            }`}
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh regulatory updates">
            <FiRefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className={`flex flex-wrap items-center gap-2 mb-5 pb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          className={`px-4 py-1.5 text-sm rounded-full transition-colors duration-150 ${
            activeFilter === 'all'
              ? isDarkMode
                ? 'bg-green-800/50 text-green-300 border border-green-700 shadow-inner shadow-green-900/20'
                : 'bg-green-100 text-green-800 border border-green-200 shadow-sm'
              : isDarkMode
                ? 'text-gray-300 hover:bg-gray-800 border border-gray-700 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 border border-gray-200 hover:text-gray-900'
          }`}
          onClick={() => setActiveFilter('all')}>
          All Updates
        </button>
        {['privacy', 'finance', 'security', 'environmental', 'general'].map(category => (
          <button
            key={category}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors duration-150 ${
              activeFilter === category
                ? isDarkMode
                  ? 'bg-green-800/50 text-green-300 border border-green-700 shadow-inner shadow-green-900/20'
                  : 'bg-green-100 text-green-800 border border-green-200 shadow-sm'
                : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800 border border-gray-700 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 border border-gray-200 hover:text-gray-900'
            }`}
            onClick={() => setActiveFilter(category)}>
            {getCategoryLabel(category)}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-800/20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-60">
            <div
              className={`w-10 h-10 border-3 rounded-full ${isDarkMode ? 'border-green-500' : 'border-green-600'} border-t-transparent animate-spin mb-3`}></div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading updates...
            </p>
          </div>
        ) : !companyInfo || !companyInfo.name ? (
          <div
            className={`p-8 text-center rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
            <FiAlertCircle size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Company Profile Required
            </h3>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Set up your company profile to receive personalized regulatory updates.
            </p>
            <button
              onClick={() => chrome.runtime.openOptionsPage()}
              className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-150">
              Set Up Profile
            </button>
          </div>
        ) : getFilteredUpdates().length === 0 ? (
          <div
            className={`p-8 text-center rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
            <FiFilter size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Updates Found
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No regulatory updates match your current filter. Try selecting a different category.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Finextra source attribution */}
            <div
              className={`p-3 text-xs rounded-lg text-center ${
                isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}>
              Security updates provided by{' '}
              <a
                href="https://www.finextra.com/rss/channel.aspx?channel=security"
                target="_blank"
                rel="noopener noreferrer"
                className={`font-medium ${
                  isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'
                }`}>
                Finextra Security News
              </a>
            </div>

            {getFilteredUpdates().map(update => (
              <div
                key={update.id}
                className={`p-5 rounded-lg border shadow-sm ${
                  isDarkMode
                    ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800/90'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                } transition-colors duration-200`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-medium text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {update.title}
                  </h3>
                  <span
                    className={`ml-2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${getRelevanceClasses(update.relevance)}`}>
                    {update.relevance === 'high'
                      ? 'High Impact'
                      : update.relevance === 'medium'
                        ? 'Medium Impact'
                        : 'Low Impact'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center text-xs mb-3 gap-3">
                  <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <FiGlobe size={14} className="mr-1.5" />
                    {update.country}
                  </span>
                  <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <FiCalendar size={14} className="mr-1.5" />
                    {formatDate(update.date)}
                  </span>
                  <span className={getCategoryClasses(update.category)}>{getCategoryLabel(update.category)}</span>
                </div>

                <div className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  {typeof update.summary === 'string' && update.summary.trim().startsWith('{')
                    ? formatJsonContent(update.summary)
                    : update.summary}
                </div>

                <div className="flex items-center justify-between">
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="font-medium">Source:</span> {update.authority}
                  </div>

                  <a
                    href={update.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center text-xs font-medium transition-colors duration-150 ${
                      isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
                    }`}>
                    View Details
                    <FiExternalLink size={14} className="ml-1.5" />
                  </a>
                </div>

                {update.dueDate && (
                  <div
                    className={`mt-3 p-2.5 rounded-md text-xs flex items-center ${
                      isDarkMode
                        ? 'bg-amber-900/30 text-amber-300 border border-amber-800/50'
                        : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                    }`}>
                    <FiAlertCircle size={16} className="mr-2" />
                    Action required by {formatDate(update.dueDate)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegulatoryMonitoring;
