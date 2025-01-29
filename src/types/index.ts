export interface Company {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Risk {
  id: string;
  name: string;
  description: string;
  level: 'Low' | 'Medium' | 'High';
  companyId: string;
}

export interface Control {
  id: string;
  name: string;
  description: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  riskId: string;
}

export type Language = 'en' | 'es';

export interface Translations {
  companies: string;
  risks: string;
  controls: string;
  addCompany: string;
  addRisk: string;
  addControl: string;
  name: string;
  description: string;
  created: string;
  back: string;
  cancel: string;
  create: string;
  update: string;
  level: string;
  frequency: string;
  associatedRisk: string;
  associatedControls: string;
  selectRisk: string;
  low: string;
  medium: string;
  high: string;
  daily: string;
  weekly: string;
  monthly: string;
  quarterly: string;
  yearly: string;
  createNewRisk: string;
  createNewControl: string;
  existingRisks: string;
  existingControls: string;
  impact: string;
  riskAndControlMatrix: string;
  assignRiskAndControl: string;
  risk: string;
  control: string;
  actions: string;
}