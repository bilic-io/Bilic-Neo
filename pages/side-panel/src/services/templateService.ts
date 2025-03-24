import type { Template, TemplateCategory } from '../types/template';
import { DEFAULT_CATEGORIES } from '../types/template';

/**
 * Generate a unique ID for templates and categories
 */
const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

/**
 * Converts default templates to the new format with categories
 */
export const getDefaultTemplatesWithCategories = (): Template[] => {
  return [
    {
      id: generateUniqueId(),
      title: '🔍 Compliance Assessment',
      category: 'compliance',
      isDefault: true,
      content:
        'Visit [COMPANY_URL] and analyze their services. Based on their business model and industry focus, what compliance certificates and regulatory approvals would they need as a startup? Please provide a comprehensive list with explanations for each requirement. Consider factors such as: industry sector, target markets, data handling practices, and financial services offered.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📝 Regulatory Form Filling',
      category: 'compliance',
      isDefault: true,
      content:
        'Navigate to [REGULATORY_PORTAL_URL] and help me complete the compliance form. Identify all required fields, document uploads, and signature requirements. Use my company data to fill out the form accurately, highlighting any missing information I need to provide before submission.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🌐 Website Compliance Check',
      category: 'compliance',
      isDefault: true,
      content:
        'Analyze [WEBSITE_URL] for regulatory compliance issues. Check for proper privacy policy, terms of service, cookie consent mechanisms, accessibility standards (WCAG), and other required legal disclosures. Provide a detailed report of compliance gaps and recommended fixes to meet regulatory requirements.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🔒 Security Vulnerability Scan',
      category: 'security',
      isDefault: true,
      content:
        'Perform a security assessment of [WEBSITE_URL]. Check for common vulnerabilities such as XSS, CSRF, SQL injection, insecure cookies, missing security headers, and outdated dependencies. Provide a prioritized list of security issues and recommended remediation steps.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📧 Compliance Contact Email',
      category: 'communication',
      isDefault: true,
      content:
        'Draft a professional email to a regulatory body regarding our compliance status. The email should be from [REP_NAME] ([REP_EMAIL]) representing [COMPANY_NAME]. Include our industry ([INDUSTRY]), company size ([EMPLOYEES]), and a brief description of our services. The email should request information about upcoming regulatory changes that might affect our business operations.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🔑 AWS IAM User Creation',
      category: 'security',
      isDefault: true,
      content:
        'Navigate to AWS Management Console > IAM service. Create a new IAM user named "testuser" and add them to the "BillingGroup". Ensure proper permissions are set according to least privilege principles. Set up appropriate access keys and provide instructions for secure key management.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🔐 Security Headers Configuration',
      category: 'security',
      isDefault: true,
      content:
        'Navigate to the web server or CDN configuration for [WEBSITE_URL]. Implement and verify the following security headers: Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, and Referrer-Policy. Test the implementation using security header scanning tools and provide a compliance report.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🛡️ Azure Security Center Setup',
      category: 'security',
      isDefault: true,
      content:
        'Navigate to Azure Portal > Security Center. Enable standard tier protection for critical workloads. Configure email notifications for high severity alerts, implement automatic provisioning of the monitoring agent, and set up weekly scheduled vulnerability scans for VMs and container registries.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🔄 OAuth Application Configuration',
      category: 'security',
      isDefault: true,
      content:
        'Access the developer portal for [SERVICE_NAME] and create a new OAuth application. Configure the redirect URIs to [REDIRECT_URL], set appropriate scopes limiting access to only required resources, generate client credentials, and implement proper token storage according to OWASP best practices.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📊 GDPR Data Processing Documentation',
      category: 'compliance',
      isDefault: true,
      content:
        'Create a detailed data processing register for [COMPANY_NAME] that documents: categories of data subjects, types of personal data processed, purposes of processing, retention periods, security measures implemented, and legal basis for processing each data type.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📋 SOC 2 Evidence Collection',
      category: 'compliance',
      isDefault: true,
      content:
        'Gather evidence for SOC 2 Type II audit for the [SPECIFIC_CONTROL] control. Document the control description, implementation details, testing procedures used to validate effectiveness, and any exceptions found during testing period.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🔎 SSL Certificate Management',
      category: 'security',
      isDefault: true,
      content:
        'Access the certificate management portal for [DOMAIN]. Generate a new SSL certificate with proper SANs (Subject Alternative Names), configure auto-renewal, implement OCSP stapling, and ensure proper cipher suite configuration following current security best practices.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🤖 Web Automation Security Testing',
      category: 'security',
      isDefault: true,
      content:
        'Perform security testing on web automation scripts for [COMPANY_NAME]. Identify potential vulnerabilities such as insecure data storage, authentication bypass, and unauthorized access. Provide a detailed report of security issues and recommended remediation steps.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];
};

/**
 * Template service for managing templates in local storage
 */
export class TemplateService {
  /**
   * Initialize template storage if needed
   */
  static async initialize(): Promise<void> {
    try {
      const result = await new Promise<Record<string, unknown>>(resolve => {
        chrome.storage.local.get(
          [TEMPLATES_STORAGE_KEY, CATEGORIES_STORAGE_KEY, DEFAULT_TEMPLATES_VERSION_KEY],
          result => resolve(result),
        );
      });

      // Check if we need to initialize
      if (!result[CATEGORIES_STORAGE_KEY]) {
        await this.saveCategories(DEFAULT_CATEGORIES);
      }

      if (!result[TEMPLATES_STORAGE_KEY]) {
        // First time initialization
        await this.saveTemplates(getDefaultTemplatesWithCategories());
      } else {
        // First time or when default templates are updated (version will be different)
        const currentVersion = '1.2'; // Update this when default templates change
        if (!result[DEFAULT_TEMPLATES_VERSION_KEY] || result[DEFAULT_TEMPLATES_VERSION_KEY] !== currentVersion) {
          const defaultTemplates = getDefaultTemplatesWithCategories();

          // If upgrading, preserve user templates and only update defaults
          if (result[TEMPLATES_STORAGE_KEY]) {
            const existingTemplates: Template[] = result[TEMPLATES_STORAGE_KEY] as Template[];

            // Filter out default templates but keep user-created ones
            const userTemplates = existingTemplates.filter(template => !template.isDefault);

            // Combine user templates with new defaults
            await this.saveTemplates([...defaultTemplates, ...userTemplates]);
          } else {
            // First time initialization
            await this.saveTemplates(defaultTemplates);
          }

          // Update version
          await new Promise<void>(resolve => {
            chrome.storage.local.set({ [DEFAULT_TEMPLATES_VERSION_KEY]: currentVersion }, () => resolve());
          });
        }
      }
    } catch (error) {
      console.error('Failed to initialize templates:', error);
    }
  }

  /**
   * Get all templates
   */
  static async getTemplates(): Promise<Template[]> {
    return new Promise(resolve => {
      chrome.storage.local.get([TEMPLATES_STORAGE_KEY], result => {
        const templates = (result[TEMPLATES_STORAGE_KEY] as Template[]) || [];
        resolve(templates);
      });
    });
  }

  /**
   * Get templates by category
   */
  static async getTemplatesByCategory(categoryId: string): Promise<Template[]> {
    const templates = await this.getTemplates();
    return templates.filter(template => template.category === categoryId);
  }

  /**
   * Save all templates
   */
  static async saveTemplates(templates: Template[]): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.set({ [TEMPLATES_STORAGE_KEY]: templates }, () => {
        resolve();
      });
    });
  }

  /**
   * Add a new template
   */
  static async addTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    const templates = await this.getTemplates();

    const newTemplate: Template = {
      ...template,
      id: generateUniqueId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await this.saveTemplates([...templates, newTemplate]);
    return newTemplate;
  }

  /**
   * Update an existing template
   */
  static async updateTemplate(
    id: string,
    updates: Partial<Omit<Template, 'id' | 'createdAt'>>,
  ): Promise<Template | null> {
    const templates = await this.getTemplates();
    const index = templates.findIndex(t => t.id === id);

    if (index === -1) return null;

    const updatedTemplate: Template = {
      ...templates[index],
      ...updates,
      updatedAt: Date.now(),
    };

    templates[index] = updatedTemplate;
    await this.saveTemplates(templates);

    return updatedTemplate;
  }

  /**
   * Delete a template
   */
  static async deleteTemplate(id: string): Promise<boolean> {
    const templates = await this.getTemplates();
    const filteredTemplates = templates.filter(t => t.id !== id);

    if (filteredTemplates.length === templates.length) {
      return false; // Nothing was deleted
    }

    await this.saveTemplates(filteredTemplates);
    return true;
  }

  /**
   * Get all categories
   */
  static async getCategories(): Promise<TemplateCategory[]> {
    return new Promise(resolve => {
      chrome.storage.local.get([CATEGORIES_STORAGE_KEY], result => {
        const categories = result[CATEGORIES_STORAGE_KEY] || DEFAULT_CATEGORIES;
        resolve(categories);
      });
    });
  }

  /**
   * Save all categories
   */
  static async saveCategories(categories: TemplateCategory[]): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.set({ [CATEGORIES_STORAGE_KEY]: categories }, () => {
        resolve();
      });
    });
  }

  /**
   * Add a new category
   */
  static async addCategory(category: Omit<TemplateCategory, 'id'>): Promise<TemplateCategory> {
    const categories = await this.getCategories();

    const newCategory: TemplateCategory = {
      ...category,
      id: generateUniqueId(),
    };

    await this.saveCategories([...categories, newCategory]);
    return newCategory;
  }

  /**
   * Export templates to JSON
   */
  static exportTemplates(templates: Template[]): string {
    return JSON.stringify(templates);
  }

  /**
   * Import templates from JSON
   */
  static async importTemplates(jsonData: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonData) as Template[];

      if (!Array.isArray(parsed)) {
        throw new Error('Invalid template data format');
      }

      // Validate each template
      const validTemplates = parsed.filter(template => {
        return (
          typeof template.id === 'string' &&
          typeof template.title === 'string' &&
          typeof template.content === 'string' &&
          typeof template.category === 'string'
        );
      });

      // Add imported templates (keeping existing ones)
      const existingTemplates = await this.getTemplates();

      // Create a map of existing template IDs to avoid duplicates
      const existingIds = new Set(existingTemplates.map(t => t.id));

      // Filter out templates with duplicate IDs and add new ones
      const newTemplates = validTemplates.filter(t => !existingIds.has(t.id));

      await this.saveTemplates([...existingTemplates, ...newTemplates]);
      return true;
    } catch (error) {
      console.error('Failed to import templates:', error);
      return false;
    }
  }
}

// Storage keys
const TEMPLATES_STORAGE_KEY = 'userTemplates';
const CATEGORIES_STORAGE_KEY = 'templateCategories';
const DEFAULT_TEMPLATES_VERSION_KEY = 'defaultTemplatesVersion';
