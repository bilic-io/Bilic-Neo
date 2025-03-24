import React, { useEffect, useState } from 'react';
import type { CompanyInfo } from '../utils/templateUtils';
import {
  identifyComplianceGaps,
  calculateComplianceRiskScore,
  generateIndustryChecklist,
  generateDeadlineReminders,
  type ComplianceGap,
  type DeadlineReminder,
} from '../utils/complianceUtils';
import { FiAlertTriangle, FiClock, FiList, FiShield } from 'react-icons/fi';

interface ComplianceStatusProps {
  companyInfo: Record<string, string>;
}

type ComplianceTab = 'gaps' | 'checklist' | 'deadlines';

export const ComplianceStatus: React.FC<ComplianceStatusProps> = ({ companyInfo }) => {
  const [complianceGaps, setComplianceGaps] = useState<ComplianceGap[]>([]);
  const [riskScore, setRiskScore] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ComplianceTab>('gaps');
  const [checklist, setChecklist] = useState<{
    industry: string;
    items: Array<{ id: string; text: string; importance: 'critical' | 'important' | 'recommended' }>;
  }>({ industry: '', items: [] });
  const [deadlines, setDeadlines] = useState<DeadlineReminder[]>([]);
  const [isDarkMode] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    if (!companyInfo || !companyInfo.name) return;

    // Convert Record<string, string> to CompanyInfo for analysis
    const companyInfoForAnalysis: CompanyInfo = {
      name: companyInfo.name || '',
      industry: companyInfo.industry || '',
      website: companyInfo.website || '',
      country: companyInfo.country || '',
      employees: companyInfo.employees || '',
      description: companyInfo.description || '',
      repName: companyInfo.repName || '',
      repEmail: companyInfo.repEmail || '',
      regulatoryPortalUrl: companyInfo.regulatoryPortalUrl,
      // Add compliance-specific fields based on available data
      hasPrivacyPolicy: companyInfo.hasPrivacyPolicy === 'true',
      hasDataProtectionOfficer: companyInfo.hasDataProtectionOfficer === 'true',
      hasCustomerData: companyInfo.hasCustomerData === 'true',
      hasEmployeeData: companyInfo.hasEmployeeData === 'true',
      companySize: companyInfo.companySize as 'small' | 'medium' | 'large' | 'enterprise' | undefined,
      jurisdictions: companyInfo.jurisdictions ? [companyInfo.jurisdictions] : [companyInfo.country || ''],
      lastComplianceReview: companyInfo.lastComplianceReview,
      dataTypes: companyInfo.dataTypes ? companyInfo.dataTypes.split(',') : [],
      processingActivities: companyInfo.processingActivities ? companyInfo.processingActivities.split(',') : [],
    };

    // Initial analysis
    const gaps = identifyComplianceGaps(companyInfoForAnalysis);
    setComplianceGaps(gaps);
    setRiskScore(calculateComplianceRiskScore(gaps));

    // Generate industry checklist
    setChecklist(generateIndustryChecklist(companyInfoForAnalysis));

    // Generate deadlines
    setDeadlines(generateDeadlineReminders(companyInfoForAnalysis));
  }, [companyInfo]);

  const runDetailedAnalysis = () => {
    setIsAnalyzing(true);

    // Simulate a more detailed analysis
    setTimeout(() => {
      // Convert Record<string, string> to CompanyInfo for analysis
      const companyInfoForAnalysis: CompanyInfo = {
        name: companyInfo.name || '',
        industry: companyInfo.industry || '',
        website: companyInfo.website || '',
        country: companyInfo.country || '',
        employees: companyInfo.employees || '',
        description: companyInfo.description || '',
        repName: companyInfo.repName || '',
        repEmail: companyInfo.repEmail || '',
        regulatoryPortalUrl: companyInfo.regulatoryPortalUrl,
        // Add compliance-specific fields based on available data
        hasPrivacyPolicy: companyInfo.hasPrivacyPolicy === 'true',
        hasDataProtectionOfficer: companyInfo.hasDataProtectionOfficer === 'true',
        hasCustomerData: companyInfo.hasCustomerData === 'true',
        hasEmployeeData: companyInfo.hasEmployeeData === 'true',
        companySize: companyInfo.companySize as 'small' | 'medium' | 'large' | 'enterprise' | undefined,
        jurisdictions: companyInfo.jurisdictions ? [companyInfo.jurisdictions] : [companyInfo.country || ''],
        lastComplianceReview: companyInfo.lastComplianceReview,
        dataTypes: companyInfo.dataTypes ? companyInfo.dataTypes.split(',') : [],
        processingActivities: companyInfo.processingActivities ? companyInfo.processingActivities.split(',') : [],
      };

      // Update all data
      const gaps = identifyComplianceGaps(companyInfoForAnalysis);
      setComplianceGaps(gaps);
      setRiskScore(calculateComplianceRiskScore(gaps));
      setChecklist(generateIndustryChecklist(companyInfoForAnalysis));
      setDeadlines(generateDeadlineReminders(companyInfoForAnalysis));
      setIsAnalyzing(false);
    }, 1500);
  };

  const getRiskColor = (score: number): string => {
    if (score < 20) return '#22c55e'; // Green
    if (score < 50) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: 'upcoming' | 'due' | 'overdue'): string => {
    switch (status) {
      case 'upcoming':
        return '#22c55e'; // Green
      case 'due':
        return '#eab308'; // Yellow
      case 'overdue':
        return '#ef4444'; // Red
      default:
        return '#22c55e';
    }
  };

  const getImportanceColor = (importance: 'critical' | 'important' | 'recommended'): string => {
    switch (importance) {
      case 'critical':
        return '#ef4444'; // Red
      case 'important':
        return '#eab308'; // Yellow
      case 'recommended':
        return '#22c55e'; // Green
      default:
        return '#22c55e';
    }
  };

  // Render the tab navigation
  const renderTabNav = () => (
    <div className="compliance-tabs flex border-b mb-4">
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
          <span className="flex items-center justify-center ml-1 w-5 h-5 text-xs rounded-full bg-red-500 text-white">
            {deadlines.filter(d => d.status === 'due' || d.status === 'overdue').length}
          </span>
        )}
      </button>
    </div>
  );

  // Render compliance gaps tab
  const renderGapsTab = () => (
    <>
      {complianceGaps.length > 0 ? (
        <>
          <div className="compliance-alert p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md mb-4">
            <div className="font-medium text-amber-800 dark:text-amber-400 mb-1">
              We&apos;ve detected {complianceGaps.length} potential compliance issues:
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-300">
              Address these issues to improve your compliance posture.
            </div>
          </div>

          <div className="compliance-gaps-list space-y-3 max-h-80 overflow-y-auto">
            {complianceGaps.map(gap => (
              <div
                key={gap.requirementId}
                className="compliance-gap-item p-3 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-750">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">{gap.requirement}</h4>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      gap.severity === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : gap.severity === 'medium'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                    {gap.severity.toUpperCase()} RISK
                  </span>
                </div>

                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{gap.regulation}: </span>
                  {gap.description}
                </div>

                <div className="mt-2 pl-3 border-l-2 border-green-500 dark:border-green-600">
                  <div className="text-sm text-green-700 dark:text-green-400 font-medium">Recommendation:</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{gap.recommendation}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="compliance-success p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md mb-4">
          <div className="font-medium text-green-800 dark:text-green-400">
            No obvious compliance gaps detected with current information.
          </div>
          <div className="text-sm text-green-700 dark:text-green-300 mt-1">
            Continue to maintain compliance by regularly reviewing your policies.
          </div>
        </div>
      )}
    </>
  );

  // Render industry checklist tab
  const renderChecklistTab = () => (
    <>
      <div className="industry-checklist-header p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md mb-4">
        <div className="font-medium text-green-800 dark:text-green-400 mb-1">
          {checklist.industry} Industry Compliance Checklist
        </div>
        <div className="text-sm text-green-700 dark:text-green-300">
          Use this checklist to ensure your company meets industry-specific compliance requirements.
        </div>
      </div>

      <div className="checklist-items space-y-2 max-h-80 overflow-y-auto">
        {checklist.items.map(item => (
          <div
            key={item.id}
            className="checklist-item p-3 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-750 flex items-start">
            <div className="checkbox mr-3 mt-0.5">
              <input
                type="checkbox"
                id={item.id}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
            </div>
            <div className="content flex-1">
              <label
                htmlFor={item.id}
                className="block text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                {item.text}
              </label>
              <div className="mt-1 text-xs" style={{ color: getImportanceColor(item.importance) }}>
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
      <div className="deadlines-header p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md mb-4">
        <div className="font-medium text-blue-800 dark:text-blue-400 mb-1">Compliance Deadlines</div>
        <div className="text-sm text-blue-700 dark:text-blue-300">
          Upcoming regulatory deadlines that require your attention.
        </div>
      </div>

      {deadlines.length > 0 ? (
        <div className="deadlines-list space-y-3 max-h-80 overflow-y-auto">
          {deadlines.map(deadline => (
            <div
              key={deadline.requirementId}
              className="deadline-item p-3 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-750">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">{deadline.requirement}</h4>
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${getStatusColor(deadline.status)}20`,
                    color: getStatusColor(deadline.status),
                  }}>
                  {deadline.status.toUpperCase()}
                </span>
              </div>

              <div className="mt-1 text-sm flex items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300 mr-2">{deadline.regulation}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  Due: {formatDate(deadline.dueDate)}
                </span>
                {deadline.status !== 'overdue' && (
                  <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">
                    {deadline.daysRemaining} days remaining
                  </span>
                )}
              </div>

              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{deadline.description}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-deadlines p-4 text-center text-gray-500 dark:text-gray-400">
          <div className="mb-2">
            <FiClock size={24} className="mx-auto text-gray-400 dark:text-gray-500" />
          </div>
          <p>No upcoming deadlines found for your company profile.</p>
        </div>
      )}
    </>
  );

  return (
    <div className="compliance-status-panel p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FiShield className="mr-2 text-green-500" />
          Compliance Status
        </h3>

        <div className="risk-score-container flex items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Risk Score:</span>
          <span
            className="risk-score text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center"
            style={{
              backgroundColor: getRiskColor(riskScore) + '20',
              color: getRiskColor(riskScore),
            }}>
            {riskScore}
          </span>
        </div>
      </div>

      {renderTabNav()}

      <div className="tab-content">
        {activeTab === 'gaps' && renderGapsTab()}
        {activeTab === 'checklist' && renderChecklistTab()}
        {activeTab === 'deadlines' && renderDeadlinesTab()}
      </div>

      <button
        className="full-analysis-button mt-4 w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        onClick={runDetailedAnalysis}
        disabled={isAnalyzing}>
        {isAnalyzing ? 'Analyzing...' : 'Run Detailed Compliance Analysis'}
      </button>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        This is an automated analysis based on your company profile information. For a comprehensive review, consult
        with a compliance professional.
      </div>
    </div>
  );
};
