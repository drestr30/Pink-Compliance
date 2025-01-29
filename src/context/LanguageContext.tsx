import React, { createContext, useContext, useState } from 'react';
import { Language, Translations } from '../types';

const translations: Record<Language, Translations> = {
  en: {
    companies: 'Companies',
    risks: 'Risks',
    controls: 'Controls',
    addCompany: 'Add Company',
    addRisk: 'Add Risk',
    addControl: 'Add Control',
    name: 'Name',
    description: 'Description',
    created: 'Created',
    back: 'Back',
    cancel: 'Cancel',
    create: 'Create',
    update: 'Update',
    level: 'Level',
    frequency: 'Frequency',
    associatedRisk: 'Associated Risk',
    associatedControls: 'Associated Controls',
    selectRisk: 'Select Risk',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
    createNewRisk: 'Create New Risk',
    createNewControl: 'Create New Control',
    existingRisks: 'Existing Risks',
    existingControls: 'Existing Controls',
    impact: 'Impact',
    riskAndControlMatrix: 'Risk and Control Matrix',
    assignRiskAndControl: 'Assign Risk and Control',
    risk: 'Risk',
    control: 'Control',
    actions: 'Actions',
  },
  es: {
    companies: 'Empresas',
    risks: 'Riesgos',
    controls: 'Controles',
    addCompany: 'Agregar Empresa',
    addRisk: 'Agregar Riesgo',
    addControl: 'Agregar Control',
    name: 'Nombre',
    description: 'Descripción',
    created: 'Creado',
    back: 'Volver',
    cancel: 'Cancelar',
    create: 'Crear',
    update: 'Actualizar',
    level: 'Nivel',
    frequency: 'Frecuencia',
    associatedRisk: 'Riesgo Asociado',
    associatedControls: 'Controles Asociados',
    selectRisk: 'Seleccionar Riesgo',
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    yearly: 'Anual',
    createNewRisk: 'Crear Nuevo Riesgo',
    createNewControl: 'Crear Nuevo Control',
    existingRisks: 'Riesgos Existentes',
    existingControls: 'Controles Existentes',
    impact: 'Impacto',
    riskAndControlMatrix: 'Matriz de Riesgos y Controles',
    assignRiskAndControl: 'Asignar Riesgo y Control',
    risk: 'Riesgo',
    control: 'Control',
    actions: 'Acciones',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof Translations) => translations[language][key];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}