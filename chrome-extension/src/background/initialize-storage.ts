/**
 * Bilic Neo Storage Initializer
 * Pre-configures storage with Gemini API key and model settings
 */

import { ProviderTypeEnum, llmProviderStore } from '@extension/storage';
import { agentModelStore, AgentNameEnum } from '@extension/storage';
import { createLogger } from './log';

const logger = createLogger('initialize-storage');

// Gemini configuration
const GEMINI_API_KEY = 'AIzaSyAT6HRh0qun-VBz5z5wfy50qfO0siDihKw';
const MODEL_NAME = 'gemini-2.0-flash';
const PROVIDER_TYPE = ProviderTypeEnum.Gemini;

/**
 * Initialize storage with default values
 * This function is called when the extension is installed
 */
export async function initializeStorageOnInstall() {
  logger.info('Initializing Bilic Neo with default configuration...');

  try {
    // Set default LLM provider (Gemini)
    await llmProviderStore.setProvider(PROVIDER_TYPE, {
      apiKey: GEMINI_API_KEY,
      name: 'Gemini',
      type: PROVIDER_TYPE,
      modelNames: [MODEL_NAME],
      createdAt: Date.now(),
    });
    logger.info('✅ Set default LLM provider (Gemini)');

    // Set default agent models configurations
    await agentModelStore.setAgentModel(AgentNameEnum.Planner, {
      provider: PROVIDER_TYPE,
      modelName: MODEL_NAME,
      parameters: {
        temperature: 0.01,
        topP: 0.1,
      },
    });

    await agentModelStore.setAgentModel(AgentNameEnum.Navigator, {
      provider: PROVIDER_TYPE,
      modelName: MODEL_NAME,
      parameters: {
        temperature: 0.01,
        topP: 0.1,
      },
    });

    await agentModelStore.setAgentModel(AgentNameEnum.Validator, {
      provider: PROVIDER_TYPE,
      modelName: MODEL_NAME,
      parameters: {
        temperature: 0.1,
        topP: 0.1,
      },
    });

    logger.info('✅ Set default agent models (gemini-2.0-flash)');
  } catch (error) {
    logger.error('Error initializing storage:', error);
  }
}
