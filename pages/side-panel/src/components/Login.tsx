import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

interface LoginProps {
  onLoginSuccess?: () => void;
}

// Default configuration for Gemini
const DEFAULT_STORAGE_CONFIG = {
  // LLM Provider configuration
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

  // Agent models configuration
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
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthState();
  }, []);

  useEffect(() => {
    const hasIdentityAPI = typeof chrome !== 'undefined' && chrome.identity !== undefined;
    setGoogleAvailable(hasIdentityAPI);
  }, []);

  const checkAuthState = async () => {
    const session = await authService.initSession();
    if (session.isAuthenticated) {
      setIsAuthenticated(true);
      onLoginSuccess?.();
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      const success = await authService.storeCredential({
        id: username,
        username,
        password,
      });

      if (success) {
        setIsAuthenticated(true);
        onLoginSuccess?.();
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to initialize the extension with default Gemini settings
  const handleInitializeSettings = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Set the LLM provider configuration
      await chrome.storage.local.set(DEFAULT_STORAGE_CONFIG);

      setSuccess('✅ Settings initialized successfully! Bilic Neo is now configured with Gemini API key and models.');

      // Auto-login after successful initialization
      setTimeout(() => {
        setIsAuthenticated(true);
        onLoginSuccess?.();
      }, 2000);
    } catch (error) {
      console.error('Initialization error:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="p-4 text-center">
        <p className="text-green-500 font-semibold">You are logged in!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 h-full">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2 text-green-500">Welcome to Bilic Neo</h2>
          <p className="text-gray-600 dark:text-gray-400">Enter your credentials or initialize with default settings</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-sm">{success}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                  <path
                    d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
                    fill="#4285F4"
                  />
                </svg>
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-green-300 dark:border-green-800 rounded-md focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="#4285F4" />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-green-300 dark:border-green-800 rounded-md focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
            {isLoading ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : (
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="#4285F4" />
              </svg>
            )}
            Log in
          </button>
        </form>

        {googleAvailable && (
          <>
            <div className="mt-6 mb-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleInitializeSettings}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
              {isLoading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              Initialize with Gemini API Key
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
