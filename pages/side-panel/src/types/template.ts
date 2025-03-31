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
    id: 'compliance',
    name: 'Compliance Processes',
    description: 'Workflows for regulatory compliance assessments and reporting',
    icon: '🔍',
  },
  {
    id: 'security',
    name: 'Security Operations',
    description: 'Workflows for security assessments and vulnerability management',
    icon: '🔒',
  },
  {
    id: 'research',
    name: 'Web Research',
    description: 'Workflows for gathering and analyzing information from the web',
    icon: '🌐',
  },
  {
    id: 'content',
    name: 'Content Creation',
    description: 'Workflows for drafting and optimizing various content types',
    icon: '✏️',
  },
  {
    id: 'marketing',
    name: 'Marketing Automation',
    description: 'Workflows for analyzing and improving marketing activities',
    icon: '📊',
  },
  {
    id: 'finance',
    name: 'Financial Operations',
    description: 'Workflows for financial analysis and reporting',
    icon: '💰',
  },
  {
    id: 'communication',
    name: 'Communication Flows',
    description: 'Workflows for crafting effective business communications',
    icon: '📧',
  },
  {
    id: 'workflows',
    name: 'Workflows',
    description: 'Multi-step task automation processes',
    icon: '🔄',
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Your custom templates and workflows',
    icon: '✨',
  },
];
