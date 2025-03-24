/**
 * Export and Reporting Utilities for Neo
 * Provides functionality for:
 * - Exporting conversation reports as PDF or Word
 * - Scheduling recurring compliance checks
 * - Summarizing compliance issues
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Actors } from '@extension/storage';
import type { Message as MessageType } from '@extension/storage';

// Define types that aren't exported from storage module
type CompanyInfo = {
  name: string;
  industry: string;
  size: string;
  country: string;
};

// Define an interface for jsPDF with autoTable
interface JsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => void; // Using any to avoid complex type definition issues
}

// Map of actors to display names for reports
const actorDisplayNames: Record<string, string> = {
  [Actors.USER]: 'User',
  [Actors.SYSTEM]: 'Neo Assistant',
  [Actors.PLANNER]: 'Planner',
  [Actors.NAVIGATOR]: 'Navigator',
  [Actors.VALIDATOR]: 'Validator',
};

/**
 * Interface for export options
 */
export interface ExportOptions {
  includeMetadata?: boolean;
  includeTimestamps?: boolean;
  title?: string;
  format: 'pdf' | 'txt' | 'json';
  companyInfo?: CompanyInfo;
}

/**
 * Interface for scheduled report
 */
export interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  format: 'pdf' | 'txt' | 'json';
  nextRun: number; // timestamp
  options: ExportOptions;
}

/**
 * Export conversation to different formats
 */
export const exportConversation = async (
  messages: MessageType[],
  options: ExportOptions,
  sessionId?: string | null,
): Promise<void> => {
  const { format, title } = options;
  const filename = title || `neo-report-${new Date().toISOString().split('T')[0]}`;

  switch (format) {
    case 'pdf':
      await exportToPdf(messages, options, filename, sessionId);
      break;
    case 'txt':
      exportToText(messages, options, filename);
      break;
    case 'json':
      exportToJSON(messages, options, filename);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

/**
 * Export conversation to PDF
 */
const exportToPdf = async (
  messages: MessageType[],
  options: ExportOptions,
  filename: string,
  sessionId?: string | null,
): Promise<void> => {
  const { includeMetadata = true, includeTimestamps = true, companyInfo } = options;

  // Create a new PDF document
  const doc = new jsPDF() as JsPDFWithAutoTable;

  // Add title
  doc.setFontSize(18);
  doc.setTextColor(34, 197, 94); // #22c55e - Neo green
  doc.text('Neo Compliance Report', 14, 20);

  // Add metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const dateStr = new Date().toLocaleString();
  doc.text(`Generated: ${dateStr}`, 14, 30);

  if (companyInfo && includeMetadata) {
    let yPos = 35;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Company Information:', 14, yPos);
    yPos += 5;

    doc.setFontSize(9);
    Object.entries(companyInfo).forEach(([key, value]) => {
      if (value) {
        doc.text(`${key}: ${value}`, 14, yPos);
        yPos += 5;
      }
    });

    yPos += 5;
  }

  // Add session ID if available
  if (sessionId && includeMetadata) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Session ID: ${sessionId}`, 14, 45);
  }

  // Add messages
  const startY = options.companyInfo ? 65 : 45;

  doc.autoTable({
    startY,
    head: [['Source', includeTimestamps ? 'Time' : '', 'Message']],
    body: messages.map(msg => [
      actorDisplayNames[msg.actor] || msg.actor,
      includeTimestamps ? new Date(msg.timestamp).toLocaleTimeString() : '',
      msg.content,
    ]),
    styles: {
      overflow: 'linebreak',
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [34, 197, 94], // #22c55e - Neo green
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: includeTimestamps ? { cellWidth: 30 } : { cellWidth: 0 },
      2: { cellWidth: 'auto' },
    },
  });

  // Add footer
  const pageCount = doc.internal.pages.length;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'Neo - Compliance Reporting System',
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' },
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 20,
      doc.internal.pageSize.getHeight() - 10,
    );
  }

  try {
    // Get PDF as blob and use saveAs instead of doc.save
    const pdfBlob = doc.output('blob');
    if (pdfBlob instanceof Blob) {
      saveAs(pdfBlob, `${filename}.pdf`);
    } else {
      throw new Error('Failed to generate PDF blob');
    }
  } catch (error) {
    console.error('Error saving PDF:', error);
    // Fallback method if the first method fails
    try {
      const pdfBase64 = doc.output('datauristring');
      if (typeof pdfBase64 === 'string') {
        const link = document.createElement('a');
        link.href = pdfBase64;
        link.download = `${filename}.pdf`;
        link.click();
      } else {
        throw new Error('Failed to generate PDF data URI');
      }
    } catch (fallbackError) {
      console.error('Fallback PDF save failed:', fallbackError);
      // Last resort - try direct save method
      doc.save(`${filename}.pdf`);
    }
  }
};

/**
 * Export conversation to plain text
 */
const exportToText = (messages: MessageType[], options: ExportOptions, filename: string): void => {
  const { includeMetadata = true, includeTimestamps = true, companyInfo } = options;
  let output = '';

  // Add title
  output += '======== NEO COMPLIANCE REPORT ========\n\n';

  // Add metadata
  const dateStr = new Date().toLocaleString();
  output += `Generated: ${dateStr}\n\n`;

  if (companyInfo && includeMetadata) {
    output += 'COMPANY INFORMATION:\n';
    Object.entries(companyInfo).forEach(([key, value]) => {
      if (value) output += `${key}: ${value}\n`;
    });
    output += '\n';
  }

  // Add messages
  output += 'CONVERSATION:\n';
  messages.forEach(msg => {
    const actor = actorDisplayNames[msg.actor] || msg.actor;
    const time = includeTimestamps ? `[${new Date(msg.timestamp).toLocaleTimeString()}] ` : '';
    output += `${time}${actor}: ${msg.content}\n\n`;
  });

  // Save as file
  const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${filename}.txt`);
};

/**
 * Export conversation to JSON
 */
const exportToJSON = (messages: MessageType[], options: ExportOptions, filename: string): void => {
  const exportData = {
    metadata: {
      title: options.title || 'Neo Compliance Report',
      generated: new Date().toISOString(),
      companyInfo: options.includeMetadata ? options.companyInfo : undefined,
    },
    messages: messages.map(msg => ({
      actor: msg.actor,
      actorName: actorDisplayNames[msg.actor] || msg.actor,
      content: msg.content,
      timestamp: options.includeTimestamps ? msg.timestamp : undefined,
      formattedTime: options.includeTimestamps ? new Date(msg.timestamp).toLocaleString() : undefined,
    })),
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8' });
  saveAs(blob, `${filename}.json`);
};

/**
 * Generate an executive summary from conversation
 */
export const generateExecutiveSummary = (messages: MessageType[], companyInfo?: CompanyInfo): string => {
  // Extract assistant messages for analysis
  const assistantMessages = messages.filter(msg => msg.actor === Actors.SYSTEM);

  // Build a basic summary (in a real implementation, this would use more sophisticated NLP)
  let summary = `# EXECUTIVE SUMMARY\n\n`;
  summary += `## Company: ${companyInfo?.name || 'Not Specified'}\n\n`;
  summary += `## Date: ${new Date().toLocaleDateString()}\n\n`;
  summary += `## Overview\n\n`;
  summary += `This report summarizes the compliance conversation with Neo Assistant. `;
  summary += `The conversation contained ${messages.length} messages in total, `;
  summary += `with ${assistantMessages.length} responses from the assistant.\n\n`;

  summary += `## Key Points\n\n`;

  // In a real implementation, we would use NLP to extract key points
  // Here we're just using a simplified approach for demonstration
  const assistantText = assistantMessages.map(m => m.content).join(' ');
  const sentences = assistantText
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 20)
    .slice(0, 5);

  sentences.forEach((sentence, index) => {
    summary += `${index + 1}. ${sentence.trim()}.\n`;
  });

  summary += `\n## Conclusion\n\n`;
  summary += `This summary was automatically generated by Neo and may not capture all compliance details. `;
  summary += `Please review the full report for comprehensive compliance assessment.\n`;

  return summary;
};

/**
 * Store a scheduled report configuration
 */
export const scheduleReport = (report: ScheduledReport): Promise<void> => {
  return new Promise(resolve => {
    // Get existing scheduled reports
    chrome.storage.local.get({ scheduledReports: [] }, result => {
      const reports = result.scheduledReports as ScheduledReport[];
      const existingIndex = reports.findIndex(r => r.id === report.id);

      if (existingIndex >= 0) {
        reports[existingIndex] = report;
      } else {
        reports.push(report);
      }

      chrome.storage.local.set({ scheduledReports: reports }, () => {
        resolve();
      });
    });
  });
};

/**
 * Get all scheduled reports
 */
export const getScheduledReports = (): Promise<ScheduledReport[]> => {
  return new Promise(resolve => {
    chrome.storage.local.get({ scheduledReports: [] }, result => {
      resolve(result.scheduledReports as ScheduledReport[]);
    });
  });
};

/**
 * Delete a scheduled report
 */
export const deleteScheduledReport = (id: string): Promise<void> => {
  return new Promise(resolve => {
    chrome.storage.local.get({ scheduledReports: [] }, result => {
      const reports = result.scheduledReports as ScheduledReport[];
      const filteredReports = reports.filter(r => r.id !== id);

      chrome.storage.local.set({ scheduledReports: filteredReports }, () => {
        resolve();
      });
    });
  });
};
