// Background script handler for authentication
// This file handles OAuth flows and authentication messages

// Storage keys
const AUTH_TOKEN_KEY = 'bilic_neo_auth_token';
const AUTH_PROVIDER_KEY = 'bilic_neo_auth_provider';
const AUTH_TIME_KEY = 'bilic_neo_auth_time';

// Check if identity API is available and provide fallback if not
const hasIdentityAPI = typeof chrome !== 'undefined' && chrome.identity !== undefined;

// Listen for OAuth redirects - only if API is available
if (hasIdentityAPI && chrome.identity.onSignInChanged) {
  chrome.identity.onSignInChanged.addListener((account, signedIn) => {
    if (signedIn) {
      console.log('User signed in:', account);
    } else {
      console.log('User signed out:', account);
    }
  });
}

// Handle OAuth authentication
export async function handleOAuthLogin(
  provider: string,
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    if (provider === 'google') {
      // Check if identity API is available
      if (!hasIdentityAPI) {
        console.error('Chrome identity API is not available');
        return {
          success: false,
          error: 'Chrome identity API is not available. Make sure identity permission is enabled.',
        };
      }

      // Use Chrome's identity API directly for Google authentication
      return new Promise(resolve => {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
          if (chrome.runtime.lastError) {
            console.error('OAuth error:', chrome.runtime.lastError);
            resolve({
              success: false,
              error: chrome.runtime.lastError.message || 'Authentication failed',
            });
            return;
          }

          if (token) {
            // Store token securely
            storeAuthData(token, provider);
            resolve({ success: true, token });
          } else {
            resolve({ success: false, error: 'No token received' });
          }
        });
      });
    } else if (provider === 'supabase') {
      // Implement Supabase authentication
      return { success: false, error: 'Supabase authentication not implemented yet' };
    }

    return { success: false, error: 'Unsupported provider' };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Handle logout
export async function handleLogout(): Promise<{ success: boolean; error?: string }> {
  try {
    // Clear stored credentials
    await chrome.storage.local.remove([AUTH_TOKEN_KEY, AUTH_PROVIDER_KEY, AUTH_TIME_KEY]);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Store authentication data
function storeAuthData(token: string, provider: string): void {
  chrome.storage.local.set({
    [AUTH_TOKEN_KEY]: token,
    [AUTH_PROVIDER_KEY]: provider,
    [AUTH_TIME_KEY]: Date.now(),
  });
}

// Implement username/password authentication as a fallback
export async function handleUsernamePasswordLogin(
  username: string,
  password: string,
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    // This is a simple implementation - in a real app, you would validate against a server
    if (username && password) {
      // Generate a simple token for demonstration
      const token = btoa(`${username}:${Date.now()}`);

      // Store the auth data
      storeAuthData(token, 'password');

      return { success: true, token };
    }

    return { success: false, error: 'Invalid username or password' };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'login') {
    // Handle login request
    handleOAuthLogin(message.provider).then(sendResponse);
    return true; // Keep the message channel open for async response
  } else if (message.type === 'logout') {
    // Handle logout request
    handleLogout().then(sendResponse);
    return true;
  } else if (message.type === 'usernamePasswordLogin') {
    // Handle username/password login request
    handleUsernamePasswordLogin(message.username, message.password).then(sendResponse);
    return true;
  }
  return false; // Return false for unhandled message types
});
