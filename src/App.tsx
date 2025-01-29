import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CompanySection } from './components/CompanySection';
import { RiskSection } from './components/RiskSection';
import { ControlSection } from './components/ControlSection';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const [activeSection, setActiveSection] = useState('company');

  const renderSection = () => {
    switch (activeSection) {
      case 'company':
        return <CompanySection />;
      case 'risk':
        return <RiskSection />;
      case 'control':
        return <ControlSection />;
      default:
        return <CompanySection />;
    }
  };

  return (
    <LanguageProvider>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1">
          {renderSection()}
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;