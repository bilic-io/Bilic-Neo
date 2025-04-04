/**
 * Generate a storage initializer script for Bilic Neo
 * This script creates a JavaScript file that will be included in the extension
 * to initialize Chrome storage with default Gemini API key and model settings
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration parameters
const GEMINI_API_KEY = process.argv[2];
if (!GEMINI_API_KEY) {
  console.error('Please provide your Gemini API key as an argument');
  console.error('Usage: node scripts/generate-storage-initializer.js YOUR_GEMINI_API_KEY');
  process.exit(1);
}

const MODEL_NAME = 'gemini-2.0-flash';
const PROVIDER_TYPE = 'gemini';

// Create the storage initializer content
const initializerContent = `/**
 * Bilic Neo Storage Initializer
 * Automatically generated to pre-configure storage with API keys and model settings
 */

// Initialize storage when extension is installed
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    console.log('Initializing Bilic Neo with default configuration...');
    
    // Set default LLM provider (Gemini)
    chrome.storage.local.set({
      'llm-api-keys': {
        providers: {
          '${PROVIDER_TYPE}': {
            apiKey: '${GEMINI_API_KEY}',
            name: 'Gemini',
            type: '${PROVIDER_TYPE}',
            modelNames: ['${MODEL_NAME}'],
            createdAt: Date.now()
          }
        }
      }
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting LLM providers:', chrome.runtime.lastError);
      } else {
        console.log('✅ Set default LLM provider (Gemini)');
      }
    });
    
    // Set default agent models configurations
    chrome.storage.local.set({
      'agent-models': {
        agents: {
          'planner': {
            provider: '${PROVIDER_TYPE}',
            modelName: '${MODEL_NAME}',
            parameters: {
              temperature: 0.01,
              topP: 0.1
            }
          },
          'navigator': {
            provider: '${PROVIDER_TYPE}',
            modelName: '${MODEL_NAME}',
            parameters: {
              temperature: 0.01,
              topP: 0.1
            }
          },
          'validator': {
            provider: '${PROVIDER_TYPE}',
            modelName: '${MODEL_NAME}',
            parameters: {
              temperature: 0.1,
              topP: 0.1
            }
          }
        }
      }
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting agent models:', chrome.runtime.lastError);
      } else {
        console.log('✅ Set default agent models (gemini-2.0-flash)');
      }
    });
  }
});
`;

// Write the initializer to a file
const outputPath = path.join(__dirname, '..', 'chrome-extension', 'src', 'storage-initializer.js');
fs.writeFileSync(outputPath, initializerContent);
console.log(`✅ Generated storage initializer at ${outputPath}`);
console.log('ℹ️  Next step: Include this file in your manifest.json and rebuild the extension');
