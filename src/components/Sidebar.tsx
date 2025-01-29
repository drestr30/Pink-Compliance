import React from 'react';
import { Building2, ShieldAlert, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'company', label: t('companies'), icon: Building2 },
    { id: 'risk', label: t('risks'), icon: ShieldAlert },
    { id: 'control', label: t('controls'), icon: Shield },
  ];

  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4">
      <div className="text-white text-xl font-bold mb-8 p-2">
        Risk Management
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto pt-4">
        <LanguageToggle />
      </div>
    </div>
  );
}