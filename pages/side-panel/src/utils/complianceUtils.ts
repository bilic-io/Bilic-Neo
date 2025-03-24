// Compliance utilities for Bilic Neo

import type { CompanyInfo } from './templateUtils';

export interface ComplianceRequirement {
  id: string;
  regulation: string;
  requirement: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  industry?: string[];
  jurisdictions?: string[];
  applicableIf?: (info: CompanyInfo) => boolean | undefined;
  deadline?: {
    type: 'annual' | 'quarterly' | 'monthly' | 'once';
    day?: number;
    month?: number;
    description: string;
  };
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

// Database of regulatory requirements
export const regulatoryRequirements: ComplianceRequirement[] = [
  // GDPR Requirements
  {
    id: 'gdpr-privacy-policy',
    regulation: 'GDPR',
    requirement: 'Privacy Policy',
    description:
      'Organizations must maintain a comprehensive privacy policy that explains how personal data is collected, processed, and stored.',
    severity: 'high',
    jurisdictions: ['EU', 'EEA', 'UK'],
    applicableIf: () => true, // Always apply for EU businesses
    deadline: {
      type: 'annual',
      month: 5,
      description: 'Annual privacy policy review',
    },
  },
  {
    id: 'gdpr-dpo',
    regulation: 'GDPR',
    requirement: 'Data Protection Officer',
    description:
      'Organizations that process large amounts of personal data must appoint a Data Protection Officer (DPO).',
    severity: 'high',
    jurisdictions: ['EU', 'EEA', 'UK'],
    applicableIf: info =>
      info.companySize === 'large' ||
      info.companySize === 'enterprise' ||
      info.dataTypes?.includes('sensitive') ||
      false,
  },
  {
    id: 'gdpr-data-processing',
    regulation: 'GDPR',
    requirement: 'Records of Processing Activities',
    description: 'Organizations must maintain records of data processing activities.',
    severity: 'medium',
    jurisdictions: ['EU', 'EEA', 'UK'],
    applicableIf: info => !!info.hasCustomerData || !!info.hasEmployeeData,
    deadline: {
      type: 'quarterly',
      description: 'Quarterly data processing audit',
    },
  },
  {
    id: 'gdpr-breach-notification',
    regulation: 'GDPR',
    requirement: 'Data Breach Notification',
    description: 'Organizations must report data breaches to supervisory authorities within 72 hours.',
    severity: 'high',
    jurisdictions: ['EU', 'EEA', 'UK'],
    applicableIf: info => !!info.hasCustomerData || !!info.hasEmployeeData,
  },

  // CCPA/CPRA Requirements
  {
    id: 'ccpa-privacy-notice',
    regulation: 'CCPA/CPRA',
    requirement: 'Privacy Notice',
    description:
      'Businesses must provide consumers with a notice of collection and privacy policy detailing rights and practices.',
    severity: 'high',
    jurisdictions: ['US-CA'],
    applicableIf: info => !!info.hasCustomerData && (info.companySize === 'large' || info.companySize === 'enterprise'),
    deadline: {
      type: 'annual',
      month: 1,
      description: 'Annual CCPA privacy notice update',
    },
  },
  {
    id: 'ccpa-opt-out',
    regulation: 'CCPA/CPRA',
    requirement: 'Do Not Sell My Personal Information',
    description: 'Businesses must provide a clear and conspicuous opt-out mechanism for consumers.',
    severity: 'high',
    jurisdictions: ['US-CA'],
    applicableIf: info => !!info.hasCustomerData && info.processingActivities?.includes('data_selling'),
  },

  // HIPAA Requirements
  {
    id: 'hipaa-privacy-officer',
    regulation: 'HIPAA',
    requirement: 'Privacy Officer',
    description:
      'Covered entities must designate a Privacy Officer responsible for developing and implementing privacy policies.',
    severity: 'high',
    industry: ['healthcare', 'health', 'medical'],
    jurisdictions: ['US'],
    applicableIf: info => ['healthcare', 'health', 'medical'].includes(info.industry.toLowerCase()),
  },
  {
    id: 'hipaa-security-risk-assessment',
    regulation: 'HIPAA',
    requirement: 'Security Risk Assessment',
    description: 'Covered entities must conduct a thorough assessment of potential risks to electronic PHI.',
    severity: 'high',
    industry: ['healthcare', 'health', 'medical'],
    jurisdictions: ['US'],
    applicableIf: info => ['healthcare', 'health', 'medical'].includes(info.industry.toLowerCase()),
    deadline: {
      type: 'annual',
      month: 9,
      description: 'Annual HIPAA security risk assessment',
    },
  },

  // SOX Requirements
  {
    id: 'sox-internal-controls',
    regulation: 'SOX',
    requirement: 'Internal Controls Assessment',
    description: 'Public companies must assess the effectiveness of internal controls over financial reporting.',
    severity: 'high',
    industry: ['finance', 'banking', 'public_company'],
    jurisdictions: ['US'],
    applicableIf: info =>
      ['finance', 'banking'].includes(info.industry.toLowerCase()) ||
      info.description.toLowerCase().includes('public company'),
    deadline: {
      type: 'annual',
      month: 12,
      description: 'Annual SOX internal controls assessment',
    },
  },

  // Financial Industry Requirements
  {
    id: 'aml-kyc',
    regulation: 'AML/KYC',
    requirement: 'Customer Due Diligence',
    description: 'Financial institutions must verify customer identities and monitor for suspicious activities.',
    severity: 'high',
    industry: ['finance', 'banking', 'financial_services'],
    applicableIf: info =>
      ['finance', 'banking', 'financial', 'insurance'].some(i => info.industry.toLowerCase().includes(i)),
    deadline: {
      type: 'monthly',
      description: 'Monthly AML/KYC compliance check',
    },
  },

  // Retail/E-commerce Requirements
  {
    id: 'pci-dss',
    regulation: 'PCI DSS',
    requirement: 'PCI Compliance',
    description:
      'Merchants that accept credit cards must comply with the Payment Card Industry Data Security Standard.',
    severity: 'high',
    industry: ['retail', 'e-commerce', 'online_store'],
    applicableIf: info =>
      ['retail', 'ecommerce', 'e-commerce', 'online', 'shop', 'store'].some(
        i => info.industry.toLowerCase().includes(i) || info.description.toLowerCase().includes(i),
      ),
  },

  // General Requirements
  {
    id: 'general-compliance-review',
    regulation: 'Best Practice',
    requirement: 'Regular Compliance Reviews',
    description: 'Organizations should conduct regular compliance reviews to ensure ongoing adherence to regulations.',
    severity: 'medium',
    applicableIf: () => true, // Applicable to all companies
    deadline: {
      type: 'annual',
      month: 1,
      description: 'Annual compliance review',
    },
  },
  {
    id: 'data-retention',
    regulation: 'Multiple',
    requirement: 'Data Retention Policy',
    description:
      'Organizations should establish and enforce data retention policies that define how long different types of data should be kept.',
    severity: 'medium',
    applicableIf: info => !!info.hasCustomerData || !!info.hasEmployeeData,
    deadline: {
      type: 'annual',
      month: 6,
      description: 'Annual data retention policy review',
    },
  },
];

/**
 * Identify compliance gaps based on company information
 * @param info Company profile information
 * @returns Array of identified compliance gaps
 */
export const identifyComplianceGaps = (info: CompanyInfo): ComplianceGap[] => {
  if (!info) return [];

  const gaps: ComplianceGap[] = [];

  // Convert jurisdictions from string or array to array format
  const jurisdictions =
    typeof info.jurisdictions === 'string' ? [info.jurisdictions] : info.jurisdictions || [info.country];

  // Filter requirements that apply to this company
  regulatoryRequirements.forEach(req => {
    let isApplicable = true;

    // Check jurisdiction applicability
    if (req.jurisdictions && req.jurisdictions.length > 0) {
      const jurisdictionMatches = req.jurisdictions.some(j => jurisdictions.some(cj => cj.includes(j)));
      if (!jurisdictionMatches) isApplicable = false;
    }

    // Check industry applicability
    if (req.industry && req.industry.length > 0) {
      const industryMatches = req.industry.some(i => info.industry.toLowerCase().includes(i.toLowerCase()));
      if (!industryMatches) isApplicable = false;
    }

    // Run custom applicability check
    if (req.applicableIf && !req.applicableIf(info)) {
      isApplicable = false;
    }

    // If requirement is applicable, check if there's a gap
    if (isApplicable) {
      let gapExists = false;
      let recommendation = '';

      // Check for specific gaps based on requirement ID
      switch (req.id) {
        case 'gdpr-privacy-policy':
          gapExists = !info.hasPrivacyPolicy;
          recommendation =
            'Develop and publish a GDPR-compliant Privacy Policy that describes data collection, processing, and storage practices.';
          break;

        case 'gdpr-dpo':
          gapExists = !info.hasDataProtectionOfficer;
          recommendation =
            'Appoint a Data Protection Officer who will oversee GDPR compliance within your organization.';
          break;

        case 'gdpr-data-processing':
          gapExists = !info.processingActivities || info.processingActivities.length === 0;
          recommendation =
            'Create and maintain records of all personal data processing activities within your organization.';
          break;

        case 'ccpa-privacy-notice':
          gapExists = !info.hasPrivacyPolicy;
          recommendation =
            'Develop a CCPA-compliant Privacy Notice that includes required disclosures about consumer rights and data practices.';
          break;

        case 'hipaa-privacy-officer':
          gapExists = !info.hasDataProtectionOfficer;
          recommendation =
            'Designate a Privacy Officer responsible for developing and implementing HIPAA privacy policies.';
          break;

        case 'general-compliance-review':
          gapExists =
            !info.lastComplianceReview ||
            new Date().getTime() - new Date(info.lastComplianceReview).getTime() > 365 * 24 * 60 * 60 * 1000; // Over 1 year
          recommendation =
            'Conduct a comprehensive compliance review covering all applicable regulations and document the results.';
          break;

        // Default case for other requirements - assume gap exists
        default:
          gapExists = true;
          recommendation = `Implement controls to meet the ${req.regulation} requirement for ${req.requirement}.`;
          break;
      }

      if (gapExists) {
        gaps.push({
          requirementId: req.id,
          regulation: req.regulation,
          requirement: req.requirement,
          description: req.description,
          severity: req.severity,
          recommendation,
        });
      }
    }
  });

  return gaps;
};

/**
 * Calculate compliance risk score based on identified gaps
 * @param gaps Array of identified compliance gaps
 * @returns Risk score from 0-100 (0 = lowest risk, 100 = highest risk)
 */
export const calculateComplianceRiskScore = (gaps: ComplianceGap[]): number => {
  if (!gaps || gaps.length === 0) return 0;

  // Weight by severity
  const severityWeights = {
    high: 10,
    medium: 5,
    low: 2,
  };

  let totalWeight = 0;
  const maxPossibleScore = 100;

  // Calculate weighted score
  gaps.forEach(gap => {
    totalWeight += severityWeights[gap.severity];
  });

  // Calculate score as percentage of maximum possible risk
  // Cap at 100 for extreme cases
  return Math.min(Math.round((totalWeight / maxPossibleScore) * 100), 100);
};

/**
 * Generate industry-specific compliance checklist
 * @param info Company profile information
 * @returns Object with industry name and array of checklist items
 */
export const generateIndustryChecklist = (
  info: CompanyInfo,
): {
  industry: string;
  items: Array<{ id: string; text: string; importance: 'critical' | 'important' | 'recommended' }>;
} => {
  const industry = info.industry.toLowerCase();
  const checklist = {
    industry: info.industry,
    items: [] as Array<{ id: string; text: string; importance: 'critical' | 'important' | 'recommended' }>,
  };

  // General compliance items for all industries
  const generalItems = [
    { id: 'gen-1', text: 'Establish a compliance management program', importance: 'critical' as const },
    { id: 'gen-2', text: 'Appoint a compliance officer or team', importance: 'important' as const },
    { id: 'gen-3', text: 'Create a document retention policy', importance: 'important' as const },
    { id: 'gen-4', text: 'Implement regular compliance training for employees', importance: 'important' as const },
    { id: 'gen-5', text: 'Set up a process for reporting compliance issues', importance: 'recommended' as const },
  ];

  checklist.items = [...generalItems];

  // Healthcare-specific items
  if (industry.includes('health') || industry.includes('medical') || industry.includes('pharma')) {
    checklist.items = [
      ...checklist.items,
      { id: 'health-1', text: 'Implement HIPAA Privacy and Security policies', importance: 'critical' as const },
      { id: 'health-2', text: 'Conduct HIPAA risk assessments', importance: 'critical' as const },
      { id: 'health-3', text: 'Maintain Business Associate Agreements', importance: 'important' as const },
      { id: 'health-4', text: 'Implement breach notification procedures', importance: 'critical' as const },
      { id: 'health-5', text: 'Train staff on PHI handling', importance: 'important' as const },
    ];
  }

  // Financial services items
  if (
    industry.includes('financ') ||
    industry.includes('bank') ||
    industry.includes('invest') ||
    industry.includes('insur')
  ) {
    checklist.items = [
      ...checklist.items,
      { id: 'fin-1', text: 'Implement KYC and AML procedures', importance: 'critical' as const },
      { id: 'fin-2', text: 'Conduct regular risk assessments', importance: 'critical' as const },
      { id: 'fin-3', text: 'Monitor and report suspicious activities', importance: 'critical' as const },
      {
        id: 'fin-4',
        text: 'Implement data security measures for financial information',
        importance: 'important' as const,
      },
      { id: 'fin-5', text: 'Ensure compliance with relevant financial regulations', importance: 'critical' as const },
    ];
  }

  // Retail/E-commerce items
  if (
    industry.includes('retail') ||
    industry.includes('ecommerce') ||
    industry.includes('e-commerce') ||
    industry.includes('shop')
  ) {
    checklist.items = [
      ...checklist.items,
      { id: 'ret-1', text: 'Implement PCI DSS compliance', importance: 'critical' as const },
      { id: 'ret-2', text: 'Create clear return and refund policies', importance: 'important' as const },
      { id: 'ret-3', text: 'Ensure proper tax collection and reporting', importance: 'critical' as const },
      { id: 'ret-4', text: 'Implement consumer data protection measures', importance: 'important' as const },
      { id: 'ret-5', text: 'Ensure marketing practices comply with regulations', importance: 'important' as const },
    ];
  }

  // Technology items
  if (
    industry.includes('tech') ||
    industry.includes('it') ||
    industry.includes('software') ||
    industry.includes('data')
  ) {
    checklist.items = [
      ...checklist.items,
      { id: 'tech-1', text: 'Implement strong data protection policies', importance: 'critical' as const },
      { id: 'tech-2', text: 'Conduct regular security audits', importance: 'important' as const },
      { id: 'tech-3', text: 'Ensure proper software licensing compliance', importance: 'important' as const },
      { id: 'tech-4', text: 'Implement secure development practices', importance: 'important' as const },
      { id: 'tech-5', text: 'Create a data breach response plan', importance: 'critical' as const },
    ];
  }

  return checklist;
};

/**
 * Generate compliance deadline reminders
 * @param info Company profile information
 * @returns Array of compliance deadlines
 */
export const generateDeadlineReminders = (info: CompanyInfo): DeadlineReminder[] => {
  if (!info) return [];

  const reminders: DeadlineReminder[] = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Filter requirements that apply to this company and have deadlines
  const applicableRequirements = regulatoryRequirements.filter(req => {
    // Skip if no deadline
    if (!req.deadline) return false;

    let isApplicable = true;

    // Check jurisdiction applicability
    if (req.jurisdictions && req.jurisdictions.length > 0) {
      const jurisdictions =
        typeof info.jurisdictions === 'string' ? [info.jurisdictions] : info.jurisdictions || [info.country];

      const jurisdictionMatches = req.jurisdictions.some(j => jurisdictions.some(cj => cj.includes(j)));
      if (!jurisdictionMatches) isApplicable = false;
    }

    // Check industry applicability
    if (req.industry && req.industry.length > 0) {
      const industryMatches = req.industry.some(i => info.industry.toLowerCase().includes(i.toLowerCase()));
      if (!industryMatches) isApplicable = false;
    }

    // Run custom applicability check
    if (req.applicableIf && !req.applicableIf(info)) {
      isApplicable = false;
    }

    return isApplicable;
  });

  // Generate deadline dates for each applicable requirement
  applicableRequirements.forEach(req => {
    if (!req.deadline) return;

    let dueDate: Date;
    let currentMonth: number;
    let currentQuarter: number;
    let nextQuarterMonth: number;

    switch (req.deadline.type) {
      case 'annual':
        // Set annual deadline for specified month (default to January if not specified)
        dueDate = new Date(currentYear, req.deadline.month ? req.deadline.month - 1 : 0, req.deadline.day || 15);
        // If deadline already passed this year, set for next year
        if (dueDate < currentDate) {
          dueDate.setFullYear(currentYear + 1);
        }
        break;

      case 'quarterly':
        // Find the next quarter end date
        currentMonth = currentDate.getMonth();
        currentQuarter = Math.floor(currentMonth / 3);
        nextQuarterMonth = (currentQuarter + 1) * 3;
        dueDate = new Date(currentYear, nextQuarterMonth, req.deadline.day || 15);
        break;

      case 'monthly':
        // Set deadline for next month
        dueDate = new Date(currentYear, currentDate.getMonth() + 1, req.deadline.day || 15);
        break;

      case 'once':
      default:
        // Set a one-time deadline 30 days from now
        dueDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
    }

    // Calculate days remaining
    const daysRemaining = Math.ceil((dueDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000));

    // Determine status
    let status: 'upcoming' | 'due' | 'overdue';
    if (daysRemaining < 0) {
      status = 'overdue';
    } else if (daysRemaining <= 7) {
      status = 'due';
    } else {
      status = 'upcoming';
    }

    reminders.push({
      requirementId: req.id,
      regulation: req.regulation,
      requirement: req.requirement,
      dueDate,
      description: req.deadline.description,
      severity: req.severity,
      status,
      daysRemaining,
    });
  });

  // Sort by days remaining (most urgent first)
  return reminders.sort((a, b) => a.daysRemaining - b.daysRemaining);
};
