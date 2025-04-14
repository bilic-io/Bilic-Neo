/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define Task type with proper status type
interface Task {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  description: string;
  progress: number;
  output?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDescription, setTaskDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Task service logic embedded in the component
  useEffect(() => {
    // Load tasks from localStorage on mount
    loadTasksFromStorage();
    // Return cleanup function
    return () => {
      // Close any open WebSockets when component unmounts
      closeAllSockets();
    };
  }, []);

  // WebSocket connections storage
  const socketsRef = useState<Map<string, WebSocket>>(new Map())[0];

  // Create a new task
  const createTask = async (description: string) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:8000/browse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: description }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const taskId = data.task_id || `task-${Date.now()}`;

      const newTask: Task = {
        id: taskId,
        status: 'pending',
        description,
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTasks(prevTasks => {
        const updatedTasks = [newTask, ...prevTasks];
        saveTasksToStorage(updatedTasks);
        return updatedTasks;
      });

      connectToWebSocket(taskId);
      toast('Task created: ' + description);
      setTaskDescription('');
    } catch (error) {
      toast('Failed to create task: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Connect to WebSocket for a specific task
  const connectToWebSocket = (taskId: string) => {
    try {
      // Close existing socket if any
      if (socketsRef.has(taskId)) {
        socketsRef.get(taskId)?.close();
      }

      const socket = new WebSocket(`ws://localhost:8000/ws/${taskId}`);
      socketsRef.set(taskId, socket);

      socket.onopen = () => {
        console.log(`WebSocket connected for task ${taskId}`);

        // Update task status to running when socket connects
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.map(task => {
            if (task.id === taskId && task.status === 'pending') {
              return { ...task, status: 'running' as const };
            }
            return task;
          });
          saveTasksToStorage(updatedTasks);
          return updatedTasks;
        });
      };

      socket.onmessage = event => {
        try {
          const messageText = event.data;
          console.log(`WebSocket message received for ${taskId}:`, messageText);

          // Update task based on the message
          updateTaskFromMessage(taskId, messageText);
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };

      socket.onclose = () => {
        console.log(`WebSocket closed for task ${taskId}`);

        // Finalize task if it's still running
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.map(task => {
            if (task.id === taskId && (task.status === 'running' || task.status === 'pending')) {
              return {
                ...task,
                status: 'completed' as const,
                progress: 100,
                updatedAt: new Date(),
              };
            }
            return task;
          });
          saveTasksToStorage(updatedTasks);
          return updatedTasks;
        });
      };

      socket.onerror = error => {
        console.error(`WebSocket error for task ${taskId}:`, error);

        setTasks(prevTasks => {
          const updatedTasks = prevTasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                status: 'error' as const,
                error: 'WebSocket connection error',
                progress: 100,
                updatedAt: new Date(),
              };
            }
            return task;
          });
          saveTasksToStorage(updatedTasks);
          return updatedTasks;
        });

        toast('Connection error for task ' + taskId);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      toast('WebSocket connection failed for task ' + taskId);
    }
  };

  // Update task based on message from WebSocket
  const updateTaskFromMessage = (taskId: string, messageText: string) => {
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prevTasks;

      const task = prevTasks[taskIndex];

      // Define progress increments based on message types
      const progressMap = {
        '👀': 5, // Starting monitoring
        '⚙️': 15, // Initial analysis
        '🔍': 30, // Deep analysis
        '✅': 100, // Final result (complete)
        '❌': 100, // Error (complete)
        '🏁': 100, // Monitoring ended (complete)
      };

      // Update task status based on message content
      let status = task.status;
      let progress = task.progress;
      let output = task.output || '';
      let error = task.error;

      // Add the new message to output with timestamp
      const timestamp = new Date().toLocaleTimeString();
      output += output ? `\n[${timestamp}] ${messageText}` : `[${timestamp}] ${messageText}`;

      // Check for specific message types
      if (messageText.includes('❌')) {
        status = 'error';
        error = messageText;
        progress = 100;
        toast('Task failed: ' + task.description);
      } else if (messageText.includes('✅')) {
        status = 'completed';
        progress = 100;
        toast('Task completed: ' + task.description);
      } else if (messageText.includes('🏁')) {
        status = 'completed';
        progress = 100;
      } else {
        // For other messages, update progress based on emoji
        for (const [emoji, progressValue] of Object.entries(progressMap)) {
          if (messageText.includes(emoji)) {
            progress = Math.max(progress, progressValue);
            status = 'running';
            break;
          }
        }
      }

      // Increment progress for any message if we're still running
      if (status === 'running' && progress < 95) {
        progress = Math.min(95, progress + 5);
      }

      // Create updated tasks array
      const updatedTasks = [...prevTasks];
      updatedTasks[taskIndex] = {
        ...task,
        status: status as 'pending' | 'running' | 'completed' | 'error',
        progress,
        output,
        error,
        updatedAt: new Date(),
      };

      saveTasksToStorage(updatedTasks);
      return updatedTasks;
    });
  };

  // Close all WebSocket connections
  const closeAllSockets = () => {
    socketsRef.forEach(socket => {
      socket.close();
    });
    socketsRef.clear();
  };

  // Save tasks to localStorage
  const saveTasksToStorage = (tasksToSave: Task[]) => {
    try {
      localStorage.setItem('billic-neo-tasks', JSON.stringify(tasksToSave));
    } catch (err) {
      console.error('Failed to save tasks to storage:', err);
    }
  };

  // Load tasks from localStorage
  const loadTasksFromStorage = () => {
    try {
      const storedTasks = localStorage.getItem('billic-neo-tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);

        // Convert date strings back to Date objects
        const restoredTasks = parsedTasks.map((task: any) => ({
          ...task,
          // Ensure status is one of the allowed values
          status: validateStatus(task.status),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));

        setTasks(restoredTasks);

        // Reconnect to WebSockets for running tasks
        restoredTasks.forEach((task: Task) => {
          if (task.status === 'running' || task.status === 'pending') {
            connectToWebSocket(task.id);
          }
        });
      }
    } catch (err) {
      console.error('Failed to load tasks from storage:', err);
    }
  };

  // Validate task status to ensure it's one of the allowed values
  const validateStatus = (status: string): 'pending' | 'running' | 'completed' | 'error' => {
    const validStatuses: ('pending' | 'running' | 'completed' | 'error')[] = [
      'pending',
      'running',
      'completed',
      'error',
    ];
    return validStatuses.includes(status as any)
      ? (status as 'pending' | 'running' | 'completed' | 'error')
      : 'pending';
  };

  // Format progress bar color based on task status
  const getProgressColor = (status: string) => {
    if (status === 'completed') return 'bg-green-400';
    if (status === 'error') return 'bg-red-400';
    return 'bg-emerald-400';
  };

  // Format output text with colored indicators
  const formatOutput = (text: string | undefined) => {
    if (!text) return null;

    return text.split('\n').map((line, i) => {
      let className = 'break-words';
      if (line.includes('✅')) {
        className += ' text-green-400 font-medium';
      } else if (line.includes('❌')) {
        className += ' text-red-400 font-medium';
      } else if (line.includes('🔍') || line.includes('👀') || line.includes('⚙️')) {
        className += ' text-blue-400 font-medium';
      } else if (line.includes('🏁')) {
        className += ' text-yellow-400 font-medium';
      }
      return (
        <div key={i} className={className}>
          {line}
        </div>
      );
    });
  };

  // Get status icon for task
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertTriangleIcon className="h-5 w-5 text-red-400" />;
      case 'running':
        return <PlayIcon className="h-5 w-5 text-emerald-400 animate-pulse" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  // Submit handler for creating new tasks
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDescription.trim()) return;
    await createTask(taskDescription);
  };

  // TaskCard component embedded directly
  const TaskCard = ({ task }: { task: Task }) => {
    const [expanded, setExpanded] = useState(false);
    const maxHeight = expanded ? 'max-h-96' : 'max-h-24';

    return (
      <div
        className={`
          bg-zinc-800 p-4 rounded-xl border flex-1 overflow-y-auto border-white/10 shadow-lg backdrop-blur-sm
          transition-all duration-500 
          ${task.status === 'running' ? 'border-emerald-400/50' : ''}
        `}
        style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-white" title={task.description}>
            {task.description}
          </h3>
          <div className="flex items-center gap-1">
            {getStatusIcon(task.status)}
            <span
              className={`
                text-xs capitalize px-2 py-0.5 rounded-full transition-colors
                ${
                  task.status === 'completed'
                    ? 'bg-green-400/20 text-green-400'
                    : task.status === 'error'
                      ? 'bg-red-400/20 text-red-400'
                      : task.status === 'running'
                        ? 'bg-emerald-400/20 text-emerald-400 animate-pulse'
                        : 'bg-gray-400/20 text-gray-400'
                }
              `}>
              {task.status}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <div className="w-full bg-zinc-700 rounded-full h-1.5 ">
            <div
              className={`h-full transition-all duration-300 ${getProgressColor(task.status)}`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>

        {(task.output || task.error) && (
          <div
            className={`
            bg-black/30 rounded-md mb-2 transition-all duration-300
            ${
              task.status === 'running'
                ? 'border-l-2 border-emerald-400'
                : task.status === 'error'
                  ? 'border-l-2 border-red-400'
                  : task.status === 'completed'
                    ? 'border-l-2 border-green-400'
                    : ''
            }
          `}>
            <div className={`rounded-md p-2 overflow-y-auto transition-all ${maxHeight}`}>
              <div className="text-xs font-mono space-y-1 text-white/90 select-text">
                {task.error && <div className="bg-red-900/20 p-2 rounded text-red-300 mb-2">{task.error}</div>}
                {formatOutput(task.output)}
              </div>
            </div>

            {task.output && task.output.length > 150 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-center gap-1 py-1 text-xs text-gray-400 hover:text-white">
                {expanded ? 'Show Less' : 'Show More'}
                <ArrowDownIcon className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        )}

        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <div>ID: {task.id.substring(0, 8)}</div>
          <div>Updated: {formatDate(task.updatedAt)}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-zinc-900 text-white flex-1 overflow-y-auto">
      <main className="container mx-auto py-8 px-4 max-w-3xl">
        <section className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-emerald-400">Task Manager</h1>
          <p className="text-gray-400 mb-6">
            Create and monitor background tasks that continue running even when your browser is closed.
          </p>
        </section>

        <section className="mb-8">
          <div className="bg-zinc-800 p-6 rounded-xl border border-white/10 shadow-lg overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-white">Create New Task</h2>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
              <input
                value={taskDescription}
                onChange={e => setTaskDescription(e.target.value)}
                placeholder="Enter task description..."
                className="bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all flex-1"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !taskDescription.trim()}
                className="bg-emerald-400 hover:bg-emerald-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors">
                {isSubmitting ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
                <span>Run</span>
              </button>
            </form>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-white">Active Tasks</h2>
          <div className="grid gap-4 md:grid-cols-1 overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p>No tasks created yet. Create your first task above.</p>
              </div>
            ) : (
              tasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    opacity: 0,
                    animation: 'fadeIn 0.3s ease-out forwards',
                    animationDelay: `${tasks.indexOf(task) * 0.1}s`,
                  }}>
                  <TaskCard task={task} />
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>
    </div>
  );
}

// Icon components
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

function AlertTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );
}

function LoaderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <line x1="12" y1="2" x2="12" y2="6"></line>
      <line x1="12" y1="18" x2="12" y2="22"></line>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
      <line x1="2" y1="12" x2="6" y2="12"></line>
      <line x1="18" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
  );
}

function ArrowDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
  );
}
