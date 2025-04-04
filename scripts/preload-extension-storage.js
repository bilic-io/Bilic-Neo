/**
 * Preload Chrome Extension Storage with Default Settings
 *
 * This script directly modifies the extension's storage in Chrome's user data directory
 * to preload it with the Gemini API key and model settings.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration parameters
const GEMINI_API_KEY = 'AIzaSyAT6HRh0qun-VBz5z5wfy50qfO0siDihKw';
const MODEL_NAME = 'gemini-2.0-flash';
const PROVIDER_TYPE = 'gemini';

// Create storage preload data
const storageData = {
  // LLM Provider configuration
  'llm-api-keys': {
    providers: {
      [PROVIDER_TYPE]: {
        apiKey: GEMINI_API_KEY,
        name: 'Gemini',
        type: PROVIDER_TYPE,
        modelNames: [MODEL_NAME],
        createdAt: Date.now(),
      },
    },
  },

  // Agent models configuration
  'agent-models': {
    agents: {
      planner: {
        provider: PROVIDER_TYPE,
        modelName: MODEL_NAME,
        parameters: {
          temperature: 0.01,
          topP: 0.1,
        },
      },
      navigator: {
        provider: PROVIDER_TYPE,
        modelName: MODEL_NAME,
        parameters: {
          temperature: 0.01,
          topP: 0.1,
        },
      },
      validator: {
        provider: PROVIDER_TYPE,
        modelName: MODEL_NAME,
        parameters: {
          temperature: 0.1,
          topP: 0.1,
        },
      },
    },
  },
};

// Path for the storage data file
const outputDir = path.join(__dirname, '..', 'dist');
const storageFilePath = path.join(outputDir, 'default-storage.json');

// Create the storage data file
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(storageFilePath, JSON.stringify(storageData, null, 2));
console.log(`✅ Created default storage data at ${storageFilePath}`);

// Create a simple HTML page to load the extension and initialize storage
const loaderHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Bilic Neo Storage Initializer</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background-color: #1f2937;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .container {
      max-width: 600px;
      padding: 2rem;
      background-color: #111827;
      border-radius: 0.5rem;
      border: 1px solid #22c55e;
    }
    h1 {
      color: #22c55e;
    }
    button {
      margin-top: 2rem;
      padding: 0.75rem 1.5rem;
      background-color: #22c55e;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: #16a34a;
    }
    pre {
      background-color: #374151;
      padding: 1rem;
      border-radius: 0.25rem;
      text-align: left;
      overflow: auto;
      max-height: 300px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Bilic Neo Storage Initializer</h1>
    <p>This page will initialize the Bilic Neo extension with default settings:</p>
    <pre id="settings"></pre>
    <p id="status">Click the button below to initialize settings</p>
    <button id="initButton">Initialize Settings</button>
  </div>

  <script>
    // Load and display the default settings
    fetch('default-storage.json')
      .then(response => response.json())
      .then(data => {
        document.getElementById('settings').textContent = JSON.stringify(data, null, 2);
      });
    
    // Initialize storage when button is clicked
    document.getElementById('initButton').addEventListener('click', () => {
      const statusElement = document.getElementById('status');
      
      fetch('default-storage.json')
        .then(response => response.json())
        .then(data => {
          // Set the storage data
          chrome.storage.local.set(data, () => {
            if (chrome.runtime.lastError) {
              statusElement.textContent = '❌ Error: ' + chrome.runtime.lastError.message;
              statusElement.style.color = '#ef4444';
            } else {
              statusElement.textContent = '✅ Settings initialized successfully! You can now close this page.';
              statusElement.style.color = '#22c55e';
            }
          });
        })
        .catch(error => {
          statusElement.textContent = '❌ Error: ' + error.message;
          statusElement.style.color = '#ef4444';
        });
    });
  </script>
</body>
</html>
`;

const loaderHtmlPath = path.join(outputDir, 'initialize-storage.html');
fs.writeFileSync(loaderHtmlPath, loaderHtml);
console.log(`✅ Created storage initializer page at ${loaderHtmlPath}`);
console.log('\n📝 Instructions:');
console.log('1. Install the extension from the "dist" folder');
console.log('2. Open the initialize-storage.html file in your browser');
console.log('3. Click the "Initialize Settings" button');
console.log('4. The extension should now be ready to use with the Gemini API key and model settings\n');
