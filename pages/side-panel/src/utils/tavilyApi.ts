import type { CompanyInfo } from './templateUtils';
import { llmProviderStore } from '@extension/storage/dist/lib/settings/llmProviders';
import { ProviderTypeEnum } from '@extension/storage/dist/lib/settings/types';

// Flag to force using mock data for testing - set to false to use RSS feed
const USE_MOCK_DATA = false;

// Enable debug logging
const DEBUG = true;

// RSS Feed URL for security updates
const SECURITY_RSS_FEED = 'https://www.finextra.com/rss/channel.aspx?channel=security';

// Define the interface for the regulatory updates
export interface RegulationUpdate {
  id: string;
  title: string;
  authority: string;
  date: Date;
  summary: string;
  relevance: 'high' | 'medium' | 'low';
  category: 'finance' | 'privacy' | 'security' | 'employment' | 'environmental' | 'general';
  url: string;
  dueDate?: Date;
  country: string;
}

// Function to get the Gemini API key from settings (keeping for backward compatibility)
async function getGeminiApiKey(): Promise<string | null> {
  try {
    const geminiProvider = await llmProviderStore.getProvider(ProviderTypeEnum.Gemini);
    if (geminiProvider && geminiProvider.apiKey) {
      if (DEBUG) console.log('Found Gemini API key in settings');
      return geminiProvider.apiKey;
    }

    if (DEBUG) console.log('No Gemini API key found in settings');
    return null;
  } catch (error) {
    console.error('Error getting Gemini API key from settings:', error);
    return null;
  }
}

// Function to check if API key is set - always returning true now since we use RSS
export const hasTavilyApiKey = async (): Promise<boolean> => {
  return true;
};

// Function to get the API key (legacy function, kept for compatibility)
export const getTavilyApiKey = async (): Promise<string | null> => {
  return getGeminiApiKey();
};

// Parse the RSS feed and convert items to RegulationUpdate format
async function parseRssFeed(url: string): Promise<RegulationUpdate[]> {
  try {
    if (DEBUG) console.log('Fetching RSS feed from:', url);

    // Fetch the RSS feed
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    if (DEBUG) console.log('RSS feed fetched successfully');

    // Parse the XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');

    // Extract RSS items
    const items = xmlDoc.querySelectorAll('item');
    if (DEBUG) console.log(`Found ${items.length} items in RSS feed`);

    // Convert RSS items to RegulationUpdate objects
    const updates: RegulationUpdate[] = [];

    items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent?.trim() || 'Untitled Update';
      const description = item.querySelector('description')?.textContent?.trim() || '';
      const pubDateStr = item.querySelector('pubDate')?.textContent?.trim() || '';
      const link = item.querySelector('link')?.textContent?.trim() || '';

      // Convert date string to Date object
      const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();

      // Generate a unique ID
      const id = `finextra-${pubDate.getTime()}-${index}`;

      // Clean up the description by removing HTML tags
      const cleanDescription = description.replace(/<[^>]*>/g, '');

      // Create the update object
      const update: RegulationUpdate = {
        id,
        title,
        authority: 'Finextra', // Default authority for Finextra feeds
        date: pubDate,
        summary: cleanDescription,
        relevance: determineRelevance(title, cleanDescription),
        category: 'security', // Default category for security RSS feed
        url: link,
        country: 'Global', // Default country
      };

      updates.push(update);
    });

    return updates;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    return [];
  }
}

// Helper function to determine relevance based on content
function determineRelevance(title: string, description: string): 'high' | 'medium' | 'low' {
  const content = (title + ' ' + description).toLowerCase();

  // High relevance keywords
  const highRelevanceKeywords = [
    'critical',
    'urgent',
    'vulnerability',
    'breach',
    'attack',
    'exploit',
    'malware',
    'ransomware',
    'phishing',
    'zero-day',
    'backdoor',
    'compliance',
    'regulation',
    'mandatory',
    'deadline',
    'fine',
    'penalty',
  ];

  // Medium relevance keywords
  const mediumRelevanceKeywords = [
    'update',
    'patch',
    'security',
    'warning',
    'alert',
    'advisory',
    'risk',
    'threat',
    'mitigation',
    'protection',
    'defense',
  ];

  // Check for high relevance keywords
  for (const keyword of highRelevanceKeywords) {
    if (content.includes(keyword)) {
      return 'high';
    }
  }

  // Check for medium relevance keywords
  for (const keyword of mediumRelevanceKeywords) {
    if (content.includes(keyword)) {
      return 'medium';
    }
  }

  // Default to low relevance
  return 'low';
}

// Function to fetch regulatory updates using RSS feed
export const fetchRegulatoryUpdates = async (companyInfo: CompanyInfo): Promise<RegulationUpdate[]> => {
  if (USE_MOCK_DATA) {
    if (DEBUG) console.log('Using mock data for regulatory updates');
    return generateMockRegulationUpdates(companyInfo);
  }

  try {
    if (DEBUG) console.log('Fetching security updates from Finextra RSS');

    // Fetch and parse the RSS feed
    const updates = await parseRssFeed(SECURITY_RSS_FEED);

    if (updates.length > 0) {
      if (DEBUG) console.log(`Successfully fetched ${updates.length} security updates`);

      // Filter updates based on company information
      const filteredUpdates = filterUpdatesByCompanyInfo(updates, companyInfo);
      if (DEBUG) console.log(`After filtering, ${filteredUpdates.length} updates are relevant to ${companyInfo.name}`);

      return filteredUpdates.length > 0 ? filteredUpdates : generateMockRegulationUpdates(companyInfo);
    } else {
      console.warn('No updates found in RSS feed. Using mock data instead.');
      return generateMockRegulationUpdates(companyInfo);
    }
  } catch (error) {
    console.error('Error fetching security updates:', error);
    return generateMockRegulationUpdates(companyInfo);
  }
};

// Filter and rank updates based on company information
const filterUpdatesByCompanyInfo = (updates: RegulationUpdate[], companyInfo: CompanyInfo): RegulationUpdate[] => {
  if (!companyInfo.name && !companyInfo.industry && !companyInfo.country) {
    if (DEBUG) console.log('No company information provided for filtering. Returning all updates.');
    return updates;
  }

  // Keywords to look for in updates based on company info
  const companyName = companyInfo.name?.toLowerCase() || '';
  const industry = companyInfo.industry?.toLowerCase() || '';
  const country = companyInfo.country?.toLowerCase() || '';

  // Extract industry-related keywords
  const industryKeywords: Record<string, string[]> = {
    finance: [
      'bank',
      'banking',
      'financial',
      'finance',
      'payment',
      'transaction',
      'money',
      'investment',
      'credit',
      'loan',
    ],
    healthcare: ['health', 'medical', 'patient', 'hospital', 'clinic', 'doctor', 'pharma', 'drug', 'medicine'],
    technology: [
      'tech',
      'software',
      'hardware',
      'app',
      'cyber',
      'data',
      'digital',
      'online',
      'internet',
      'cloud',
      'computing',
    ],
    retail: ['retail', 'store', 'shop', 'ecommerce', 'customer', 'consumer', 'product', 'sale', 'merchant'],
    manufacturing: ['manufacturing', 'factory', 'production', 'industry', 'industrial', 'product', 'supply chain'],
    energy: ['energy', 'power', 'utility', 'electricity', 'gas', 'oil', 'renewable'],
  };

  // Get relevant keywords for this company's industry
  const relevantIndustryKeywords = industryKeywords[industry.toLowerCase()] || [];

  // Analyze and score each update for relevance to the company
  const scoredUpdates = updates.map(update => {
    // Combine all text content for analysis
    const content = `${update.title} ${update.summary} ${update.authority}`.toLowerCase();

    let score = 0;

    // Score based on direct company name mention (highest relevance)
    if (companyName && content.includes(companyName)) {
      score += 100;
    }

    // Score based on country match
    if (country && (update.country.toLowerCase().includes(country) || content.includes(country))) {
      score += 30;
    }

    // Score based on industry keywords
    if (industry) {
      // Direct industry mention
      if (content.includes(industry)) {
        score += 50;
      }

      // Check for industry-related keywords
      for (const keyword of relevantIndustryKeywords) {
        if (content.includes(keyword)) {
          score += 10;
        }
      }
    }

    // Add some base score for high relevance updates
    if (update.relevance === 'high') {
      score += 20;
    } else if (update.relevance === 'medium') {
      score += 10;
    }

    return { update, score };
  });

  // Sort by score (descending) and filter out low-relevance items
  const sortedUpdates = scoredUpdates.sort((a, b) => b.score - a.score).filter(item => item.score > 0); // Only include items with some relevance

  // Take top results (max 10 updates) or all if less than 10
  const topUpdates = sortedUpdates.slice(0, 10).map(item => item.update);

  // If no relevant updates found, return the top 5 general updates
  if (topUpdates.length === 0) {
    if (DEBUG) console.log('No company-specific updates found, returning top 5 general updates');
    return updates
      .sort((a, b) => {
        // Sort by relevance first
        const relevanceOrder = { high: 3, medium: 2, low: 1 };
        const relevanceDiff = relevanceOrder[b.relevance] - relevanceOrder[a.relevance];
        if (relevanceDiff !== 0) return relevanceDiff;

        // Then by date (newest first)
        return b.date.getTime() - a.date.getTime();
      })
      .slice(0, 5);
  }

  return topUpdates;
};

// Generate mock regulatory updates when API fails
const generateMockRegulationUpdates = (companyInfo: CompanyInfo): RegulationUpdate[] => {
  const country = companyInfo.country || 'Global';
  const industry = companyInfo.industry || 'General';

  // Base updates that apply to all companies
  const baseUpdates: RegulationUpdate[] = [
    {
      id: 'reg-001',
      title: 'Updated Data Protection Guidelines',
      authority: 'Global Data Protection Board',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      summary: 'New guidelines for handling customer data across borders have been published.',
      relevance: 'medium',
      category: 'privacy',
      url: 'https://example.com/data-guidelines',
      country: 'Global',
    },
    {
      id: 'reg-002',
      title: 'Cybersecurity Framework Updates',
      authority: 'International Cybersecurity Alliance',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      summary: 'Updated framework with new requirements for threat modeling and incident response.',
      relevance: 'high',
      category: 'security',
      url: 'https://example.com/cybersecurity-framework',
      country: 'Global',
    },
  ];

  // Country-specific updates
  const countryUpdates: Record<string, RegulationUpdate[]> = {
    'United States': [
      {
        id: 'us-001',
        title: 'FTC Privacy Rule Changes',
        authority: 'Federal Trade Commission',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        summary: 'New requirements for data breach notification and consumer consent.',
        relevance: 'high',
        category: 'privacy',
        url: 'https://example.com/ftc-privacy',
        country: 'United States',
      },
    ],
    'European Union': [
      {
        id: 'eu-001',
        title: 'NIS2 Directive Implementation',
        authority: 'European Commission',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        summary: 'New cybersecurity requirements for essential and important entities.',
        relevance: 'high',
        category: 'security',
        url: 'https://example.com/nis2',
        country: 'European Union',
      },
    ],
  };

  // Industry-specific updates
  const industryUpdates: Record<string, RegulationUpdate[]> = {
    Finance: [
      {
        id: 'ind-fin-001',
        title: 'Anti-Money Laundering Procedure Updates',
        authority: 'Financial Action Task Force',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        summary: 'Updated procedures for AML compliance and customer due diligence.',
        relevance: 'high',
        category: 'finance',
        url: 'https://example.com/aml-updates',
        country: 'Global',
      },
    ],
    Healthcare: [
      {
        id: 'ind-health-001',
        title: 'Patient Data Protection Standards',
        authority: 'Health Information Trust Alliance',
        date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
        summary: 'New standards for securing and transmitting patient health information.',
        relevance: 'high',
        category: 'privacy',
        url: 'https://example.com/healthcare-data-standards',
        country: 'Global',
      },
    ],
    Technology: [
      {
        id: 'ind-tech-001',
        title: 'AI Ethics Guidelines',
        authority: 'International Technology Standards Board',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        summary: 'New ethical guidelines for developing and deploying AI systems.',
        relevance: 'medium',
        category: 'general',
        url: 'https://example.com/ai-ethics',
        country: 'Global',
      },
    ],
  };

  // Combine all relevant updates
  let allUpdates = [...baseUpdates];

  // Add country-specific updates
  if (country in countryUpdates) {
    allUpdates = [...allUpdates, ...countryUpdates[country]];
  }

  // Handle EU-specific updates for European countries
  const euCountries = [
    'Austria',
    'Belgium',
    'Bulgaria',
    'Croatia',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Estonia',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'Hungary',
    'Ireland',
    'Italy',
    'Latvia',
    'Lithuania',
    'Luxembourg',
    'Malta',
    'Netherlands',
    'Poland',
    'Portugal',
    'Romania',
    'Slovakia',
    'Slovenia',
    'Spain',
    'Sweden',
  ];

  if (euCountries.includes(country)) {
    allUpdates = [...allUpdates, ...(countryUpdates['European Union'] || [])];
  }

  // Add industry-specific updates
  if (industry in industryUpdates) {
    allUpdates = [...allUpdates, ...industryUpdates[industry]];
  }

  // Sort by date (newest first)
  return allUpdates.sort((a, b) => b.date.getTime() - a.date.getTime());
};
