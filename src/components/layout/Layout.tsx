import React, { useState } from 'react';
import { Header } from './Header';
import { Navigation, NavigationSection } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  onDepositClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onDepositClick = () => {} 
}) => {
  const [activeSection, setActiveSection] = useState<NavigationSection>('events');

  const handleSectionChange = (section: NavigationSection) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onDepositClick={onDepositClick} />
      
      {/* Navigation */}
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
              <div className="p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="px-4 py-4 pb-20"> {/* pb-20 to account for bottom navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
              <div className="p-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};