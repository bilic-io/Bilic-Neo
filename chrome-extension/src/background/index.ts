import 'webextension-polyfill';
import { agentModelStore, AgentNameEnum, generalSettingsStore, llmProviderStore } from '@extension/storage';
import BrowserContext from './browser/context';
import { Executor } from './agent/executor';
import { createLogger } from './log';
import { ExecutionState } from './agent/event/types';
import { createChatModel } from './agent/helper';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { Actors } from './agent/event/types';
import { handleOAuthLogin, handleLogout } from './authHandler';

const logger = createLogger('background');

const browserContext = new BrowserContext({});
let currentExecutor: Executor | null = null;
let currentPort: chrome.runtime.Port | null = null;

// Setup side panel behavior
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

// Function to check if script is already injected
async function isScriptInjected(tabId: number): Promise<boolean> {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => Object.prototype.hasOwnProperty.call(window, 'buildDomTree'),
    });
    return results[0]?.result || false;
  } catch (err) {
    console.error('Failed to check script injection status:', err);
    return false;
  }
}

// // Function to inject the buildDomTree script
async function injectBuildDomTree(tabId: number) {
  try {
    // Check if already injected
    const alreadyInjected = await isScriptInjected(tabId);
    if (alreadyInjected) {
      console.log('Scripts already injected, skipping...');
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['buildDomTree.js'],
    });
    console.log('Scripts successfully injected');
  } catch (err) {
    console.error('Failed to inject scripts:', err);
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tabId && changeInfo.status === 'complete' && tab.url?.startsWith('http')) {
    await injectBuildDomTree(tabId);
  }
});

// Listen for debugger detached event
// if canceled_by_user, remove the tab from the browser context
chrome.debugger.onDetach.addListener(async (source, reason) => {
  console.log('Debugger detached:', source, reason);
  if (reason === 'canceled_by_user') {
    if (source.tabId) {
      await browserContext.cleanup();
    }
  }
});

// Cleanup when tab is closed
chrome.tabs.onRemoved.addListener(tabId => {
  browserContext.removeAttachedPage(tabId);
});

logger.info('background loaded');

// Setup connection listener
chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'side-panel-connection') {
    currentPort = port;

    port.onMessage.addListener(async message => {
      try {
        switch (message.type) {
          case 'heartbeat':
            // Acknowledge heartbeat
            port.postMessage({ type: 'heartbeat_ack' });
            break;

          case 'new_task': {
            if (!message.task) return port.postMessage({ type: 'error', error: 'No task provided' });
            if (!message.tabId) return port.postMessage({ type: 'error', error: 'No tab ID provided' });

            logger.info('new_task', message.tabId, message.task);
            currentExecutor = await setupExecutor(message.taskId, message.task, browserContext);
            subscribeToExecutorEvents(currentExecutor);

            const result = await currentExecutor.execute();
            logger.info('new_task execution result', message.tabId, result);
            break;
          }
          case 'follow_up_task': {
            if (!message.task) return port.postMessage({ type: 'error', error: 'No follow up task provided' });
            if (!message.tabId) return port.postMessage({ type: 'error', error: 'No tab ID provided' });

            logger.info('follow_up_task', message.tabId, message.task);

            // If executor exists, add follow-up task
            if (currentExecutor) {
              currentExecutor.addFollowUpTask(message.task);
              // Re-subscribe to events in case the previous subscription was cleaned up
              subscribeToExecutorEvents(currentExecutor);
              const result = await currentExecutor.execute();
              logger.info('follow_up_task execution result', message.tabId, result);
            } else {
              // executor was cleaned up, can not add follow-up task
              logger.info('follow_up_task: executor was cleaned up, can not add follow-up task');
              return port.postMessage({ type: 'error', error: 'Executor was cleaned up, can not add follow-up task' });
            }
            break;
          }

          case 'cancel_task': {
            if (!currentExecutor) return port.postMessage({ type: 'error', error: 'No task to cancel' });
            await currentExecutor.cancel();
            break;
          }

          case 'screenshot': {
            if (!message.tabId) return port.postMessage({ type: 'error', error: 'No tab ID provided' });
            const page = await browserContext.switchTab(message.tabId);
            const screenshot = await page.takeScreenshot();
            logger.info('screenshot', message.tabId, screenshot);
            return port.postMessage({ type: 'success', screenshot });
          }

          case 'resume_task': {
            if (!currentExecutor) return port.postMessage({ type: 'error', error: 'No task to resume' });
            await currentExecutor.resume();
            return port.postMessage({ type: 'success' });
          }

          case 'pause_task': {
            if (!currentExecutor) return port.postMessage({ type: 'error', error: 'No task to pause' });
            await currentExecutor.pause();
            return port.postMessage({ type: 'success' });
          }
          default:
            return port.postMessage({ type: 'error', error: 'Unknown message type' });
        }
      } catch (error) {
        console.error('Error handling port message:', error);
        port.postMessage({
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    port.onDisconnect.addListener(() => {
      console.log('Side panel disconnected');
      currentPort = null;
    });
  }
});

async function setupExecutor(taskId: string, task: string, browserContext: BrowserContext) {
  const providers = await llmProviderStore.getAllProviders();
  // if no providers, need to display the options page
  if (Object.keys(providers).length === 0) {
    throw new Error('Please configure API keys in the settings first');
  }
  const agentModels = await agentModelStore.getAllAgentModels();
  // verify if every provider used in the agent models exists in the providers
  for (const agentModel of Object.values(agentModels)) {
    if (!providers[agentModel.provider]) {
      throw new Error(`Provider ${agentModel.provider} not found in the settings`);
    }
  }

  const navigatorModel = agentModels[AgentNameEnum.Navigator];
  if (!navigatorModel) {
    throw new Error('Please choose a model for the navigator in the settings first');
  }
  const navigatorLLM = createChatModel(providers[navigatorModel.provider], navigatorModel);

  let plannerLLM: BaseChatModel | null = null;
  const plannerModel = agentModels[AgentNameEnum.Planner];
  if (plannerModel) {
    plannerLLM = createChatModel(providers[plannerModel.provider], plannerModel);
  }

  let validatorLLM: BaseChatModel | null = null;
  const validatorModel = agentModels[AgentNameEnum.Validator];
  if (validatorModel) {
    validatorLLM = createChatModel(providers[validatorModel.provider], validatorModel);
  }

  const generalSettings = await generalSettingsStore.getSettings();
  const executor = new Executor(task, taskId, browserContext, navigatorLLM, {
    plannerLLM: plannerLLM ?? navigatorLLM,
    validatorLLM: validatorLLM ?? navigatorLLM,
    agentOptions: {
      maxSteps: generalSettings.maxSteps,
      maxFailures: generalSettings.maxFailures,
      maxActionsPerStep: generalSettings.maxActionsPerStep,
      useVision: generalSettings.useVision,
      useVisionForPlanner: generalSettings.useVisionForPlanner,
      planningInterval: generalSettings.planningInterval,
    },
  });

  return executor;
}

// Update subscribeToExecutorEvents to use port
async function subscribeToExecutorEvents(executor: Executor) {
  // Clear previous event listeners to prevent multiple subscriptions
  executor.clearExecutionEvents();

  // Subscribe to new events
  executor.subscribeExecutionEvents(async event => {
    try {
      if (currentPort) {
        currentPort.postMessage(event);
      }
    } catch (error) {
      logger.error('Failed to send message to side panel:', error);
    }

    if (
      event.state === ExecutionState.TASK_OK ||
      event.state === ExecutionState.TASK_FAIL ||
      event.state === ExecutionState.TASK_CANCEL
    ) {
      await currentExecutor?.cleanup();
    }
  });
}

// Add a message handler for the compliance scanner
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle authentication requests
  if (message.type === 'login') {
    // Handle login request with the specified provider
    handleOAuthLogin(message.provider).then(sendResponse);
    return true; // Keep the message channel open for async response
  }

  if (message.type === 'logout') {
    // Handle logout request
    handleLogout().then(sendResponse);
    return true; // Keep the message channel open for async response
  }

  // Handle compliance scanning requests from the options page
  if (message.action === 'scanWebsiteCompliance' && message.data) {
    const { url, companyInfo } = message.data;

    if (!url || !companyInfo) {
      sendResponse({ success: false, error: 'Missing URL or company info' });
      return true;
    }

    console.log(`Scanning website for compliance: ${url}`);

    // Create a unique task ID for this scan
    const taskId = `compliance-scan-${Date.now()}`;

    // Create scan template based on company info
    const template = `Analyze ${url} for regulatory compliance issues specific to ${companyInfo.industry || 'general'} industry. 
      Check for proper privacy policy, terms of service, cookie consent mechanisms, 
      accessibility standards (WCAG), and other required legal disclosures.
      Focus particularly on requirements for ${companyInfo.country || 'international'} regulations.
      Provide a detailed report of compliance gaps and recommended fixes in JSON format.
      Format the output as a valid JSON with compliance gaps, risk score, and deadlines.`;

    // Create a headless browser context for compliance scanning
    const headlessBrowserContext = new BrowserContext({
      headless: true, // Run in headless mode
      highlightElements: false, // No need to highlight in headless mode
    });

    // Use the executor to perform the scan
    (async () => {
      let executor: Executor | null = null;

      try {
        // Set up an executor for this task with headless browser context
        executor = await setupExecutor(taskId, template, headlessBrowserContext);

        // Navigate to the target URL first
        await headlessBrowserContext.navigateTo(url);

        // Set up a listener for executor events to capture the result
        let scanResult = '';

        executor.clearExecutionEvents();
        executor.subscribeExecutionEvents(async event => {
          // Capture the message content from USER (result) events
          if (event.actor === Actors.USER && event.data && event.data.details) {
            scanResult = event.data.details;
          }

          // When task is completed, process the result
          if (event.state === ExecutionState.TASK_OK) {
            try {
              // Process the captured result
              let complianceData;

              try {
                // Try to extract structured data from the result
                const jsonMatch = scanResult.match(/```json\n([\s\S]*?)\n```/) || scanResult.match(/{[\s\S]*}/);

                const jsonStr = jsonMatch ? jsonMatch[0] : scanResult;
                const cleaned = jsonStr.replace(/```json|```/g, '').trim();

                // Parse JSON or use a simplified format
                try {
                  complianceData = JSON.parse(cleaned);
                } catch (e) {
                  // If parsing fails, use a simple structure
                  complianceData = {
                    gaps: [
                      {
                        requirementId: 'parse-error',
                        regulation: 'General',
                        requirement: 'Compliance Analysis',
                        description: scanResult,
                        severity: 'medium',
                        recommendation: 'Review the raw report for details',
                      },
                    ],
                    riskScore: 50,
                    checklist: {
                      industry: companyInfo.industry || 'General',
                      items: [{ id: 'item-1', text: 'Review compliance report', importance: 'critical' }],
                    },
                    deadlines: [],
                  };
                }

                // Add the raw report
                complianceData.rawReport = scanResult;

                // Send the processed data back to the options page
                sendResponse({
                  success: true,
                  data: complianceData,
                });
              } catch (error) {
                console.error('Failed to process compliance scan result:', error);
                sendResponse({
                  success: false,
                  error: 'Failed to process compliance scan result',
                });
              }
            } finally {
              // Clean up
              if (executor) {
                await executor.cleanup();
              }
              await headlessBrowserContext.cleanup();
            }
          } else if (event.state === ExecutionState.TASK_FAIL || event.state === ExecutionState.TASK_CANCEL) {
            // Handle failure case
            console.error('Compliance scan failed:', event);
            sendResponse({
              success: false,
              error: 'Compliance scan failed',
            });

            // Clean up
            if (executor) {
              await executor.cleanup();
            }
            await headlessBrowserContext.cleanup();
          }
        });

        // Start the execution after navigation
        await executor.execute();
      } catch (error) {
        console.error('Failed to setup compliance scan:', error);
        sendResponse({
          success: false,
          error: 'Failed to setup compliance scan',
        });

        // Clean up
        if (executor) {
          await executor.cleanup();
        }
        await headlessBrowserContext.cleanup();
      }
    })();

    // Return true to indicate that we'll send the response asynchronously
    return true;
  }

  // Handle the execute message with URL action
  if (message.type === 'EXECUTE_MESSAGE_WITH_URL' && message.payload) {
    const { message: userMessage, url, needsResponse = true } = message.payload;

    if (!url) {
      sendResponse({ success: false, error: 'Missing URL' });
      return true;
    }

    // Create a unique task ID
    const taskId = `url-analysis-${Date.now()}`;

    (async () => {
      let executor: Executor | null = null;

      try {
        // Set up an executor for this task
        executor = await setupExecutor(taskId, userMessage.content, browserContext);

        // Navigate to the target URL first
        await browserContext.navigateTo(url);

        // Set up a listener for executor events to capture the result
        let analysisResult = '';

        executor.clearExecutionEvents();
        executor.subscribeExecutionEvents(async event => {
          // Capture the message content from USER (result) events
          if (event.actor === Actors.USER && event.data && event.data.details) {
            analysisResult = event.data.details;
          }

          // When task is completed, return the result
          if (event.state === ExecutionState.TASK_OK) {
            try {
              // Only send response if needsResponse is true
              if (needsResponse) {
                sendResponse({
                  success: true,
                  content: analysisResult,
                });
              }
            } finally {
              // Clean up
              if (executor) {
                await executor.cleanup();
              }
            }
          } else if (event.state === ExecutionState.TASK_FAIL || event.state === ExecutionState.TASK_CANCEL) {
            // Handle failure case
            console.error('URL analysis failed:', event);

            // Only send response if needsResponse is true
            if (needsResponse) {
              sendResponse({
                success: false,
                error: 'URL analysis failed',
              });
            }

            // Clean up
            if (executor) {
              await executor.cleanup();
            }
          }
        });

        // Start the execution after navigation
        await executor.execute();
      } catch (error) {
        console.error('Failed to setup URL analysis:', error);
        sendResponse({
          success: false,
          error: 'Failed to setup URL analysis',
        });

        // Clean up
        if (executor) {
          await executor.cleanup();
        }
      }
    })();

    // Return true to indicate that we'll send the response asynchronously
    return true;
  }

  // Return false by default to indicate that we won't send a response asynchronously
  return false;
});
