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
    // Web Research Templates
    {
      id: generateUniqueId(),
      title: '🔍 Comparative Research',
      category: 'research',
      isDefault: true,
      isWorkflow: true,
      content:
        'Research and compare the pricing and key features of the top 3 competitors in the {industry} space: {competitor1}, {competitor2}, and {competitor3}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Navigate to pricing pages',
          instruction: 'Navigate to their pricing page',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Extract pricing tiers',
          instruction: 'Extract the pricing tiers and their costs',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'List key features',
          instruction: 'List the key features in each tier',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Note special offers',
          instruction: 'Note any special offers or discounts currently available',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Present comparison',
          instruction: 'Present the information in a structured format that makes it easy to compare the options.',
          order: 5,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📚 Academic Research',
      category: 'research',
      isDefault: true,
      isWorkflow: true,
      content: 'Find the latest research papers on {topic} published after {date}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Extract paper details',
          instruction: 'Extract the title, authors, and publication date',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Capture abstract',
          instruction: 'Capture the abstract',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Note citations',
          instruction: 'Note the number of citations',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Record links',
          instruction: 'Record the DOI or direct link to the paper',
          order: 4,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Security Templates
    {
      id: generateUniqueId(),
      title: '🔍 Security Vulnerability Scan',
      category: 'security',
      isDefault: true,
      isWorkflow: true,
      content: 'Perform a security assessment of {website_url}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Check common vulnerabilities',
          instruction: 'Check for common vulnerabilities such as XSS, CSRF, SQL injection',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Analyze security headers',
          instruction: 'Check for missing security headers and insecure cookies',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify outdated dependencies',
          instruction: 'Scan for outdated dependencies or software versions with known vulnerabilities',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create remediation plan',
          instruction: 'Provide a prioritized list of security issues and recommended remediation steps',
          order: 4,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🔐 Security Headers Configuration',
      category: 'security',
      isDefault: true,
      isWorkflow: true,
      content: 'Navigate to the web server or CDN configuration for {website_url} to implement security headers.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Implement CSP',
          instruction: 'Implement Content-Security-Policy with appropriate directives',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Set MIME type options',
          instruction: 'Configure X-Content-Type-Options to prevent MIME type sniffing',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Configure framing policy',
          instruction: 'Set X-Frame-Options to protect against clickjacking',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Enable HSTS',
          instruction: 'Configure Strict-Transport-Security for secure connections',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test implementation',
          instruction: 'Test the implementation using security header scanning tools and provide a compliance report',
          order: 5,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🔄 OAuth Application Configuration',
      category: 'security',
      isDefault: true,
      isWorkflow: true,
      content: 'Configure OAuth for secure application authentication.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Register OAuth client',
          instruction: 'Register client application with the OAuth provider',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Configure redirect URIs',
          instruction: 'Set up secure redirect URIs that point to your application',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Set up scopes',
          instruction: 'Define the minimum required permission scopes for your application',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Implement PKCE',
          instruction: 'Add Proof Key for Code Exchange to enhance security for public clients',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test authorization flow',
          instruction: 'Test the complete OAuth flow to ensure proper functionality',
          order: 5,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Compliance Templates
    {
      id: generateUniqueId(),
      title: '📋 Compliance Assessment',
      category: 'compliance',
      isDefault: true,
      isWorkflow: true,
      content: 'Analyze {company_url} for regulatory compliance issues across multiple domains.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Company analysis',
          instruction: 'Examine the company website to identify industry, services, and target markets',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Regulatory framework identification',
          instruction: 'List all potential regulatory frameworks that apply to this business',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Gap analysis',
          instruction: 'Check for evidence of compliance with identified regulations on the website',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Remediation plan',
          instruction: 'Create a prioritized action plan for addressing compliance gaps',
          order: 4,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📊 Data Processing Register',
      category: 'compliance',
      isDefault: true,
      isWorkflow: true,
      content: 'Create a detailed data processing register for {company_name}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Identify data subjects',
          instruction: 'Document categories of data subjects (customers, employees, etc.)',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Catalog personal data',
          instruction: 'List all types of personal data processed by the organization',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Define processing purposes',
          instruction: 'Document the purposes for which each type of data is processed',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Document retention periods',
          instruction: 'Specify how long each type of data is kept before deletion',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'List security measures',
          instruction: 'Document security measures implemented to protect the data',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify legal basis',
          instruction: 'Specify the legal basis for processing each data type',
          order: 6,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Content Creation Workflow
    {
      id: generateUniqueId(),
      title: '✍️ Blog Post Draft',
      category: 'content',
      isDefault: true,
      isWorkflow: true,
      content: 'Go to Google Docs and create a well-structured blog post about {topic}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Research current perspectives',
          instruction: 'Research the top 5 articles on Google about {topic} to understand current perspectives',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Draft headline',
          instruction: 'Draft a compelling headline that includes the primary keyword',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Write introduction',
          instruction: 'Write an introduction that highlights the key problem or opportunity',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create main sections',
          instruction: 'Create 3-5 main sections with appropriate subheadings',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Write conclusion',
          instruction: 'Add a conclusion with a clear call-to-action',
          order: 5,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Workflow Processes
    {
      id: generateUniqueId(),
      title: '📊 Research and Report Generation',
      category: 'workflows',
      isDefault: true,
      isWorkflow: true,
      content: 'Create a comprehensive market research report on {industry} trends and competitive landscape.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Research Phase',
          instruction: 'Search for industry reports and gather data about top companies and market metrics',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Data Organization',
          instruction: 'Compile numerical data and statistics into structured formats',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Analysis Phase',
          instruction: 'Identify key trends and analyze competitive positioning of major players',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Report Creation',
          instruction: 'Create a professional document with executive summary, detailed analysis, and recommendations',
          order: 4,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Marketing Templates
    {
      id: generateUniqueId(),
      title: '📅 Social Media Content Calendar',
      category: 'marketing',
      isDefault: true,
      isWorkflow: true,
      content: 'Create a content calendar for {brand} with daily posts for social media platforms.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Create daily themes',
          instruction: "Create a theme or topic aligned with the brand's industry",
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Draft post copy',
          instruction: 'Draft the main copy for each post with appropriate length per platform',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Suggest hashtags',
          instruction: 'Suggest relevant hashtags for each post (3-5 per post)',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Describe visuals',
          instruction: 'Describe the type of image or video that should accompany each post',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Optimize posting schedule',
          instruction: 'Recommend optimal posting times based on platform best practices',
          order: 5,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Financial Operations
    {
      id: generateUniqueId(),
      title: '💰 Financial Report Automation',
      category: 'finance',
      isDefault: true,
      isWorkflow: true,
      content: 'Streamline financial reporting processes and generate insightful financial analyses.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Data Collection',
          instruction: 'Gather all necessary financial data from relevant sources',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Report Template Design',
          instruction: 'Design comprehensive templates for financial reports',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Analysis Generation',
          instruction: 'Calculate key performance indicators and perform comparative analysis',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Insights & Recommendations',
          instruction: 'Provide actionable insights based on the financial analysis',
          order: 4,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Communication Workflow
    {
      id: generateUniqueId(),
      title: '📧 Professional Email Drafting',
      category: 'communication',
      isDefault: true,
      isWorkflow: true,
      content: 'Draft a professional email for {purpose} to {recipient}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Create subject line',
          instruction: 'Draft a clear, concise subject line that conveys the purpose',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Write greeting',
          instruction: 'Include an appropriate professional greeting',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Draft main content',
          instruction: 'Write the body of the email with clear paragraphs and key points',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Add call-to-action',
          instruction: 'Include a specific call-to-action or next steps',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create signature',
          instruction: 'End with an appropriate closing and professional signature',
          order: 5,
          isCompleted: false,
        },
      ],
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
        const currentVersion = '1.3'; // Update this when default templates change
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
