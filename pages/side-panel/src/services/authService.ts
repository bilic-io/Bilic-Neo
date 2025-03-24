// Authentication service for managing user credentials and session state
// This service handles both OAuth and username/password authentication

// User credential interface
export interface UserCredential {
  id: string;
  username: string;
  password?: string;
  provider?: string;
  token?: string;
  expiresAt?: number;
}

// Session state interface
export interface SessionState {
  isAuthenticated: boolean;
  user?: UserCredential;
  sessionId?: string;
}

// Storage keys
const SESSION_KEY = 'bilic_neo_session';

// Check if Chrome identity API is available
const hasIdentityAPI = typeof chrome !== 'undefined' && chrome.identity !== undefined;

/**
 * Generate a unique ID for session management
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * AuthService class that handles authentication and session management
 */
class AuthService {
  /**
   * Initialize the session from storage
   */
  async initSession(): Promise<SessionState> {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        // Validate the session
        if (this.isSessionValid(session)) {
          return session;
        }
      }
    } catch (error) {
      console.error('Error initializing session:', error);
    }

    return this.createNewSession();
  }

  /**
   * Create a new session
   */
  private createNewSession(): SessionState {
    const newSession: SessionState = {
      isAuthenticated: false,
      sessionId: generateId(),
    };
    this.saveSessionToStorage(newSession);
    return newSession;
  }

  /**
   * Store user credentials and update session state
   */
  async storeCredential(credential: UserCredential): Promise<boolean> {
    try {
      if (!credential.id || !credential.username) {
        console.error('Invalid credential data');
        return false;
      }

      // Create and store the session
      const session: SessionState = {
        isAuthenticated: true,
        user: credential,
        sessionId: generateId(),
      };

      // Save to localStorage
      this.saveSessionToStorage(session);

      // If using Chrome runtime, also try to send a message to the background script
      if (chrome.runtime) {
        try {
          chrome.runtime.sendMessage({
            type: 'usernamePasswordLogin',
            username: credential.username,
            password: credential.password,
          });
        } catch (error) {
          console.warn('Failed to communicate with background script:', error);
          // Continue anyway as we've already stored in localStorage
        }
      }

      return true;
    } catch (error) {
      console.error('Error storing credential:', error);
      return false;
    }
  }

  /**
   * Login with Google OAuth (alias for backward compatibility)
   */
  async authenticateWithGoogle(): Promise<boolean> {
    return this.loginWithGoogle();
  }

  /**
   * Login with Google OAuth
   */
  async loginWithGoogle(): Promise<boolean> {
    try {
      // Check if Chrome identity API is available
      if (!hasIdentityAPI) {
        console.error('Chrome identity API is not available');
        return false;
      }

      // Send message to background script to handle OAuth
      return new Promise(resolve => {
        chrome.runtime.sendMessage({ type: 'login', provider: 'google' }, response => {
          if (response && response.success && response.token) {
            // Create the user credential
            const credential: UserCredential = {
              id: 'google-user',
              username: 'Google User',
              provider: 'google',
              token: response.token,
            };

            // Create and store the session
            const session: SessionState = {
              isAuthenticated: true,
              user: credential,
              sessionId: generateId(),
            };

            // Save to localStorage
            this.saveSessionToStorage(session);
            resolve(true);
          } else {
            console.error('Google login failed:', response?.error || 'Unknown error');
            resolve(false);
          }
        });
      });
    } catch (error) {
      console.error('Error in Google login:', error);
      return false;
    }
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<boolean> {
    try {
      // Clear local storage
      localStorage.removeItem(SESSION_KEY);

      // If using Chrome runtime, also try to send a message to the background script
      if (chrome.runtime) {
        try {
          chrome.runtime.sendMessage({ type: 'logout' });
        } catch (error) {
          console.warn('Failed to communicate with background script:', error);
          // Continue anyway as we've already cleared localStorage
        }
      }

      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  }

  /**
   * Check if a user is currently authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.initSession();
    return session.isAuthenticated || false;
  }

  /**
   * Save session to storage
   */
  private saveSessionToStorage(session: SessionState): void {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving session to storage:', error);
    }
  }

  /**
   * Get session from storage
   */
  private getSessionFromStorage(): SessionState | null {
    try {
      const sessionStr = localStorage.getItem(SESSION_KEY);

      if (!sessionStr) {
        return null;
      }

      return JSON.parse(sessionStr);
    } catch (error) {
      console.error('Error retrieving session from storage:', error);
      return null;
    }
  }

  /**
   * Check if session is valid
   */
  private isSessionValid(session: SessionState): boolean {
    if (!session || !session.isAuthenticated) {
      return false;
    }

    // Check token expiration if available
    if (session.user?.expiresAt && session.user.expiresAt < Date.now()) {
      return false;
    }

    return true;
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
