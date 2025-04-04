/**
 * Bilic Neo Storage Initializer
 * Automatically generated to pre-configure storage with API keys and model settings
 */

// Initialize storage when extension is installed
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    console.log('Initializing Bilic Neo with default configuration...');

    // Set default LLM provider (Gemini)
    chrome.storage.local.set(
      {
        'llm-api-keys': {
          providers: {
            gemini: {
              apiKey: 'AIzaSyAT6HRh0qun-VBz5z5wfy50qfO0siDihKw',
              name: 'Gemini',
              type: 'gemini',
              modelNames: ['gemini-2.0-flash'],
              createdAt: Date.now(),
            },
          },
        },
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error('Error setting LLM providers:', chrome.runtime.lastError);
        } else {
          console.log('✅ Set default LLM provider (Gemini)');
        }
      },
    );

    // Set default agent models configurations
    chrome.storage.local.set(
      {
        'agent-models': {
          agents: {
            planner: {
              provider: 'gemini',
              modelName: 'gemini-2.0-flash',
              parameters: {
                temperature: 0.01,
                topP: 0.1,
              },
            },
            navigator: {
              provider: 'gemini',
              modelName: 'gemini-2.0-flash',
              parameters: {
                temperature: 0.01,
                topP: 0.1,
              },
            },
            validator: {
              provider: 'gemini',
              modelName: 'gemini-2.0-flash',
              parameters: {
                temperature: 0.1,
                topP: 0.1,
              },
            },
          },
        },
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error('Error setting agent models:', chrome.runtime.lastError);
        } else {
          console.log('✅ Set default agent models (gemini-2.0-flash)');
        }
      },
    );
  }
});
