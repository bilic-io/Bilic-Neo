import { useState, useEffect } from 'react';
import '@src/Options.css';
import { Button } from '@extension/ui';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { GeneralSettings } from './components/GeneralSettings';
import { ModelSettings } from './components/ModelSettings';
import { CompanyInfoSettings } from './components/CompanyInfoSettings';

const Options = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <CompanyInfoSettings isDarkMode={isDarkMode} />;
      case 'general':
        return <GeneralSettings isDarkMode={isDarkMode} />;
      case 'models':
        return <ModelSettings isDarkMode={isDarkMode} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex min-h-screen min-w-[768px] ${isDarkMode ? 'bg-gray-800' : "bg-[url('/bg.jpg')] bg-cover bg-center"} ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
      {/* Vertical Navigation Bar */}
      <nav
        className={`w-48 border-r ${isDarkMode ? 'border-gray-700 bg-gray-800/80' : 'border-white/20 bg-[#22c55e]/10'} backdrop-blur-sm`}>
        <div className="p-4">
          <h1 className={`mb-2 text-xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Bilic Neo</h1>
          <h2 className={`mb-6 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Settings</h2>
          <ul className="space-y-2">
            {[
              { id: 'profile', icon: '👤', label: 'Profile' },
              { id: 'general', icon: '⚙️', label: 'General' },
              { id: 'models', icon: '📊', label: 'Models' },
            ].map(item => (
              <li key={item.id}>
                <Button
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center space-x-2 rounded-lg px-4 py-2 text-left text-base 
                    ${
                      activeTab !== item.id
                        ? `${isDarkMode ? 'bg-gray-700/70 text-gray-300 hover:text-white' : 'bg-[#22c55e]/15 font-medium text-gray-700 hover:text-white'} backdrop-blur-sm`
                        : `${isDarkMode ? 'bg-green-800/50' : ''} text-white backdrop-blur-sm`
                    }`}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`flex-1 ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/10'} p-8 backdrop-blur-sm`}>
        <div className="mx-auto min-w-[512px] max-w-screen-lg">{renderTabContent()}</div>
      </main>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error Occurred</div>);
