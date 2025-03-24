import React, { useState, useEffect } from 'react';
import { FiShield, FiAlertTriangle, FiDownload, FiClock, FiList, FiRefreshCw } from 'react-icons/fi';

// Define interfaces here since we can't import them directly
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

export interface ComplianceGap {
  requirementId: string;
  regulation: string;
  requirement: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface DeadlineReminder {
  requirementId: string;
  regulation: string;
  requirement: string;
  dueDate: Date;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'upcoming' | 'due' | 'overdue';
  daysRemaining: number;
}

interface ComplianceSettingsProps {
  isDarkMode?: boolean;
}

type ComplianceTab = 'gaps' | 'checklist' | 'deadlines' | 'report';

// Mock implementations of compliance functions for fallback
const identifyComplianceGaps = (info: CompanyInfo): ComplianceGap[] => {
  // This is a mock implementation
  if (!info.industry) return [];

  const mockGaps: ComplianceGap[] = [
    {
      requirementId: 'gdpr-1',
      regulation: 'GDPR',
      requirement: 'Privacy Policy',
      description: 'Your company needs a comprehensive privacy policy.',
      severity: 'high',
      recommendation: 'Create a GDPR-compliant privacy policy and publish it on your website.',
    },
    {
      requirementId: 'hipaa-1',
      regulation: 'HIPAA',
      requirement: 'Data Security',
      description: 'Enhanced security controls for medical data.',
      severity: 'medium',
      recommendation: 'Implement encryption and access controls for sensitive data.',
    },
  ];

  if (info.industry === 'Healthcare') {
    return mockGaps.filter(gap => gap.regulation === 'HIPAA');
  } else if (info.industry === 'Technology') {
    return mockGaps.filter(gap => gap.regulation === 'GDPR');
  }

  return [mockGaps[0]];
};

const calculateComplianceRiskScore = (gaps: ComplianceGap[]): number => {
  // This is a mock implementation
  if (!gaps || gaps.length === 0) return 0;

  const severityScores = {
    high: 30,
    medium: 15,
    low: 5,
  };

  let score = 0;
  gaps.forEach(gap => {
    score += severityScores[gap.severity];
  });

  return Math.min(score, 100);
};

const generateIndustryChecklist = (
  info: CompanyInfo,
): {
  industry: string;
  items: Array<{ id: string; text: string; importance: 'critical' | 'important' | 'recommended' }>;
} => {
  // Mock implementation
  const industry = info.industry || 'General';
  const items = [
    {
      id: 'item-1',
      text: 'Complete data inventory',
      importance: 'important' as const,
    },
    {
      id: 'item-2',
      text: 'Create privacy policy',
      importance: 'critical' as const,
    },
    {
      id: 'item-3',
      text: 'Set up consent management',
      importance: 'recommended' as const,
    },
  ];

  if (industry === 'Healthcare') {
    items.push({
      id: 'item-4',
      text: 'Implement HIPAA security protocols',
      importance: 'critical' as const,
    });
  }

  return { industry, items };
};

const generateDeadlineReminders = (): DeadlineReminder[] => {
  // Mock implementation
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(today.getDate() + 30);

  const lastMonth = new Date();
  lastMonth.setDate(today.getDate() - 30);

  return [
    {
      requirementId: 'gdpr-annual',
      regulation: 'GDPR',
      requirement: 'Annual Privacy Impact Assessment',
      dueDate: nextMonth,
      description: 'Conduct a review of privacy practices and update documentation.',
      severity: 'medium',
      status: 'upcoming',
      daysRemaining: 30,
    },
    {
      requirementId: 'hipaa-quarterly',
      regulation: 'HIPAA',
      requirement: 'Quarterly Security Assessment',
      dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      description: 'Conduct security review of systems containing PHI.',
      severity: 'high',
      status: 'upcoming',
      daysRemaining: 7,
    },
  ];
};

// Import new scanner service (we'll need to copy it if direct imports don't work)
// This will need to be set up in a background script to work properly
const scanWebsiteCompliance = async (
  url: string,
  companyInfo: CompanyInfo,
): Promise<{
  gaps: ComplianceGap[];
  riskScore: number;
  checklist: {
    industry: string;
    items: Array<{ id: string; text: string; importance: 'critical' | 'important' | 'recommended' }>;
  };
  deadlines: DeadlineReminder[];
  rawReport: string;
}> => {
  // For development, create a bridge to the side-panel scanner service
  return new Promise(resolve => {
    try {
      // Send message to background script to perform scan using side-panel services
      chrome.runtime.sendMessage(
        {
          action: 'scanWebsiteCompliance',
          data: { url, companyInfo },
        },
        response => {
          if (chrome.runtime.lastError) {
            console.error('Runtime error:', chrome.runtime.lastError);
            // Fall back to mock data if scanner service isn't available
            resolve(generateMockComplianceData(companyInfo));
          } else if (response && response.success) {
            resolve(response.data);
          } else {
            console.warn('Scan failed, using mock data:', response?.error || 'Unknown error');
            resolve(generateMockComplianceData(companyInfo));
          }
        },
      );
    } catch (error) {
      console.error('Failed to scan website:', error);
      resolve(generateMockComplianceData(companyInfo));
    }
  });
};

// Generate mock data as fallback
const generateMockComplianceData = (info: CompanyInfo) => {
  const gaps = identifyComplianceGaps(info);
  return {
    gaps,
    riskScore: calculateComplianceRiskScore(gaps),
    checklist: generateIndustryChecklist(info),
    deadlines: generateDeadlineReminders(),
    rawReport: 'Mock compliance report generated as fallback.',
  };
};

export const ComplianceSettings = ({ isDarkMode = false }: ComplianceSettingsProps) => {
  const [activeTab, setActiveTab] = useState<ComplianceTab>('gaps');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [complianceGaps, setComplianceGaps] = useState<ComplianceGap[]>([]);
  const [riskScore, setRiskScore] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [checklist, setChecklist] = useState<{
    industry: string;
    items: Array<{ id: string; text: string; importance: 'critical' | 'important' | 'recommended' }>;
  }>({ industry: '', items: [] });
  const [deadlines, setDeadlines] = useState<DeadlineReminder[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Load saved company info from storage if available
  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        if (chrome && chrome.storage) {
          chrome.storage.local.get(['companyInfo'], result => {
            if (result.companyInfo) {
              setCompanyInfo(result.companyInfo as CompanyInfo);
              // Don't automatically run the compliance analysis
              // runComplianceAnalysis(result.companyInfo as CompanyInfo);
            }
          });
        }
      } catch (error) {
        console.error('Failed to load company info:', error);
      }
    };

    loadCompanyInfo();
  }, []);

  const runComplianceAnalysis = async (info: CompanyInfo) => {
    if (!info || !info.name) {
      setMissingFields(['name', 'industry', 'website']);
      return;
    }

    // Check for required fields
    const missing: string[] = [];
    if (!info.industry) missing.push('industry');
    if (!info.website) missing.push('website');
    if (!info.country) missing.push('country');
    if (!info.employees) missing.push('employees');

    setMissingFields(missing);

    // Run analysis even if some fields are missing
    setIsAnalyzing(true);

    try {
      const result = await scanWebsiteCompliance(info.website, info);
      setComplianceGaps(result.gaps);
      setRiskScore(result.riskScore);
      setChecklist(result.checklist);
      setDeadlines(result.deadlines);
    } catch (error) {
      console.error('Failed to run compliance analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const refreshComplianceData = () => {
    if (companyInfo) {
      runComplianceAnalysis(companyInfo);
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Tab navigation rendering
  const renderTabNav = () => (
    <div className="mb-6 flex border-b">
      <button
        className={`flex items-center gap-1 px-4 py-2 font-medium text-sm ${
          activeTab === 'gaps'
            ? isDarkMode
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-green-600 border-b-2 border-green-600'
            : isDarkMode
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => setActiveTab('gaps')}>
        <FiAlertTriangle size={14} />
        <span>Compliance Gaps</span>
      </button>
      <button
        className={`flex items-center gap-1 px-4 py-2 font-medium text-sm ${
          activeTab === 'checklist'
            ? isDarkMode
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-green-600 border-b-2 border-green-600'
            : isDarkMode
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => setActiveTab('checklist')}>
        <FiList size={14} />
        <span>Industry Checklist</span>
      </button>
      <button
        className={`flex items-center gap-1 px-4 py-2 font-medium text-sm ${
          activeTab === 'deadlines'
            ? isDarkMode
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-green-600 border-b-2 border-green-600'
            : isDarkMode
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => setActiveTab('deadlines')}>
        <FiClock size={14} />
        <span>Deadlines</span>
        {deadlines.some(d => d.status === 'due' || d.status === 'overdue') && (
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {deadlines.filter(d => d.status === 'due' || d.status === 'overdue').length}
          </span>
        )}
      </button>
      <button
        className={`flex items-center gap-1 px-4 py-2 font-medium text-sm ${
          activeTab === 'report'
            ? isDarkMode
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-green-600 border-b-2 border-green-600'
            : isDarkMode
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => setActiveTab('report')}>
        <FiDownload size={14} />
        <span>Export Report</span>
      </button>
    </div>
  );

  // Render compliance gaps tab
  const renderGapsTab = () => (
    <>
      {complianceGaps.length > 0 ? (
        <>
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
            <div className="mb-1 font-medium text-green-800 dark:text-green-400">
              We&apos;ve detected {complianceGaps.length} potential compliance issues:
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Address these issues to improve your compliance posture.
            </div>
          </div>

          <div className="max-h-[600px] space-y-3 overflow-y-auto">
            {complianceGaps.map(gap => (
              <div
                key={gap.requirementId}
                className="rounded-md border bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-750">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">{gap.requirement}</h4>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      gap.severity === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : gap.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                    {gap.severity.toUpperCase()} RISK
                  </span>
                </div>

                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{gap.regulation}: </span>
                  {gap.description}
                </div>

                <div className="mt-2 border-l-2 border-green-500 pl-3 dark:border-green-600">
                  <div className="text-sm font-medium text-green-700 dark:text-green-400">Recommendation:</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{gap.recommendation}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="font-medium text-green-800 dark:text-green-400">
            No obvious compliance gaps detected with current information.
          </div>
          <div className="mt-1 text-sm text-green-700 dark:text-green-300">
            Continue to maintain compliance by regularly reviewing your policies.
          </div>
        </div>
      )}
    </>
  );

  // Render industry checklist tab
  const renderChecklistTab = () => (
    <>
      <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
        <div className="mb-1 font-medium text-green-800 dark:text-green-400">
          {checklist.industry} Industry Compliance Checklist
        </div>
        <div className="text-sm text-green-700 dark:text-green-300">
          Use this checklist to ensure your company meets industry-specific compliance requirements.
        </div>
      </div>

      <div className="max-h-[600px] space-y-2 overflow-y-auto">
        {checklist.items.map(item => (
          <div
            key={item.id}
            className="flex items-start rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="mr-3 mt-0.5">
              <input
                type="checkbox"
                id={item.id}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor={item.id}
                className="block cursor-pointer text-sm font-medium text-gray-900 dark:text-white">
                {item.text}
              </label>
              <div
                className={`mt-1 text-xs font-medium ${
                  item.importance === 'critical'
                    ? 'text-red-600 dark:text-red-400'
                    : item.importance === 'important'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-green-600 dark:text-green-400'
                }`}>
                {item.importance.charAt(0).toUpperCase() + item.importance.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // Render deadlines tab
  const renderDeadlinesTab = () => (
    <>
      <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
        <div className="mb-1 font-medium text-green-800 dark:text-green-400">Compliance Deadlines</div>
        <div className="text-sm text-green-700 dark:text-green-300">
          Upcoming regulatory deadlines that require your attention.
        </div>
      </div>

      {deadlines.length > 0 ? (
        <div className="max-h-[600px] space-y-3 overflow-y-auto">
          {deadlines.map(deadline => (
            <div
              key={deadline.requirementId}
              className="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">{deadline.requirement}</h4>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    deadline.status === 'overdue'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : deadline.status === 'due'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                  {deadline.status.toUpperCase()}
                </span>
              </div>

              <div className="mt-1 flex items-center text-sm">
                <span className="mr-2 font-medium text-gray-700 dark:text-gray-300">{deadline.regulation}</span>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  Due: {formatDate(deadline.dueDate)}
                </span>
                {deadline.status !== 'overdue' && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    {deadline.daysRemaining} days remaining
                  </span>
                )}
              </div>

              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{deadline.description}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 p-4">
          <div className="mb-2">
            <FiClock size={24} className="mx-auto text-green-500 dark:text-green-400" />
          </div>
          <p>No upcoming deadlines found for your company profile.</p>
        </div>
      )}
    </>
  );

  // Render report tab
  const renderReportTab = () => (
    <>
      <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
        <div className="mb-1 font-medium text-green-800 dark:text-green-400">Compliance Analysis Report</div>
        <div className="text-sm text-green-700 dark:text-green-300">
          Comprehensive overview of your company&apos;s compliance status.
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <button
          className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
          onClick={() => {
            /* Download logic */
          }}>
          <FiDownload size={14} />
          Download Report
        </button>
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">Executive Summary</h3>

        <div className="mb-4">
          <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Overall Risk Assessment</div>
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`flex flex-col justify-center overflow-hidden ${
                riskScore < 30 ? 'bg-green-500' : riskScore < 70 ? 'bg-yellow-500' : 'bg-red-500'
              } text-xs text-white text-center`}
              style={{ width: `${riskScore}%` }}></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Low Risk</span>
            <span>Medium Risk</span>
            <span>High Risk</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Key Findings</h4>
            <ul className="mt-1 list-inside list-disc text-sm text-gray-600 dark:text-gray-400">
              {complianceGaps.length > 0 ? (
                complianceGaps.slice(0, 3).map(gap => (
                  <li key={gap.requirementId}>
                    {gap.requirement}:{' '}
                    <span className="text-gray-500 dark:text-gray-400">{gap.description.substring(0, 100)}...</span>
                  </li>
                ))
              ) : (
                <li>No major compliance gaps detected.</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Recommendations</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {complianceGaps.length > 0
                ? 'Address the identified compliance gaps to improve your overall compliance posture.'
                : 'Continue to maintain your current compliance measures and stay informed on regulatory changes.'}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  // Company information form rendering
  const renderCompanyInfoForm = () => (
    <div className="mb-6 p-4 rounded-lg bg-opacity-10 border border-gray-300 dark:border-gray-700">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FiShield className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
          <span>Company Information</span>
        </h3>
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors
              ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            onClick={refreshComplianceData}
            disabled={isAnalyzing || !companyInfo?.website}>
            <FiRefreshCw className={isAnalyzing ? 'animate-spin' : ''} size={14} />
            <span>Refresh</span>
          </button>

          {/* New Run Scan button */}
          <button
            className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors
              ${
                isDarkMode
                  ? 'bg-green-700 hover:bg-green-600 text-white disabled:bg-gray-700 disabled:text-gray-400'
                  : 'bg-green-600 hover:bg-green-500 text-white disabled:bg-gray-300 disabled:text-gray-500'
              }`}
            onClick={() => companyInfo && runComplianceAnalysis(companyInfo)}
            disabled={isAnalyzing || !companyInfo?.website}>
            {isAnalyzing ? (
              <>
                <FiRefreshCw className="animate-spin" size={14} />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <FiShield size={14} />
                <span>Run Compliance Scan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form fields for company info */}
      {companyInfo && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div id="company-name-label" className="block text-sm font-medium mb-1">
              Company Name
            </div>
            <div aria-labelledby="company-name-label" className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
              {companyInfo.name}
            </div>
          </div>
          <div>
            <div id="website-label" className="block text-sm font-medium mb-1">
              Website
            </div>
            <div aria-labelledby="website-label" className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
              {companyInfo.website}
            </div>
          </div>
          <div>
            <div id="industry-label" className="block text-sm font-medium mb-1">
              Industry
            </div>
            <div aria-labelledby="industry-label" className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
              {companyInfo.industry || 'Not specified'}
            </div>
          </div>
          <div>
            <div id="country-label" className="block text-sm font-medium mb-1">
              Country
            </div>
            <div aria-labelledby="country-label" className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
              {companyInfo.country || 'Not specified'}
            </div>
          </div>
          <div>
            <div id="employees-label" className="block text-sm font-medium mb-1">
              Employees
            </div>
            <div aria-labelledby="employees-label" className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
              {companyInfo.employees || 'Not specified'}
            </div>
          </div>
          <div>
            <div id="representative-label" className="block text-sm font-medium mb-1">
              Representative
            </div>
            <div aria-labelledby="representative-label" className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
              {companyInfo.repName ? `${companyInfo.repName} (${companyInfo.repEmail || 'No email'})` : 'Not specified'}
            </div>
          </div>
        </div>
      )}

      {!companyInfo && (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-2">No company information available.</p>
          <button
            onClick={() => document.getElementById('tab-profile')?.click()}
            className={`text-sm px-3 py-1.5 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
            Set Up Company Profile
          </button>
        </div>
      )}
    </div>
  );

  /* Action buttons at the bottom - removing duplicate functionality */
  const renderActionButtons = () => (
    <div className="mt-6 flex justify-center">
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors
          ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
        onClick={() => document.getElementById('tab-profile')?.click()}>
        <FiShield size={16} />
        Edit Company Profile
      </button>
    </div>
  );

  return (
    <div className={`pb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FiShield className="text-green-500 text-2xl mr-2" />
          <h2 className="text-xl font-semibold">Compliance Dashboard</h2>
        </div>
        <div className="flex items-center">
          <div className="mr-4">
            <span className="text-sm text-gray-500">Risk Score: </span>
            <span
              className={`text-xl font-bold ${
                riskScore < 30 ? 'text-green-500' : riskScore < 70 ? 'text-yellow-500' : 'text-red-500'
              }`}>
              {riskScore}
            </span>
          </div>
          {isAnalyzing && <div className="animate-pulse text-green-500">Scanning...</div>}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-6">
        Monitor your company&apos;s compliance status, track deadlines, and identify potential gaps in your compliance
        posture.
      </p>

      {/* Company Information Form with Run Scan button */}
      {renderCompanyInfoForm()}

      {/* Missing fields warning */}
      {missingFields.length > 0 && (
        <div className={`mb-4 p-3 rounded ${isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
          <div className="flex items-center">
            <FiAlertTriangle className="text-yellow-500 mr-2" />
            <span className="text-sm">
              Complete your{' '}
              <button
                onClick={() => document.getElementById('tab-profile')?.click()}
                className="text-green-500 hover:underline bg-transparent border-none p-0 cursor-pointer">
                company profile
              </button>{' '}
              to improve compliance analysis
            </span>
          </div>
          <div className="text-xs mt-1 text-gray-500">Missing: {missingFields.join(', ')}</div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4">
        <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>{renderTabNav()}</div>
      </div>

      {/* Tab content */}
      <div className="py-4">
        {activeTab === 'gaps' && renderGapsTab()}
        {activeTab === 'checklist' && renderChecklistTab()}
        {activeTab === 'deadlines' && renderDeadlinesTab()}
        {activeTab === 'report' && renderReportTab()}
      </div>

      {/* Action buttons */}
      {renderActionButtons()}
    </div>
  );
};

export default ComplianceSettings;
