export interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned?: boolean;
  isDefault?: boolean;
  createdAt?: number;
  updatedAt?: number;
  isWorkflow?: boolean;
  workflowSteps?: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  title: string;
  instruction: string;
  order: number;
  isCompleted?: boolean;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export const DEFAULT_CATEGORIES: TemplateCategory[] = [
  {
    id: 'workflows',
    name: 'Multi-Step Workflows',
    description: 'Complex multi-step processes for research, planning, and reporting',
    icon: '🔄',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Templates for shopping, price comparison, and product research',
    icon: '🛒',
  },
  {
    id: 'content',
    name: 'Content Creation',
    description: 'Templates for creating blog posts, social media content, and presentations',
    icon: '✏️',
  },
  {
    id: 'data-extraction',
    name: 'Data Extraction',
    description: 'Templates for extracting structured data from websites',
    icon: '📊',
  },
  {
    id: 'job-application',
    name: 'Job Application',
    description: 'Templates for job searching, interview preparation, and resume optimization',
    icon: '📝',
  },
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Templates for content engagement, scheduled posting, and influencer research',
    icon: '📱',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Templates for calendar management, email organization, and task prioritization',
    icon: '⏱️',
  },
  {
    id: 'form-filling',
    name: 'Form Filling',
    description: 'Templates for account registration and profile setup',
    icon: '📋',
  },
  {
    id: 'testing-qa',
    name: 'Testing & QA',
    description: 'Templates for website functionality and accessibility testing',
    icon: '🧪',
  },
  {
    id: 'web-research',
    name: 'Web Research',
    description: 'Templates for conducting research and gathering information from the web',
    icon: '🔍',
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Your custom templates and workflows',
    icon: '✨',
  },
];
