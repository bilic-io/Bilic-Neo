/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';
import { FiSettings, FiPlusCircle, FiClock, FiChevronLeft, FiUser } from 'react-icons/fi';
import { type Message as MessageType, Actors, chatHistoryStore } from '@extension/storage';
import { EventType, type AgentEvent, ExecutionState } from './types/event';
import { getCompanyInfo, replaceTemplatePlaceholders } from './utils/templateUtils';
import './SidePanel.css';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import ChatHistoryList from './components/ChatHistoryList';
import EnhancedTemplateList from './components/EnhancedTemplateList';

const KeyboardShortcuts = {
  NEW_CHAT: 'n',
  HISTORY: 'h',
  SETTINGS: 's',
  STOP: 'Escape',
  FOCUS_INPUT: '/',
  TOGGLE_DARK_MODE: 'd',
};

const SidePanel = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputEnabled, setInputEnabled] = useState(true);
  const [showStopButton, setShowStopButton] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [chatSessions, setChatSessions] = useState<Array<{ id: string; title: string; createdAt: number }>>([]);
  const [isFollowUpMode, setIsFollowUpMode] = useState(false);
  const [isHistoricalSession, setIsHistoricalSession] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('prompts');
  const sessionIdRef = useRef<string | null>(null);
  const portRef = useRef<chrome.runtime.Port | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const setInputTextRef = useRef<((text: string) => void) | null>(null);

  // Check for dark mode preference
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    sessionIdRef.current = currentSessionId;
  }, [currentSessionId]);

  const appendMessage = useCallback((newMessage: MessageType, sessionId?: string | null) => {
    // Don't save progress messages
    const isProgressMessage = newMessage.content === 'Showing progress...';

    setMessages(prev => {
      const filteredMessages = prev.filter(
        (msg, idx) => !(msg.content === 'Showing progress...' && idx === prev.length - 1),
      );
      return [...filteredMessages, newMessage];
    });

    // Use provided sessionId if available, otherwise fall back to sessionIdRef.current
    const effectiveSessionId = sessionId !== undefined ? sessionId : sessionIdRef.current;

    console.log('sessionId', effectiveSessionId);

    // Save message to storage if we have a session and it's not a progress message
    if (effectiveSessionId && !isProgressMessage) {
      chatHistoryStore
        .addMessage(effectiveSessionId, newMessage)
        .catch(err => console.error('Failed to save message to history:', err));
    }
  }, []);

  const handleTaskState = useCallback(
    (event: AgentEvent) => {
      const { actor, state, timestamp, data } = event;
      const content = data?.details;
      let skip = true;
      let displayProgress = false;

      switch (actor) {
        case Actors.SYSTEM:
          switch (state) {
            case ExecutionState.TASK_START:
              // Reset historical session flag when a new task starts
              setIsHistoricalSession(false);
              break;
            case ExecutionState.TASK_OK:
              setIsFollowUpMode(true);
              setInputEnabled(true);
              setShowStopButton(false);
              break;
            case ExecutionState.TASK_FAIL:
              setIsFollowUpMode(true);
              setInputEnabled(true);
              setShowStopButton(false);
              skip = false;
              break;
            case ExecutionState.TASK_CANCEL:
              setIsFollowUpMode(false);
              setInputEnabled(true);
              setShowStopButton(false);
              skip = false;
              break;
            case ExecutionState.TASK_PAUSE:
              break;
            case ExecutionState.TASK_RESUME:
              break;
            default:
              console.error('Invalid task state', state);
              return;
          }
          break;
        case Actors.USER:
          break;
        case Actors.PLANNER:
          switch (state) {
            case ExecutionState.STEP_START:
              displayProgress = true;
              break;
            case ExecutionState.STEP_OK:
              skip = false;
              break;
            case ExecutionState.STEP_FAIL:
              skip = false;
              break;
            case ExecutionState.STEP_CANCEL:
              break;
            default:
              console.error('Invalid step state', state);
              return;
          }
          break;
        case Actors.NAVIGATOR:
          switch (state) {
            case ExecutionState.STEP_START:
              displayProgress = true;
              break;
            case ExecutionState.STEP_OK:
              displayProgress = false;
              break;
            case ExecutionState.STEP_FAIL:
              skip = false;
              displayProgress = false;
              break;
            case ExecutionState.STEP_CANCEL:
              displayProgress = false;
              break;
            case ExecutionState.ACT_START:
              if (content !== 'cache_content') {
                // skip to display caching content
                skip = false;
              }
              break;
            case ExecutionState.ACT_OK:
              skip = true;
              break;
            case ExecutionState.ACT_FAIL:
              skip = false;
              break;
            default:
              console.error('Invalid action', state);
              return;
          }
          break;
        case Actors.VALIDATOR:
          switch (state) {
            case ExecutionState.STEP_START:
              displayProgress = true;
              break;
            case ExecutionState.STEP_OK:
              skip = false;
              break;
            case ExecutionState.STEP_FAIL:
              skip = false;
              break;
            default:
              console.error('Invalid validation', state);
              return;
          }
          break;
        default:
          console.error('Unknown actor', actor);
          return;
      }

      if (!skip) {
        appendMessage({
          actor,
          content: content || '',
          timestamp: timestamp,
        });
      }

      if (displayProgress) {
        appendMessage({
          actor,
          content: 'Showing progress...',
          timestamp: timestamp,
        });
      }
    },
    [appendMessage],
  );

  // Stop heartbeat and close connection
  const stopConnection = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (portRef.current) {
      portRef.current.disconnect();
      portRef.current = null;
    }
  }, []);

  // Setup connection management
  const setupConnection = useCallback(() => {
    // Only setup if no existing connection
    if (portRef.current) {
      return;
    }

    try {
      portRef.current = chrome.runtime.connect({ name: 'side-panel-connection' });

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      portRef.current.onMessage.addListener((message: any) => {
        // Add type checking for message
        if (message && message.type === EventType.EXECUTION) {
          handleTaskState(message);
        } else if (message && message.type === 'error') {
          // Handle error messages from service worker
          appendMessage({
            actor: Actors.SYSTEM,
            content: message.error || 'Unknown error occurred',
            timestamp: Date.now(),
          });
          setInputEnabled(true);
          setShowStopButton(false);
        } else if (message && message.type === 'heartbeat_ack') {
          console.log('Heartbeat acknowledged');
        }
      });

      portRef.current.onDisconnect.addListener(() => {
        const error = chrome.runtime.lastError;
        console.log('Connection disconnected', error ? `Error: ${error.message}` : '');
        portRef.current = null;
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }
        setInputEnabled(true);
        setShowStopButton(false);
      });

      // Setup heartbeat interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      heartbeatIntervalRef.current = window.setInterval(() => {
        if (portRef.current?.name === 'side-panel-connection') {
          try {
            portRef.current.postMessage({ type: 'heartbeat' });
          } catch (error) {
            console.error('Heartbeat failed:', error);
            stopConnection(); // Stop connection if heartbeat fails
          }
        } else {
          stopConnection(); // Stop if port is invalid
        }
      }, 25000);
    } catch (error) {
      console.error('Failed to establish connection:', error);
      appendMessage({
        actor: Actors.SYSTEM,
        content: 'Failed to connect to service worker',
        timestamp: Date.now(),
      });
      // Clear any references since connection failed
      portRef.current = null;
    }
  }, [handleTaskState, appendMessage, stopConnection]);

  // Add safety check for message sending
  const sendMessage = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (message: any) => {
      if (portRef.current?.name !== 'side-panel-connection') {
        throw new Error('No valid connection available');
      }
      try {
        portRef.current.postMessage(message);
      } catch (error) {
        console.error('Failed to send message:', error);
        stopConnection(); // Stop connection when message sending fails
        throw error;
      }
    },
    [stopConnection],
  );

  const handleSendMessage = async (text: string, files?: File[]) => {
    console.log('handleSendMessage', text, files);

    if (!text.trim() && (!files || files.length === 0)) return;

    // Block sending messages in historical sessions
    if (isHistoricalSession) {
      console.log('Cannot send messages in historical sessions');
      return;
    }

    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tabId = tabs[0]?.id;
      if (!tabId) {
        throw new Error('No active tab found');
      }

      setInputEnabled(false);
      setShowStopButton(true);

      // Extract PDF contents if files are provided
      let pdfContents: { name: string; content: string; size: number; type: string; lastModified: number }[] = [];

      if (files && files.length > 0) {
        pdfContents = await Promise.all(
          files.map(async file => {
            const content = await readPdfContent(file);
            return {
              name: file.name,
              content,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
            };
          }),
        );
      }

      // Create a new chat session for this task if not in follow-up mode
      if (!isFollowUpMode) {
        const newSession = await chatHistoryStore.createSession(
          text.substring(0, 50) + (text.length > 50 ? '...' : ''),
        );
        console.log('newSession', newSession);

        // Store the session ID in both state and ref
        const sessionId = newSession.id;
        setCurrentSessionId(sessionId);
        sessionIdRef.current = sessionId;
      }

      // Build the message content
      let messageContent = text;
      if (pdfContents.length > 0) {
        const fileListText = pdfContents.map(file => `- ${file.name} (${formatFileSize(file.size)})`).join('\n');
        messageContent = `${text}\n\n[Attached ${pdfContents.length} PDF file${pdfContents.length > 1 ? 's' : ''}]\n${fileListText}`;
      }

      const userMessage = {
        actor: Actors.USER,
        content: messageContent,
        timestamp: Date.now(),
        attachments: pdfContents.length > 0 ? pdfContents : undefined,
      };

      // Pass the sessionId directly to appendMessage
      appendMessage(userMessage, sessionIdRef.current);

      // Setup connection if not exists
      if (!portRef.current) {
        setupConnection();
      }

      // Send message using the utility function
      if (isFollowUpMode) {
        // Send as follow-up task
        await sendMessage({
          type: 'follow_up_task',
          task: text,
          pdfContents: pdfContents.length > 0 ? pdfContents : undefined,
          taskId: sessionIdRef.current,
          tabId,
        });
        console.log('follow_up_task sent', text, tabId, sessionIdRef.current);
      } else {
        // Send as new task
        await sendMessage({
          type: 'new_task',
          task: text,
          pdfContents: pdfContents.length > 0 ? pdfContents : undefined,
          taskId: sessionIdRef.current,
          tabId,
        });
        console.log('new_task sent', text, tabId, sessionIdRef.current);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Task error', errorMessage);
      appendMessage({
        actor: Actors.SYSTEM,
        content: errorMessage,
        timestamp: Date.now(),
      });
      setInputEnabled(true);
      setShowStopButton(false);
      stopConnection();
    }
  };

  // Helper function to read PDF content
  const readPdfContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = event => {
        try {
          // For simplicity, extract text from PDF
          // In a real implementation, you might want to use a PDF parsing library
          // like pdf.js for better text extraction
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const text = extractTextFromPdf(arrayBuffer);
          resolve(text);
        } catch (error) {
          reject(new Error(`Failed to parse PDF: ${error}`));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));

      reader.readAsArrayBuffer(file);
    });
  };

  // Simple PDF text extraction
  const extractTextFromPdf = (arrayBuffer: ArrayBuffer): string => {
    try {
      // Basic text extraction - this is a simplified approach
      // For better extraction, consider using pdf.js or another PDF library
      const uint8Array = new Uint8Array(arrayBuffer);
      let text = '';

      // Find potential text in the PDF by looking for text markers
      // This is a very basic approach and won't work for all PDFs
      for (let i = 0; i < uint8Array.length; i++) {
        // Look for text content, skipping binary data
        if (uint8Array[i] >= 32 && uint8Array[i] < 127) {
          text += String.fromCharCode(uint8Array[i]);
        }
      }

      // Clean up the extracted text
      text = text
        .replace(/[^\x20-\x7E\n]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return text || 'PDF content could not be extracted. Please try a different PDF or manually enter the content.';
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return 'PDF content could not be extracted due to an error.';
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleStopTask = async () => {
    try {
      portRef.current?.postMessage({
        type: 'cancel_task',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('cancel_task error', errorMessage);
      appendMessage({
        actor: Actors.SYSTEM,
        content: errorMessage,
        timestamp: Date.now(),
      });
    }
    setInputEnabled(true);
    setShowStopButton(false);
  };

  const handleNewChat = () => {
    // Clear messages and start a new chat
    setMessages([]);
    setCurrentSessionId(null);
    sessionIdRef.current = null;
    setInputEnabled(true);
    setShowStopButton(false);
    setIsFollowUpMode(false);
    setIsHistoricalSession(false);

    // Disconnect any existing connection
    stopConnection();
  };

  const loadChatSessions = useCallback(async () => {
    try {
      const sessions = await chatHistoryStore.getSessionsMetadata();
      setChatSessions(sessions.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  }, []);

  const handleLoadHistory = async () => {
    await loadChatSessions();
    setShowHistory(true);
  };

  const handleBackToChat = () => {
    setShowHistory(false);
  };

  const handleSessionSelect = async (sessionId: string) => {
    try {
      const fullSession = await chatHistoryStore.getSession(sessionId);
      if (fullSession && fullSession.messages.length > 0) {
        setCurrentSessionId(fullSession.id);
        setMessages(fullSession.messages);
        setIsFollowUpMode(false);
        setIsHistoricalSession(true); // Mark this as a historical session
      }
      setShowHistory(false);
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const handleSessionDelete = async (sessionId: string) => {
    try {
      await chatHistoryStore.deleteSession(sessionId);
      await loadChatSessions();
      if (sessionId === currentSessionId) {
        setMessages([]);
        setCurrentSessionId(null);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleTemplateSelect = async (content: string) => {
    try {
      // Get company information from storage
      const companyInfo = await getCompanyInfo();

      // Replace placeholders with company info if available
      const processedContent = replaceTemplatePlaceholders(content, companyInfo);

      if (setInputTextRef.current) {
        setInputTextRef.current(processedContent);
      }
    } catch (error) {
      console.error('Error processing template:', error);
      // Fallback to original content if there's an error
      if (setInputTextRef.current) {
        setInputTextRef.current(content);
      }
    }
  };

  // Add handler for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field, textarea, or has selected text
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        window.getSelection()?.toString() !== ''
      ) {
        // Allow Escape key in input field to stop task
        if (e.key === KeyboardShortcuts.STOP && showStopButton) {
          handleStopTask();
          e.preventDefault();
        }
        return;
      }

      // Global keyboard shortcuts
      switch (e.key) {
        case KeyboardShortcuts.NEW_CHAT:
          if (!showHistory) {
            handleNewChat();
            e.preventDefault();
          }
          break;
        case KeyboardShortcuts.HISTORY:
          if (!showHistory) {
            handleLoadHistory();
            e.preventDefault();
          } else {
            handleBackToChat();
            e.preventDefault();
          }
          break;
        case KeyboardShortcuts.SETTINGS:
          chrome.runtime.openOptionsPage();
          e.preventDefault();
          break;
        case KeyboardShortcuts.STOP:
          if (showStopButton) {
            handleStopTask();
            e.preventDefault();
          }
          break;
        case KeyboardShortcuts.FOCUS_INPUT: {
          // Focus on the input field - wrapped in block to avoid lexical declaration error
          const inputElements = document.querySelectorAll('textarea');
          if (inputElements.length > 0) {
            const chatInput = inputElements[0] as HTMLTextAreaElement;
            chatInput.focus();
            e.preventDefault();
          }
          break;
        }
        case KeyboardShortcuts.TOGGLE_DARK_MODE:
          setIsDarkMode(prev => !prev);
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleLoadHistory, handleNewChat, handleStopTask, showHistory, showStopButton]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopConnection();
    };
  }, [stopConnection]);

  // Scroll to bottom when new messages arrive
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bilic-neo-app">
      <div
        className={`flex h-screen flex-col ${
          isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-white to-gray-100 text-gray-800'
        } overflow-hidden rounded-2xl`}>
        <header
          className={`p-3 flex items-center justify-between border-b ${
            isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-green-100 bg-white/80 backdrop-blur-sm'
          }`}>
          <div className="flex items-center">
            {showHistory ? (
              <button
                type="button"
                onClick={handleBackToChat}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                  isDarkMode
                    ? 'text-green-400 hover:text-green-300 hover:bg-gray-700'
                    : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                }`}
                aria-label="Back to chat"
                title="Back to chat (H)">
                <FiChevronLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isDarkMode ? 'bg-green-600' : 'bg-green-500'
                  }`}>
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <h1 className={`font-bold text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Bilic Neo</h1>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!showHistory && (
              <>
                <button
                  type="button"
                  onClick={handleNewChat}
                  className={`header-action-button ${
                    isDarkMode ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-green-50'
                  }`}
                  aria-label="New Chat"
                  title="New Chat (N)">
                  <FiPlusCircle size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleLoadHistory}
                  className={`header-action-button ${
                    isDarkMode ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-green-50'
                  }`}
                  aria-label="Chat History"
                  title="Chat History (H)">
                  <FiClock size={18} />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setIsDarkMode(prev => !prev)}
              className={`header-action-button ${
                isDarkMode ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-green-50'
              }`}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={`${isDarkMode ? 'Light' : 'Dark'} Mode (D)`}>
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => chrome.runtime.openOptionsPage()}
              className={`header-action-button ${
                isDarkMode ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-green-50'
              }`}
              aria-label="Settings"
              title="Settings (S)">
              <FiSettings size={18} />
            </button>
          </div>
        </header>

        {/* Tab navigation - refined */}
        {!showHistory && (
          <div className={`mx-4 mt-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} role="tablist">
            <button
              className={`relative px-4 py-2 rounded-t-md font-medium text-sm focus:outline-none ${
                activeTab === 'prompts'
                  ? isDarkMode
                    ? 'text-green-400 border-b-2 border-green-400'
                    : 'text-green-600 border-b-2 border-green-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('prompts')}
              role="tab"
              aria-selected={activeTab === 'prompts'}
              tabIndex={0}
              aria-controls="prompts-panel">
              Prompts
            </button>
          </div>
        )}

        {showHistory ? (
          <div className="flex-1 overflow-hidden">
            <ChatHistoryList
              sessions={chatSessions}
              onSessionSelect={handleSessionSelect}
              onSessionDelete={handleSessionDelete}
              visible={true}
              isDarkMode={isDarkMode}
            />
          </div>
        ) : (
          <>
            {activeTab === 'prompts' && (
              <div
                id="prompts-panel"
                role="tabpanel"
                aria-labelledby="prompts-tab"
                className="flex flex-col flex-1 overflow-hidden">
                {messages.length === 0 ? (
                  <>
                    <div className={`p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'}`}>
                      <ChatInput
                        onSendMessage={handleSendMessage}
                        onStopTask={handleStopTask}
                        disabled={!inputEnabled || isHistoricalSession}
                        showStopButton={showStopButton}
                        setContent={setter => {
                          setInputTextRef.current = setter;
                        }}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <EnhancedTemplateList onTemplateSelect={handleTemplateSelect} isDarkMode={isDarkMode} />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={`flex-1 overflow-x-hidden overflow-y-auto scrollbar-thin ${
                        isDarkMode
                          ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-800'
                          : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'
                      }`}>
                      <div className="p-3">
                        <MessageList messages={messages} isDarkMode={isDarkMode} />
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                    <div
                      className={`border-t p-3 ${
                        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-green-100 bg-white/80 backdrop-blur-sm'
                      }`}>
                      <ChatInput
                        onSendMessage={handleSendMessage}
                        onStopTask={handleStopTask}
                        disabled={!inputEnabled || isHistoricalSession}
                        showStopButton={showStopButton}
                        setContent={setter => {
                          setInputTextRef.current = setter;
                        }}
                        isDarkMode={isDarkMode}
                      />
                      {isHistoricalSession && (
                        <div
                          className={`mt-1 text-xs ${isDarkMode ? 'text-amber-400' : 'text-amber-600'} flex items-center`}>
                          <FiUser size={12} className="mr-1" />
                          <span>You are viewing a historical session. Create a new chat to start a conversation.</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
