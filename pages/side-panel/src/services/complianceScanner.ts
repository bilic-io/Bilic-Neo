import type { ComplianceGap, DeadlineReminder } from '../utils/complianceUtils';

// Define CompanyInfo interface directly since we can't import it
interface CompanyInfo {
  name: string;
  industry: string;
  website: string;
  country: string;
  employees: string;
  description: string;
  repName: string;
  repEmail: string;
}

interface ComplianceScanResult {
  gaps: ComplianceGap[];
  riskScore: number;
  checklist: {
    industry: string;
    items: Array<{
      id: string;
      text: string;
      importance: 'critical' | 'important' | 'recommended';
    }>;
  };
  deadlines: DeadlineReminder[];
  rawReport: string;
}

/**
 * Scan a website for compliance issues using LLM and browser automation
 */
export async function scanWebsiteCompliance(
  url: string,
  companyInfo: CompanyInfo,
  template: string = '',
): Promise<ComplianceScanResult> {
  // If no template provided, use default
  const scanTemplate =
    template ||
    `Analyze ${url} for regulatory compliance issues. 
  Check for proper privacy policy, terms of service, cookie consent mechanisms, 
  accessibility standards (WCAG), and other required legal disclosures. 
  Provide a detailed report of compliance gaps and recommended fixes to meet regulatory requirements.
  Format the output as JSON with the following structure:
  {
    "gaps": [
      {
        "requirementId": "string",
        "regulation": "string",
        "requirement": "string",
        "description": "string",
        "severity": "high|medium|low",
        "recommendation": "string"
      }
    ],
    "riskScore": number (0-100),
    "checklist": {
      "industry": "string",
      "items": [
        {
          "id": "string",
          "text": "string",
          "importance": "critical|important|recommended"
        }
      ]
    },
    "deadlines": [
      {
        "requirementId": "string",
        "regulation": "string",
        "requirement": "string",
        "dueDate": "YYYY-MM-DD",
        "description": "string",
        "severity": "high|medium|low",
        "status": "upcoming|due|overdue",
        "daysRemaining": number
      }
    ]
  }`;

  try {
    // Use the Bilic Neo message executor to analyze the website
    // This needs to be adjusted to work with the actual executor in the project
    const message = {
      role: 'user',
      content: scanTemplate,
    };

    // Call the background script to execute this analysis
    // This would typically be handled through chrome.runtime.sendMessage
    const result = await new Promise<string>(resolve => {
      chrome.runtime.sendMessage(
        {
          type: 'EXECUTE_MESSAGE_WITH_URL',
          payload: {
            message,
            url,
            needsResponse: true,
          },
        },
        response => {
          if (chrome.runtime.lastError) {
            console.error('Error executing message:', chrome.runtime.lastError);
            resolve('Error: Failed to scan website for compliance issues');
          } else {
            resolve(response?.content || 'No response from compliance scan');
          }
        },
      );
    });

    // Parse the LLM response
    let parsedResult: ComplianceScanResult;

    try {
      // Extract JSON from the response if it's wrapped in text
      const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/{[\s\S]*}/);

      const jsonStr = jsonMatch ? jsonMatch[0] : result;
      const cleaned = jsonStr.replace(/```json|```/g, '').trim();

      const parsed = JSON.parse(cleaned);

      // Format the response according to our interface
      parsedResult = {
        gaps: parsed.gaps || [],
        riskScore: parsed.riskScore || 50,
        checklist: parsed.checklist || {
          industry: companyInfo.industry || 'General',
          items: [{ id: 'fallback-1', text: 'Create compliance checklist', importance: 'critical' }],
        },
        deadlines: parsed.deadlines || [],
        rawReport: result,
      };

      // Process dates for deadlines if they're strings
      parsedResult.deadlines = parsedResult.deadlines.map(deadline => {
        if (typeof deadline.dueDate === 'string') {
          return {
            ...deadline,
            dueDate: new Date(deadline.dueDate),
          };
        }
        return deadline;
      });
    } catch (err) {
      console.error('Failed to parse compliance scan result:', err);
      // Fallback to default structure if parsing fails
      parsedResult = {
        gaps: [
          {
            requirementId: 'parse-error',
            regulation: 'Error',
            requirement: 'Parse Error',
            description: 'Failed to parse LLM response',
            severity: 'high',
            recommendation: 'Try again or check the raw report',
          },
        ],
        riskScore: 75,
        checklist: {
          industry: companyInfo.industry || 'General',
          items: [{ id: 'error-1', text: 'Retry compliance scan', importance: 'critical' }],
        },
        deadlines: [],
        rawReport: result,
      };
    }

    return parsedResult;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Compliance scan failed:', errorMessage);
    throw new Error(`Compliance scan failed: ${errorMessage}`);
  }
}

/**
 * Calculate compliance risk score based on identified gaps
 */
export function calculateRiskScore(gaps: ComplianceGap[]): number {
  if (!gaps || gaps.length === 0) return 0;

  // Calculate score based on number and severity of gaps
  const severityWeights = {
    high: 25,
    medium: 10,
    low: 5,
  };

  let totalWeight = 0;
  gaps.forEach(gap => {
    totalWeight += severityWeights[gap.severity] || 10;
  });

  // Cap the score at 100
  return Math.min(Math.round(totalWeight), 100);
}
