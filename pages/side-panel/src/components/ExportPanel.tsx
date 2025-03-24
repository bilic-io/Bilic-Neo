import React, { useState, useEffect } from 'react';
import {
  exportConversation,
  generateExecutiveSummary,
  scheduleReport,
  getScheduledReports,
  deleteScheduledReport,
  type ExportOptions,
  type ScheduledReport,
} from '../utils/exportUtils';
import { type Message as MessageType } from '@extension/storage';
import { FiDownload, FiClock, FiFileText, FiCalendar, FiTrash2, FiCheck } from 'react-icons/fi';

interface ExportPanelProps {
  messages: MessageType[];
  sessionId: string | null;
  isDarkMode: boolean;
  companyInfo?: Record<string, string>;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ messages, sessionId, isDarkMode, companyInfo }) => {
  const [activeTab, setActiveTab] = useState<'export' | 'schedule' | 'summary'>('export');
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'txt' | 'json'>('pdf');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [reportTitle, setReportTitle] = useState('');
  const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [scheduleName, setScheduleName] = useState('');
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch scheduled reports
  useEffect(() => {
    const loadReports = async () => {
      const reports = await getScheduledReports();
      setScheduledReports(reports);
    };

    loadReports();
  }, []);

  // Generate executive summary
  useEffect(() => {
    if (activeTab === 'summary' && messages.length > 0) {
      const summary = generateExecutiveSummary(messages, companyInfo);
      setExecutiveSummary(summary);
    }
  }, [activeTab, messages, companyInfo]);

  // Show success message temporarily
  const displaySuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // Handle export
  const handleExport = async () => {
    if (messages.length === 0) {
      return;
    }

    const options: ExportOptions = {
      format: exportFormat,
      includeMetadata,
      includeTimestamps,
      title: reportTitle || undefined,
      companyInfo,
    };

    try {
      await exportConversation(messages, options, sessionId);
      displaySuccess(`Successfully exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  // Handle scheduling a report
  const handleScheduleReport = async () => {
    if (!scheduleName) {
      return;
    }

    const now = new Date();
    let nextRun: Date;

    switch (scheduleFrequency) {
      case 'daily':
        nextRun = new Date(now.setDate(now.getDate() + 1));
        break;
      case 'weekly':
        nextRun = new Date(now.setDate(now.getDate() + 7));
        break;
      case 'monthly':
        nextRun = new Date(now.setMonth(now.getMonth() + 1));
        break;
    }

    const report: ScheduledReport = {
      id: `report-${Date.now()}`,
      name: scheduleName,
      frequency: scheduleFrequency,
      format: exportFormat,
      nextRun: nextRun.getTime(),
      options: {
        format: exportFormat,
        includeMetadata,
        includeTimestamps,
        title: reportTitle || undefined,
        companyInfo,
      },
    };

    try {
      await scheduleReport(report);
      const reports = await getScheduledReports();
      setScheduledReports(reports);
      setScheduleName('');
      displaySuccess('Report scheduled successfully');
    } catch (error) {
      console.error('Scheduling error:', error);
    }
  };

  // Handle deleting a scheduled report
  const handleDeleteReport = async (id: string) => {
    try {
      await deleteScheduledReport(id);
      setScheduledReports(scheduledReports.filter(r => r.id !== id));
      displaySuccess('Report removed from schedule');
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Copy executive summary to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(executiveSummary).then(() => {
      displaySuccess('Executive summary copied to clipboard');
    });
  };

  // Format next run date
  const formatNextRun = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const bgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-200' : 'text-gray-800';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBgClass = isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800';
  const buttonClass = isDarkMode
    ? 'bg-green-600 hover:bg-green-700 text-white'
    : 'bg-green-500 hover:bg-green-600 text-white';
  const secondaryButtonClass = isDarkMode
    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300';
  const tabClass = (tab: string) =>
    activeTab === tab
      ? isDarkMode
        ? 'text-green-400 border-b-2 border-green-400'
        : 'text-green-600 border-b-2 border-green-600'
      : isDarkMode
        ? 'text-gray-400 hover:text-gray-300'
        : 'text-gray-600 hover:text-gray-800';

  return (
    <div className={`${bgClass} ${textClass} w-full p-4 rounded-md relative`}>
      {/* Success message */}
      {showSuccessMessage && (
        <div className="absolute top-2 right-2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded flex items-center space-x-2">
          <FiCheck className="text-green-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className={`flex border-b ${borderClass} mb-4`}>
        <button
          onClick={() => setActiveTab('export')}
          className={`${tabClass('export')} px-4 py-2 font-medium text-sm`}>
          <div className="flex items-center gap-2">
            <FiDownload size={14} />
            <span>Export</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`${tabClass('schedule')} px-4 py-2 font-medium text-sm`}>
          <div className="flex items-center gap-2">
            <FiCalendar size={14} />
            <span>Schedule</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`${tabClass('summary')} px-4 py-2 font-medium text-sm`}>
          <div className="flex items-center gap-2">
            <FiFileText size={14} />
            <span>Summary</span>
          </div>
        </button>
      </div>

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-4">
          <div className="mb-4">
            <label htmlFor="report-title" className="block text-sm font-medium mb-1">
              Report Title (Optional)
            </label>
            <input
              id="report-title"
              type="text"
              value={reportTitle}
              onChange={e => setReportTitle(e.target.value)}
              placeholder="E.g., Compliance Report Q1 2025"
              className={`w-full px-3 py-2 rounded border ${borderClass} ${inputBgClass}`}
            />
          </div>

          <div className="mb-4">
            <span className="block text-sm font-medium mb-1">Format</span>
            <div className="flex space-x-3">
              {(['pdf', 'txt', 'json'] as const).map(format => (
                <label key={format} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    id={`format-${format}`}
                    checked={exportFormat === format}
                    onChange={() => setExportFormat(format)}
                    className="form-radio text-green-500"
                  />
                  <span>{format.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <label htmlFor="include-metadata" className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="include-metadata"
                checked={includeMetadata}
                onChange={() => setIncludeMetadata(!includeMetadata)}
                className="form-checkbox text-green-500"
              />
              <span>Include Company Info</span>
            </label>

            <label htmlFor="include-timestamps" className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="include-timestamps"
                checked={includeTimestamps}
                onChange={() => setIncludeTimestamps(!includeTimestamps)}
                className="form-checkbox text-green-500"
              />
              <span>Include Timestamps</span>
            </label>
          </div>

          <button
            onClick={handleExport}
            disabled={messages.length === 0}
            className={`${buttonClass} px-4 py-2 rounded flex items-center space-x-2 ${messages.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <FiDownload size={16} />
            <span>Export Report</span>
          </button>

          {messages.length === 0 && (
            <p className="text-sm text-yellow-500 mt-2">Start a conversation first to export a report.</p>
          )}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="mb-4">
            <label htmlFor="schedule-name" className="block text-sm font-medium mb-1">
              Schedule Name
            </label>
            <input
              id="schedule-name"
              type="text"
              value={scheduleName}
              onChange={e => setScheduleName(e.target.value)}
              placeholder="E.g., Weekly Compliance Check"
              className={`w-full px-3 py-2 rounded border ${borderClass} ${inputBgClass}`}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="frequency" className="block text-sm font-medium mb-1">
              Frequency
            </label>
            <select
              id="frequency"
              value={scheduleFrequency}
              onChange={e => setScheduleFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className={`w-full px-3 py-2 rounded border ${borderClass} ${inputBgClass}`}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="mb-4">
            <span className="block text-sm font-medium mb-1">Format</span>
            <div className="flex space-x-3">
              {(['pdf', 'txt', 'json'] as const).map(format => (
                <label key={format} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="schedule-format"
                    id={`schedule-format-${format}`}
                    checked={exportFormat === format}
                    onChange={() => setExportFormat(format)}
                    className="form-radio text-green-500"
                  />
                  <span>{format.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleScheduleReport}
            disabled={!scheduleName}
            className={`${buttonClass} px-4 py-2 rounded flex items-center space-x-2 ${!scheduleName ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <FiCalendar size={16} />
            <span>Schedule Report</span>
          </button>

          {/* Scheduled Reports List */}
          {scheduledReports.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Scheduled Reports</h3>
              <div className={`border ${borderClass} rounded-md divide-y ${borderClass}`}>
                {scheduledReports.map(report => (
                  <div key={report.id} className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-xs flex items-center gap-2 mt-1">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {report.frequency}, {report.format.toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock size={12} />
                          <span>Next: {formatNextRun(report.nextRun)}</span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className={`${secondaryButtonClass} p-1.5 rounded`}
                      aria-label="Delete report">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Executive Summary Tab */}
      {activeTab === 'summary' && (
        <div>
          {messages.length > 0 ? (
            <>
              <div className="flex justify-between mb-3">
                <h3 className="font-medium">Executive Summary</h3>
                <button onClick={copyToClipboard} className={`${secondaryButtonClass} px-3 py-1 text-xs rounded`}>
                  Copy to Clipboard
                </button>
              </div>
              <div
                className={`p-3 rounded border ${borderClass} whitespace-pre-line font-mono text-xs h-64 overflow-y-auto ${inputBgClass}`}>
                {executiveSummary}
              </div>
            </>
          ) : (
            <p className="text-yellow-500">Start a conversation first to generate an executive summary.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExportPanel;
