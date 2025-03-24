// Template data
export const defaultTemplates = [
  {
    id: '1',
    title: '🔍 Compliance Assessment',
    content:
      'Visit [COMPANY_URL] and analyze their services. Based on their business model and industry focus, what compliance certificates and regulatory approvals would they need as a startup? Please provide a comprehensive list with explanations for each requirement. Consider factors such as: industry sector, target markets, data handling practices, and financial services offered.',
    category: 'compliance',
    isDefault: true,
  },
  {
    id: '2',
    title: '📝 Regulatory Form Filling',
    content:
      'Navigate to [REGULATORY_PORTAL_URL] and help me complete the compliance form. Identify all required fields, document uploads, and signature requirements. Use my company data to fill out the form accurately, highlighting any missing information I need to provide before submission.',
    category: 'compliance',
    isDefault: true,
  },
  {
    id: '3',
    title: '🌐 Website Compliance Check',
    content:
      'Analyze [WEBSITE_URL] for regulatory compliance issues. Check for proper privacy policy, terms of service, cookie consent mechanisms, accessibility standards (WCAG), and other required legal disclosures. Provide a detailed report of compliance gaps and recommended fixes to meet regulatory requirements.',
    category: 'compliance',
    isDefault: true,
  },
  {
    id: '4',
    title: '🔒 Security Vulnerability Scan',
    content:
      'Perform a security assessment of [WEBSITE_URL]. Check for common vulnerabilities such as XSS, CSRF, SQL injection, insecure cookies, missing security headers, and outdated dependencies. Provide a prioritized list of security issues and recommended remediation steps.',
    category: 'security',
    isDefault: true,
  },
  {
    id: '5',
    title: '📧 Compliance Contact Email',
    content:
      'Draft a professional email to a regulatory body regarding our compliance status. The email should be from [REP_NAME] ([REP_EMAIL]) representing [COMPANY_NAME]. Include our industry ([INDUSTRY]), company size ([EMPLOYEES]), and a brief description of our services. The email should request information about upcoming regulatory changes that might affect our business operations.',
    category: 'communication',
    isDefault: true,
  },
  {
    id: '6',
    title: '🇪🇺 GDPR Compliance Audit',
    content:
      'Analyze [COMPANY_URL] for GDPR compliance. Check for proper consent mechanisms, privacy policy, data processing agreements, and data subject rights. Identify any potential compliance gaps and provide recommendations for remediation to ensure full GDPR compliance.',
    category: 'compliance',
    isDefault: true,
  },
  {
    id: '7',
    title: '📄 Regulatory Document Analysis',
    content:
      'Analyze the uploaded PDF document for compliance with relevant regulations. Identify any gaps or inconsistencies and provide recommendations for improvement.',
    category: 'legal',
    isDefault: true,
  },
  {
    id: '8',
    title: '🤖 AI Ethics & Compliance',
    content:
      'Evaluate our AI implementation at [COMPANY_URL] against current AI ethics frameworks and emerging regulations. Consider transparency, bias mitigation, privacy, and accountability. Provide recommendations for responsible AI deployment.',
    category: 'compliance',
    isDefault: true,
  },
  {
    id: '9',
    title: '🔑 AWS IAM User Creation',
    content:
      'Navigate to AWS Management Console > IAM service. Create a new IAM user named "testuser" and add them to the "BillingGroup". Ensure proper permissions are set according to least privilege principles. Set up appropriate access keys and provide instructions for secure key management.',
    category: 'security',
    isDefault: true,
  },
];
