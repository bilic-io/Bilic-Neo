/**
 * Configure default settings for Bilic Neo with prefilled Gemini API key and models
 *
 * Run this script before building the extension for distribution:
 * node scripts/configure-default-settings.js YOUR_GEMINI_API_KEY
 */

const fs = require('fs');
const path = require('path');

// Configuration parameters
const GEMINI_API_KEY = process.argv[2];
if (!GEMINI_API_KEY) {
  console.error('Please provide your Gemini API key as an argument');
  console.error('Usage: node scripts/configure-default-settings.js YOUR_GEMINI_API_KEY');
  process.exit(1);
}

const MODEL_NAME = 'gemini-2.0-flash';
const PROVIDER_TYPE = 'gemini';

// Path to storage settings files
const STORAGE_PATH = path.join(__dirname, '..', 'packages', 'storage', 'lib', 'settings');

// Function to modify llmProviders.ts
function modifyLlmProviders() {
  const filePath = path.join(STORAGE_PATH, 'llmProviders.ts');

  let content = fs.readFileSync(filePath, 'utf8');

  // Find the storage initialization part and modify it to include the default provider
  const storageRegex = /const storage = createStorage<LLMKeyRecord>\([^)]+\);/s;
  const newStorageContent = `const storage = createStorage<LLMKeyRecord>(
  'llm-api-keys',
  { 
    providers: {
      '${PROVIDER_TYPE}': {
        apiKey: '${GEMINI_API_KEY}',
        name: 'Gemini',
        type: '${PROVIDER_TYPE}',
        modelNames: ['${MODEL_NAME}'],
        createdAt: Date.now()
      }
    } 
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);`;

  content = content.replace(storageRegex, newStorageContent);

  fs.writeFileSync(filePath, content);
  console.log('✅ Modified llmProviders.ts with default Gemini API key');
}

// Function to modify agentModels.ts
function modifyAgentModels() {
  const filePath = path.join(STORAGE_PATH, 'agentModels.ts');

  let content = fs.readFileSync(filePath, 'utf8');

  // Find the storage initialization part and modify it to include the default agent models
  const storageRegex = /const storage = createStorage<AgentModelRecord>\([^)]+\);/s;
  const newStorageContent = `const storage = createStorage<AgentModelRecord>(
  'agent-models',
  { 
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
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);`;

  content = content.replace(storageRegex, newStorageContent);

  fs.writeFileSync(filePath, content);
  console.log('✅ Modified agentModels.ts with default Gemini model configurations');
}

// Execute modifications
console.log('🔧 Configuring Bilic Neo with default Gemini settings...');
modifyLlmProviders();
modifyAgentModels();
console.log('✨ Configuration complete! The extension is ready to bundle with prefilled Gemini API key.');
console.log('⚠️  Note: Make sure to rebuild the extension after running this script.');
