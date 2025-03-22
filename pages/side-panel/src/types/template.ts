export interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned?: boolean;
  isDefault?: boolean;
  createdAt?: number;
  updatedAt?: number;
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
    name: 'Compliance',
    description: 'Templates for regulatory compliance checks and assessments',
    icon: '🔍',
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Templates for security assessments and vulnerability scanning',
    icon: '🔒',
  },
  {
    id: 'legal',
    name: 'Legal',
    description: 'Templates for legal document generation and review',
    icon: '⚖️',
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Templates for regulatory communications and emails',
    icon: '📧',
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Your custom templates',
    icon: '✨',
  },
];
