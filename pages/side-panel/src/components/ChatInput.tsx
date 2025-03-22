import { useState, useRef, useEffect, useCallback } from 'react';
import { ImAttachment } from 'react-icons/im';
import { FiX } from 'react-icons/fi';

interface ChatInputProps {
  onSendMessage: (text: string, files?: File[]) => void;
  onStopTask: () => void;
  disabled: boolean;
  showStopButton: boolean;
  setContent?: (setter: (text: string) => void) => void;
  isDarkMode?: boolean;
}

export default function ChatInput({
  onSendMessage,
  onStopTask,
  disabled,
  showStopButton,
  setContent,
  isDarkMode = false,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle text changes and resize textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    // Resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  };

  // Expose a method to set content from outside
  useEffect(() => {
    if (setContent) {
      setContent(setText);
    }
  }, [setContent]);

  // Initial resize when component mounts
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (text.trim() || selectedFiles.length > 0) {
        onSendMessage(text, selectedFiles.length > 0 ? selectedFiles : undefined);
        setText('');
        setSelectedFiles([]);
      }
    },
    [text, selectedFiles, onSendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Convert FileList to array and filter for PDFs
      const fileArray = Array.from(files).filter(file => file.type === 'application/pdf');
      setSelectedFiles(prev => [...prev, ...fileArray]);
    }
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`overflow-hidden rounded-lg border transition-colors focus-within:border-green-400 hover:border-green-400 ${isDarkMode ? 'border-gray-700' : ''}`}
      aria-label="Chat input form">
      <div className="flex flex-col">
        {selectedFiles.length > 0 && (
          <div className={`p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="text-sm font-medium mb-1">Selected PDFs:</div>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-1 px-2 py-1 rounded ${
                    isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'
                  } text-sm border border-green-400`}>
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button type="button" onClick={() => removeFile(index)} className="text-gray-500 hover:text-red-500">
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={5}
          className={`w-full resize-none border-none p-2 focus:outline-none ${
            disabled
              ? isDarkMode
                ? 'bg-gray-800 text-gray-400'
                : 'bg-gray-100 text-gray-500'
              : isDarkMode
                ? 'bg-gray-800 text-gray-200'
                : 'bg-white'
          }`}
          placeholder="Ask Bilic Neo..."
          aria-label="Message input"
        />

        <div
          className={`flex items-center justify-between px-2 py-1.5 ${
            disabled ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-100') : isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
          <div className="flex gap-2 text-gray-500">
            <button
              type="button"
              onClick={handleFileClick}
              disabled={disabled}
              className={`p-1 rounded hover:bg-gray-200 ${isDarkMode ? 'hover:bg-gray-700' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Attach PDF files">
              <ImAttachment size={18} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              multiple
              className="hidden"
              disabled={disabled}
            />
          </div>

          {showStopButton ? (
            <button
              type="button"
              onClick={onStopTask}
              className="rounded-md bg-red-500 px-3 py-1 text-white transition-colors hover:bg-red-600">
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={disabled}
              className={`rounded-md bg-[#22c55e] px-3 py-1 text-white transition-colors hover:bg-[#15803d] ${disabled ? 'opacity-50' : ''}`}>
              Send
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
