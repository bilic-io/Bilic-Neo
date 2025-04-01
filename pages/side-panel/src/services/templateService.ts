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
    // Web Research Prompts
    {
      id: generateUniqueId(),
      title: '🔍 Comparative Research',
      category: 'web-research',
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
          instruction: 'Present the information in a structured format that makes it easy to compare the options',
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
      category: 'web-research',
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
    {
      id: generateUniqueId(),
      title: '📰 News Summary',
      category: 'web-research',
      isDefault: true,
      isWorkflow: true,
      content: 'Research the latest developments regarding {topic} from at least 3 different reputable news sources.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Search for articles',
          instruction: 'Navigate to their search function and find articles about the topic from the past week',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Extract metadata',
          instruction: 'Extract the headline, publication date, and author',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Summarize key points',
          instruction: 'Summarize the key points in 2-3 sentences',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Synthesize findings',
          instruction:
            'Synthesize the findings into a comprehensive summary that notes any differences in reporting or perspective between the sources',
          order: 4,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '✓ Fact Verification',
      category: 'web-research',
      isDefault: true,
      isWorkflow: true,
      content: 'Verify the following claim: "{claim}".',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Search for information',
          instruction: 'Search for information about this claim from at least 3 different authoritative sources',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Extract source information',
          instruction:
            'For each source, extract the name and credibility of the source, their stance on the claim, and any evidence or data they provide',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Determine accuracy',
          instruction: 'Determine if the original claim is accurate, partially accurate, inaccurate, or unverifiable',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Provide supporting evidence',
          instruction: 'Include direct quotes and links to support your assessment',
          order: 4,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // E-commerce Prompts
    {
      id: generateUniqueId(),
      title: '🛒 Product Price Comparison',
      category: 'ecommerce',
      isDefault: true,
      isWorkflow: true,
      content:
        'Find the best price for {product} across major retailers including Amazon, Walmart, Best Buy, and Target.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Search for product',
          instruction: 'Navigate to each retailer website and search for the exact product',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Record pricing details',
          instruction: 'Record the current price, original price if on sale, and any available discounts',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Note shipping information',
          instruction: 'Note shipping costs and estimated delivery time',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Check availability',
          instruction: 'Check if the product is in stock',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create comparison table',
          instruction:
            'Compile the information into a comparison table and identify the best overall deal considering price, shipping, and delivery time',
          order: 5,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🛍️ Shopping Cart Automation',
      category: 'ecommerce',
      isDefault: true,
      isWorkflow: true,
      content: 'Add the following items to my shopping cart on {website}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Add first item',
          instruction: 'Add {item1} with {specifications1} in quantity {quantity1}',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Add second item',
          instruction: 'Add {item2} with {specifications2} in quantity {quantity2}',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Add third item',
          instruction: 'Add {item3} with {specifications3} in quantity {quantity3}',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Apply coupons',
          instruction: 'Apply coupon code: {coupon_code} if available',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Set shipping and checkout',
          instruction: 'Select the standard shipping option and proceed to checkout but stop before payment',
          order: 5,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '💰 Deal Finder',
      category: 'ecommerce',
      isDefault: true,
      isWorkflow: true,
      content: 'Find the best current deals on {product_category} from {store1}, {store2}, and {store3}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Navigate to deals section',
          instruction: 'Navigate to the deals/sale section of each store',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Filter for product category',
          instruction: 'Filter for {product_category} items',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Sort deals',
          instruction: 'Sort by discount percentage (highest first) if possible',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Record top deals',
          instruction:
            'Record the top 5 deals, including product name, original price, current price, discount percentage, and link',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Verify ratings',
          instruction:
            'Verify customer ratings are above 4 stars if available, and exclude deals that expire within 24 hours',
          order: 5,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🔎 Product Research',
      category: 'ecommerce',
      isDefault: true,
      isWorkflow: true,
      content: 'Research {product} and help me make an informed purchase decision.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Find product options',
          instruction:
            'Find at least 3 different models/brands that match the specified criteria for price range and features',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Gather detailed information',
          instruction:
            'For each product, find detailed specifications, expert reviews, customer reviews summary, and warranty information',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Check availability',
          instruction: 'Check availability at preferred and alternate retailers',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create comparison',
          instruction: 'Create a comparison highlighting the key differences in features, performance, and value',
          order: 4,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Content Creation Prompts
    {
      id: generateUniqueId(),
      title: '✍️ Blog Post Draft',
      category: 'content',
      isDefault: true,
      isWorkflow: true,
      content: 'Create a well-structured blog post about {topic} following these steps.',
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
          title: 'Add conclusion',
          instruction: 'Add a conclusion with a clear call-to-action',
          order: 5,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📅 Social Media Content Calendar',
      category: 'content',
      isDefault: true,
      isWorkflow: true,
      content:
        'Create a content calendar for {brand} for the next two weeks with daily posts for the desired social media platforms.',
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
    {
      id: generateUniqueId(),
      title: '📧 Email Newsletter',
      category: 'content',
      isDefault: true,
      isWorkflow: true,
      content: 'Draft a newsletter for {business} with compelling content and proper structure.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Create subject line',
          instruction: 'Draft a compelling subject line with an expected open rate of at least 25%',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Write greeting',
          instruction: 'Create a brief personalized greeting',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Develop main feature',
          instruction: 'Write a main feature article about {current_topic} (250-300 words)',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Add secondary content',
          instruction: 'Include secondary content highlighting {product/service/news} and a "What\'s New" section',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Finalize with CTA',
          instruction: 'Add a call-to-action section promoting {offer/event} and a footer with links',
          order: 5,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🎞️ Presentation Creation',
      category: 'content',
      isDefault: true,
      isWorkflow: true,
      content: 'Create a professional presentation about {topic} for {audience_type}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Create title and overview',
          instruction: 'Create a title slide with an engaging headline and an agenda/overview slide',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Develop problem statement',
          instruction: 'Create 1-2 slides that clearly articulate the problem statement',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Present key data',
          instruction: 'Create 2-3 slides with key data points and statistics',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Outline solution',
          instruction: 'Develop 3-4 slides showing the solution or main insights',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Provide implementation steps',
          instruction: 'Create 2-3 slides with implementation steps or recommendations',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Add conclusion and extras',
          instruction: 'Add a conclusion slide with key takeaways, a Q&A slide, and contact information',
          order: 6,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Data Extraction Prompts
    {
      id: generateUniqueId(),
      title: '📊 Tabular Data Extraction',
      category: 'data-extraction',
      isDefault: true,
      isWorkflow: true,
      content: 'Extract structured data from {website} about {data_category}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Navigate to target page',
          instruction: 'Navigate to {specific_page_or_search_query}',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify data structure',
          instruction: 'Identify the table or structured data containing information about {data_points}',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Extract complete dataset',
          instruction: 'Extract all rows and columns while preserving the relationship between data points',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Navigate pagination',
          instruction: 'If pagination exists, navigate through at least the first 3 pages and extract all data',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Apply filters',
          instruction: 'If filters are available, apply {filter_criteria} before extraction',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Format data',
          instruction: 'Format the extracted data in a CSV-compatible format with appropriate headers',
          order: 6,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📇 Contact Information Extraction',
      category: 'data-extraction',
      isDefault: true,
      isWorkflow: true,
      content:
        'Extract contact information for {company_name} from their official website and other authoritative sources.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Find office addresses',
          instruction: 'Locate and record main office address(es)',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Gather phone numbers',
          instruction: 'Find phone number(s) with department labels if available',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Collect email addresses',
          instruction: 'Gather email address(es) with department labels if available',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify key personnel',
          instruction: 'Record names and positions of key executives/leadership team',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Find social profiles',
          instruction: 'Locate official social media profiles',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Document customer support',
          instruction: 'Record customer support contact methods and hours',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Verify information',
          instruction: 'Cross-reference information with LinkedIn and Google Business profiles',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🔍 Product Specifications Extraction',
      category: 'data-extraction',
      isDefault: true,
      isWorkflow: true,
      content: 'Extract detailed specifications for {product} from {manufacturer_website} and retailer websites.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Gather technical specs',
          instruction: 'Extract technical specifications (dimensions, weight, materials, etc.)',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Collect performance data',
          instruction: 'Record performance specifications (speed, capacity, efficiency, etc.)',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Note compatibility info',
          instruction: 'Document compatibility information with other systems/products',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Record power requirements',
          instruction: 'Note power/energy requirements and ratings',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Document warranty details',
          instruction: 'Extract warranty details and coverage information',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'List included items',
          instruction: 'List included accessories or components in the package',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify discrepancies',
          instruction: 'Note any discrepancies between manufacturer and retailer specifications',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🏢 Competitor Analysis Extraction',
      category: 'data-extraction',
      isDefault: true,
      isWorkflow: true,
      content:
        'Perform a comprehensive competitor analysis for {company_name} by extracting information about their top 5 competitors.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Extract company mission',
          instruction:
            "Navigate to each competitor's website and extract their mission statement or about us information",
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify key offerings',
          instruction: 'Identify their key products/services and unique selling propositions',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Gather pricing data',
          instruction: 'Find pricing information if publicly available',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Define target audience',
          instruction: 'Note their target audience/market segments',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Extract recent news',
          instruction: 'Extract recent news or press releases from the past 3 months',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Analyze marketing strategies',
          instruction: 'Identify their marketing strategies based on website content and social media presence',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create comparison matrix',
          instruction: 'Compile the information in a structured format for easy comparison across all competitors',
          order: 7,
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
    // Job Application Prompts
    {
      id: generateUniqueId(),
      title: '🔎 Job Search and Application',
      category: 'job-application',
      isDefault: true,
      isWorkflow: true,
      content: 'Find and apply to {job_title} positions in the {industry} industry.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Search job boards',
          instruction: 'Search on job boards for positions matching job title, location, and experience level',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Extract job details',
          instruction: 'For each promising posting, extract the job title, company, location, and posting date',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Record responsibilities',
          instruction: 'Record the key responsibilities and requirements for each position',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Note application process',
          instruction: 'Note application deadline and process details',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Save application links',
          instruction: 'Save the direct application links for each position',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Tailor application materials',
          instruction: 'Prepare tailored resume and cover letter for the most promising opportunity',
          order: 6,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '👔 LinkedIn Profile Optimization',
      category: 'job-application',
      isDefault: true,
      isWorkflow: true,
      content: 'Optimize my LinkedIn profile to improve chances of getting noticed for {target_job_title} roles.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Analyze current profile',
          instruction: 'Navigate to LinkedIn and analyze each section of the profile',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Enhance visual elements',
          instruction: 'Suggest improvements for profile photo, banner, and visual elements',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Craft compelling headline',
          instruction: 'Create a headline that includes key terms for the target role',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Write professional summary',
          instruction: 'Craft a compelling about section highlighting relevant skills and accomplishments',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Enhance experience descriptions',
          instruction: 'Improve job descriptions with accomplishments and metrics',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Optimize skills section',
          instruction: 'Suggest the top 10 skills to list based on the target job title',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Research similar profiles',
          instruction: 'Find 3 successful professionals in similar roles and identify elements to incorporate',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🎯 Interview Preparation',
      category: 'job-application',
      isDefault: true,
      isWorkflow: true,
      content: 'Prepare for an upcoming job interview for a {job_title} position at {company_name}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Research company',
          instruction: "Research the company's mission, values, products/services, and recent developments",
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify work culture',
          instruction: 'Research work culture and employee reviews from sources like Glassdoor',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Prepare common questions',
          instruction: 'Create responses for 5 common general interview questions',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Practice technical questions',
          instruction: 'Develop answers for 7 role-specific technical questions',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Prepare behavioral examples',
          instruction: 'Craft responses for 3 behavioral questions using the STAR method',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Develop key skill stories',
          instruction: 'Prepare 2 stories that demonstrate experience with key skills',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create questions to ask',
          instruction: 'Develop 5 insightful questions to ask the interviewer about the role and company',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📄 Resume Tailoring',
      category: 'job-application',
      isDefault: true,
      isWorkflow: true,
      content: 'Tailor my resume for a {job_title} position at {company_name}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Analyze job description',
          instruction: 'Find and analyze the job description to extract key requirements and qualifications',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify key requirements',
          instruction: 'Extract key responsibilities, required skills, preferred qualifications, and company values',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Customize professional summary',
          instruction: 'Modify the professional summary/objective statement to align with this specific role',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Highlight relevant experience',
          instruction: 'Revise work experience bullet points to emphasize relevant accomplishments',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Prioritize matching skills',
          instruction: 'Adjust the skills section to prioritize skills mentioned in the job description',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Optimize for ATS',
          instruction: 'Add keywords from the job description to ensure ATS (Applicant Tracking System) compatibility',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Format for readability',
          instruction: 'Review formatting for ATS readability and professional appearance',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Social Media Prompts
    {
      id: generateUniqueId(),
      title: '💬 Content Engagement',
      category: 'social-media',
      isDefault: true,
      isWorkflow: true,
      content: 'Engage with content on {social_media_platform} related to {topic} to increase profile visibility.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Find engaging posts',
          instruction: 'Search for the top 10 most engaging recent posts about {topic}',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create thoughtful comments',
          instruction: 'For each post, craft a thoughtful comment that adds value to the conversation',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Include relevant hashtags',
          instruction: 'Include relevant hashtags in comments when appropriate',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Ask insightful questions',
          instruction: 'Add an insightful question when possible to encourage response',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify thought leaders',
          instruction: 'Identify 5 thought leaders in this space and follow their accounts',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Engage with thought leaders',
          instruction: 'Engage with their most recent relevant post and share one valuable post',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Join relevant communities',
          instruction: 'Find and join 2-3 relevant groups or communities focused on {topic}',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📆 Scheduled Posting',
      category: 'social-media',
      isDefault: true,
      isWorkflow: true,
      content:
        'Create and schedule social media posts for {business_name} on {platform1} and {platform2} for the upcoming week.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Create educational content',
          instruction: 'Create three educational posts about {industry_topic}',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Draft promotional posts',
          instruction: 'Create two promotional posts about {product/service}',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Share user content',
          instruction: 'Create one user-generated content share or testimonial highlight',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Comment on trending topics',
          instruction: 'Create one trending topic or industry news commentary',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Showcase company culture',
          instruction: 'Create one behind-the-scenes or company culture post',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Add call-to-actions',
          instruction: 'Create a relevant call-to-action for each post',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Optimize posting times',
          instruction: 'Recommend optimal posting times based on audience analytics',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '👂 Social Listening and Response',
      category: 'social-media',
      isDefault: true,
      isWorkflow: true,
      content: 'Conduct social listening for {brand_name} across platforms and craft appropriate responses.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Search for brand mentions',
          instruction: 'Search for recent mentions of {brand_name} and related terms',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Categorize mentions',
          instruction: 'Categorize mentions as positive feedback, customer service issues, product questions, etc.',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify priority conversations',
          instruction: 'Identify the most important conversations based on user influence and engagement',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Draft positive feedback responses',
          instruction: 'For positive feedback, draft responses that thank and reinforce brand relationship',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Address customer service issues',
          instruction: 'For customer service issues, acknowledge, express empathy, and move to private channel',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Answer product questions',
          instruction: 'For product questions, provide accurate information with links to resources',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Respond to competitor comparisons',
          instruction: 'For competitor comparisons, highlight differentiators without disparaging competitors',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🤝 Influencer Research',
      category: 'social-media',
      isDefault: true,
      isWorkflow: true,
      content: 'Research potential influencers for a partnership with {brand_name} to promote {product/service}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Find relevant influencers',
          instruction: 'Find 10 influencers with following in the target range who create content in your niche',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Analyze content quality',
          instruction: 'Analyze content quality and brand alignment for each influencer',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Assess posting consistency',
          instruction: 'Evaluate posting frequency and consistency over time',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Research previous partnerships',
          instruction: 'Find examples of previous brand partnerships and their performance',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Gauge audience sentiment',
          instruction: 'Review audience sentiment in comments and engagement quality',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Check for controversies',
          instruction: 'Search for any potential red flags or controversies that could affect brand reputation',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create ranked shortlist',
          instruction:
            'Create a ranked shortlist of the top 5 candidates with detailed metrics and suggested partnership approach',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Productivity Prompts
    {
      id: generateUniqueId(),
      title: '📅 Calendar Management',
      category: 'productivity',
      isDefault: true,
      isWorkflow: true,
      content: 'Optimize my work calendar for the upcoming week to maximize productivity and work-life balance.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Analyze current schedule',
          instruction: 'Go to my calendar and analyze my current schedule structure',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify scheduling issues',
          instruction: 'Identify meeting overlaps, back-to-back meetings without breaks, and schedule gaps',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Group similar meetings',
          instruction: 'Group similar types of meetings (e.g., one-on-ones, project reviews) on the same day',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Block focused work time',
          instruction: 'Block focused work time for priority projects',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Add buffer time',
          instruction: 'Add buffer time between meetings (15 minutes recommended)',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Schedule email processing',
          instruction: 'Schedule dedicated time for email/message processing (twice daily recommended)',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create self-care blocks',
          instruction: 'Add self-care blocks for preferred activities',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📨 Email Management',
      category: 'productivity',
      isDefault: true,
      isWorkflow: true,
      content: 'Help me achieve inbox zero by processing my email backlog efficiently.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Review recent emails',
          instruction: 'Go to my email client and focus on emails from the past specified time period',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Delete irrelevant emails',
          instruction: 'Delete obvious spam or irrelevant messages',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Archive FYI emails',
          instruction: 'Archive FYI emails that require no action',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Send quick replies',
          instruction: 'Respond to emails that take less than 2 minutes to answer',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Flag for follow-up',
          instruction: 'Flag emails requiring more thought or action',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Convert to tasks',
          instruction: 'Convert action items into tasks in your task management system',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create organizational system',
          instruction: 'Create appropriate folders/labels for different projects or clients',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📋 Task Prioritization',
      category: 'productivity',
      isDefault: true,
      isWorkflow: true,
      content: 'Help me prioritize my tasks and create an effective work plan for the next time period.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Extract current tasks',
          instruction: 'Extract all current tasks from my task management system',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Categorize by attributes',
          instruction: 'Categorize tasks by project, deadline, time required, dependencies, and strategic importance',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Apply Eisenhower Matrix',
          instruction: 'Apply the Eisenhower Matrix to sort tasks by urgency and importance',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify top priorities',
          instruction: 'Create a specific action plan with top 3 priorities for today',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Schedule focus blocks',
          instruction: 'Schedule blocks for focused work on important tasks',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Plan delegation',
          instruction: 'Identify tasks to delegate with draft delegation messages',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Group similar tasks',
          instruction: 'Identify tasks that can be batched together for efficiency',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📁 Information Organization',
      category: 'productivity',
      isDefault: true,
      isWorkflow: true,
      content: 'Help me organize my digital information and files to create a more efficient system.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Assess current organization',
          instruction: 'Assess my current file organization on the storage platform',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify organizational issues',
          instruction: 'Analyze for inconsistent naming, duplicates, outdated files, and unclear categorization',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Design folder structure',
          instruction: 'Propose an improved organizational system with logical folder hierarchy',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Establish naming conventions',
          instruction: 'Create consistent file naming conventions',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Set permission guidelines',
          instruction: 'Recommend permission settings for shared files',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Implement folder structure',
          instruction: 'Create the suggested folder structure',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Reorganize files',
          instruction: 'Move files into the appropriate locations starting with frequently accessed ones',
          order: 7,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Document the system',
          instruction: 'Document the new system with guidelines for maintaining it',
          order: 8,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Form Filling Prompts
    {
      id: generateUniqueId(),
      title: '👤 Account Registration',
      category: 'form-filling',
      isDefault: true,
      isWorkflow: true,
      content: 'Complete the registration process for a new account on {website}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Navigate to sign-up page',
          instruction: 'Navigate to the website and locate the sign-up or registration page',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Choose registration method',
          instruction: 'Determine available registration methods (email, social media, phone)',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Fill required fields',
          instruction: 'Complete required fields with appropriate information',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Handle optional fields',
          instruction: 'For optional fields, set preferences and opt out of marketing where appropriate',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Review privacy settings',
          instruction: 'Review privacy settings and set according to preferences',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Complete verification',
          instruction: 'Complete any verification steps (email, phone, CAPTCHA)',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Review terms of service',
          instruction: 'Review terms of service and highlight any concerning clauses',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📝 Comprehensive Profile Setup',
      category: 'form-filling',
      isDefault: true,
      isWorkflow: true,
      content: 'Set up a complete profile on {platform} to maximize its effectiveness for {goal}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Access profile settings',
          instruction: 'Log in to the platform and navigate to the profile settings section',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Upload profile picture',
          instruction: 'Upload a professional profile picture from the specified location',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Complete personal info',
          instruction: 'Complete personal/professional bio information',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Add professional experience',
          instruction: 'Add detailed experience information with descriptions and dates',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Include education details',
          instruction: 'Add education history with degrees, institutions, and dates',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'List skills and interests',
          instruction: 'Add relevant skills, certifications, and interest areas',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Set privacy preferences',
          instruction: 'Configure appropriate privacy settings for the profile',
          order: 7,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Review and optimize',
          instruction: 'Check profile completeness indicators and address any suggestions for improvement',
          order: 8,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Testing and QA Prompts
    {
      id: generateUniqueId(),
      title: '🧪 Website Functionality Testing',
      category: 'testing-qa',
      isDefault: true,
      isWorkflow: true,
      content:
        'Perform a comprehensive functionality test of {website} focusing on {specific_feature} and core user journeys.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Test registration flow',
          instruction: 'Test the user registration and login process with test credentials',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Verify email confirmation',
          instruction: 'Verify email confirmation process and password reset functionality',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test specific feature',
          instruction: 'Test all UI elements (buttons, forms, dropdowns) of the specific feature',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Check validation and errors',
          instruction: 'Verify data entry validation and test error handling and messaging',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test critical user journeys',
          instruction: 'Test critical user journeys like checkout, account settings update, etc.',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Check cross-browser compatibility',
          instruction: 'Test core functionality on different browsers and document any differences',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Document test results',
          instruction: 'Document test cases, expected vs. actual behavior, and issues with severity ratings',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '📱 Responsive Design Testing',
      category: 'testing-qa',
      isDefault: true,
      isWorkflow: true,
      content: 'Test the responsive design of {website} across various device types and screen sizes.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Identify key pages',
          instruction: 'Identify the key pages to test (homepage, product pages, checkout, etc.)',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test mobile screen sizes',
          instruction: 'Test mobile screen sizes: 320px, 375px, 414px (portrait and landscape)',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test tablet screen sizes',
          instruction: 'Test tablet screen sizes: 768px, 1024px (portrait and landscape)',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test desktop screen sizes',
          instruction: 'Test desktop screen sizes: 1366px, 1920px',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Evaluate content rendering',
          instruction: 'Evaluate content visibility, readability, and image/media scaling',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Check interactive elements',
          instruction: 'Test navigation usability, form functionality, and touch targets',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test responsive features',
          instruction: 'Test specific responsive features like hamburger menus, collapsible sections, etc.',
          order: 7,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Document issues',
          instruction: 'Document all issues with screenshots, device information, and recommended fixes',
          order: 8,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '👥 User Registration Flow Testing',
      category: 'testing-qa',
      isDefault: true,
      isWorkflow: true,
      content: 'Test the entire user registration flow on {website} to identify any usability issues or bugs.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Find registration option',
          instruction: "Navigate to the site's homepage and find the registration option",
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test registration methods',
          instruction: 'Test email, social media, and phone number registration methods if available',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test form validation',
          instruction: 'Test form validation for each field and password strength requirements',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Document registration process',
          instruction: 'Document field requirements, error messages, and steps in the process',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test edge cases',
          instruction: 'Test edge cases like using already registered email or abandoning mid-process',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Verify post-registration',
          instruction: 'Verify welcome email, initial account state, and onboarding processes',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test logout and login',
          instruction: 'Test logout and login functionality with the new account',
          order: 7,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '♿ Accessibility Testing',
      category: 'testing-qa',
      isDefault: true,
      isWorkflow: true,
      content: 'Conduct an accessibility test of {website} to identify issues that may impact users with disabilities.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Test keyboard navigation',
          instruction: 'Test keyboard navigation through all interactive elements with visible focus indicators',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Check screen reader compatibility',
          instruction: 'Test screen reader compatibility using VoiceOver or NVDA',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Verify alternative text',
          instruction: 'Check for appropriate alt text on images and accessible form labels',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test color contrast',
          instruction: "Check text contrast against backgrounds and verify information isn't conveyed by color alone",
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test at increased zoom',
          instruction: 'Verify the site works at 200% zoom and in high contrast mode',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Test form accessibility',
          instruction: 'Verify clear error messages and appropriate input validation for forms',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Check WCAG compliance',
          instruction: 'Verify proper HTML structure, heading hierarchy, and ARIA implementations',
          order: 7,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Document accessibility issues',
          instruction: 'Document all issues with screenshots, steps to reproduce, and WCAG references',
          order: 8,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // Multi-Step Workflow Prompts
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
          title: 'Conduct industry research',
          instruction: 'Search for industry reports from sources like Statista, IBISWorld, and Gartner',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Find recent news',
          instruction: 'Find recent news articles about the industry from the past 6 months',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify top companies',
          instruction: 'Identify the top 5 companies in this space and gather key metrics',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Organize data',
          instruction: 'Create a spreadsheet to compile numerical data and key statistics',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Analyze competitive positioning',
          instruction: 'Analyze competitive positioning of major players and market opportunities',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Identify key trends',
          instruction: 'Identify 3-5 key trends shaping the industry',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create report document',
          instruction:
            'Create a structured report document with executive summary, analysis sections, and recommendations',
          order: 7,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Add visualizations',
          instruction: 'Add appropriate charts and tables from your research',
          order: 8,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🎉 Event Planning Workflow',
      category: 'workflows',
      isDefault: true,
      isWorkflow: true,
      content: 'Plan a {event_type} for {number_of_attendees} people on {date} with a budget of {budget}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Research venues',
          instruction: 'Search for appropriate venues that can accommodate your attendees and date',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Compare venue options',
          instruction: 'Compare at least 5 options based on availability, cost, amenities, and reviews',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Select vendors',
          instruction: 'Research and compare options for catering, photography, entertainment, and decorations',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create budget spreadsheet',
          instruction: 'Create a detailed budget spreadsheet with categories for all expenses',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Develop planning timeline',
          instruction: 'Create a planning timeline with milestones and deadlines',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Design day-of schedule',
          instruction: 'Develop a detailed day-of schedule for the event',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create invitation plan',
          instruction: 'Design an invitation template and set up a communication plan for attendees',
          order: 7,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Finalize comprehensive plan',
          instruction: 'Compile all information into a comprehensive event plan document',
          order: 8,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🌐 Website Migration Workflow',
      category: 'workflows',
      isDefault: true,
      isWorkflow: true,
      content: 'Create a comprehensive plan for migrating {website} from {current_platform} to {new_platform}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Conduct content audit',
          instruction: 'Crawl the existing website to inventory all pages, media, and functionality',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create content mapping',
          instruction: 'Create a content mapping spreadsheet for all site content',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Plan technical migration',
          instruction: 'Document the migration process for database, user accounts, and URLs',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create migration timeline',
          instruction: 'Create a detailed migration timeline with phases and responsibilities',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Develop testing plan',
          instruction: 'Create test cases for content integrity, functionality, and performance',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Design launch strategy',
          instruction: 'Create a detailed launch day plan with rollback procedures',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Plan communications',
          instruction: 'Develop a communication plan for users and stakeholders',
          order: 7,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create monitoring schedule',
          instruction: 'Create a post-launch monitoring schedule to ensure successful migration',
          order: 8,
          isCompleted: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: generateUniqueId(),
      title: '🚀 Product Launch Campaign',
      category: 'workflows',
      isDefault: true,
      isWorkflow: true,
      content:
        'Design and plan a comprehensive product launch campaign for {product_name} targeting {target_audience}.',
      workflowSteps: [
        {
          id: generateUniqueId(),
          title: 'Research target audience',
          instruction: 'Research the target audience demographics and preferences',
          order: 1,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Analyze competitor launches',
          instruction: 'Analyze competitor product launches in the same space',
          order: 2,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Develop campaign strategy',
          instruction: 'Create campaign objectives and key performance indicators',
          order: 3,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Craft core messaging',
          instruction: 'Develop the central value proposition and messaging',
          order: 4,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Create content plan',
          instruction: 'Design landing page, content calendar, and press materials',
          order: 5,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Plan launch execution',
          instruction: 'Create a detailed launch day checklist and posting schedule',
          order: 6,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Set up analytics tracking',
          instruction: 'Set up analytics tracking for all channels and create a KPI dashboard',
          order: 7,
          isCompleted: false,
        },
        {
          id: generateUniqueId(),
          title: 'Design feedback collection',
          instruction: 'Design a feedback collection mechanism and response plan',
          order: 8,
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
