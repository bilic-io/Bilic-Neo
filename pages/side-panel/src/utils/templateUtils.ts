// Template utility functions for replacing placeholders with company information

export interface CompanyInfo {
  name: string;
  industry: string;
  website: string;
  country: string;
  employees: string;
  description: string;
  repName: string;
  repEmail: string;
  regulatoryPortalUrl?: string;
  // Enhanced fields for compliance
  companySize?: 'small' | 'medium' | 'large' | 'enterprise';
  jurisdictions?: string[];
  hasCustomerData?: boolean;
  hasEmployeeData?: boolean;
  dataTypes?: string[];
  processingActivities?: string[];
  hasPrivacyPolicy?: boolean;
  hasDataProtectionOfficer?: boolean;
  lastComplianceReview?: string;
  [key: string]: string | string[] | boolean | undefined;
}

/**
 * Replace template placeholders with company information
 * @param content Template content with placeholders
 * @param companyInfo Company information object
 * @returns Content with placeholders replaced with company info
 */
export const replaceTemplatePlaceholders = (content: string, companyInfo?: CompanyInfo): string => {
  if (!companyInfo) return content;

  let processedContent = content;

  // Replace company-related placeholders
  if (companyInfo.website) {
    processedContent = processedContent.replace(/\[COMPANY_URL\]/g, companyInfo.website);
    processedContent = processedContent.replace(/\[WEBSITE_URL\]/g, companyInfo.website);
  }

  if (companyInfo.name) {
    processedContent = processedContent.replace(/\[COMPANY_NAME\]/g, companyInfo.name);
  }

  if (companyInfo.industry) {
    processedContent = processedContent.replace(/\[INDUSTRY\]/g, companyInfo.industry);
  }

  if (companyInfo.country) {
    processedContent = processedContent.replace(/\[COUNTRY\]/g, companyInfo.country);
  }

  // Add representative information placeholders
  if (companyInfo.repName) {
    processedContent = processedContent.replace(/\[REP_NAME\]/g, companyInfo.repName);
    processedContent = processedContent.replace(/\[REPRESENTATIVE_NAME\]/g, companyInfo.repName);
  }

  if (companyInfo.repEmail) {
    processedContent = processedContent.replace(/\[REP_EMAIL\]/g, companyInfo.repEmail);
    processedContent = processedContent.replace(/\[REPRESENTATIVE_EMAIL\]/g, companyInfo.repEmail);
  }

  // Add regulatory portal URL placeholder
  if (companyInfo.regulatoryPortalUrl) {
    processedContent = processedContent.replace(/\[REGULATORY_PORTAL_URL\]/g, companyInfo.regulatoryPortalUrl);
  }

  return processedContent;
};

/**
 * Fetch company information from Chrome storage
 * @returns Promise that resolves to company information or undefined
 */
export const getCompanyInfo = async (): Promise<CompanyInfo | undefined> => {
  return new Promise(resolve => {
    try {
      if (chrome && chrome.storage) {
        chrome.storage.local.get(['companyInfo'], result => {
          if (result.companyInfo) {
            resolve(result.companyInfo);
          } else {
            resolve(undefined);
          }
        });
      } else {
        resolve(undefined);
      }
    } catch (error) {
      console.error('Failed to load company info:', error);
      resolve(undefined);
    }
  });
};
