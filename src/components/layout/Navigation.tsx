import React from 'react';

export type NavigationSection = 'events' | 'bets' | 'stats' | 'balance';

interface NavigationProps {
  activeSection: NavigationSection;
  onSectionChange: (section: NavigationSection) => void;
}

interface NavigationItem {
  id: NavigationSection;
  label: string;
  icon: React.ReactNode;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const navigationItems: NavigationItem[] = [
    {
      id: 'events',
      label: 'Eventos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'bets',
      label: 'Apostas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      id: 'stats',
      label: 'Estatísticas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'balance',
      label: 'Saldo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const handleSectionClick = (section: NavigationSection) => {
    onSectionChange(section);
  };

  const getButtonClasses = (isActive: boolean) => {
    const baseClasses = 'flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
    const activeClasses = 'text-primary-600 bg-primary-50 border-primary-200';
    const inactiveClasses = 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const getDesktopButtonClasses = (isActive: boolean) => {
    const baseClasses = 'flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-h-[44px]';
    const activeClasses = 'text-primary-600 bg-primary-50 border-primary-200';
    const inactiveClasses = 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <>
      {/* Desktop Navigation - Horizontal Tabs */}
      <nav className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={getDesktopButtonClasses(activeSection === item.id)}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 gap-1 px-2 py-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.id)}
              className={getButtonClasses(activeSection === item.id)}
              aria-current={activeSection === item.id ? 'page' : undefined}
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};