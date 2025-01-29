import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Company, Risk, Control } from '../types';
import { CompanyDetail } from './CompanyDetail';
import { useLanguage } from '../context/LanguageContext';

export function CompanySection() {
  const { t } = useLanguage();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [controls, setControls] = useState<Control[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompany) {
      setCompanies(companies.map(company => 
        company.id === editingCompany.id 
          ? { ...company, ...formData }
          : company
      ));
    } else {
      const newCompany: Company = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setCompanies([...companies, newCompany]);
    }
    setShowForm(false);
    setEditingCompany(null);
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      description: company.description,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setCompanies(companies.filter(company => company.id !== id));
    // Also delete associated risks and controls
    const risksToDelete = risks.filter(risk => risk.companyId === id);
    const riskIds = risksToDelete.map(risk => risk.id);
    setRisks(risks.filter(risk => risk.companyId !== id));
    setControls(controls.filter(control => !riskIds.includes(control.riskId)));
  };

  const handleAddRisk = (riskData: Omit<Risk, 'id'>) => {
    const newRisk: Risk = {
      id: Date.now().toString(),
      ...riskData,
    };
    setRisks([...risks, newRisk]);
  };

  const handleAddControl = (controlData: Omit<Control, 'id'>) => {
    const newControl: Control = {
      id: Date.now().toString(),
      ...controlData,
    };
    setControls([...controls, newControl]);
  };

  const handleDeleteRisk = (id: string) => {
    setRisks(risks.filter(risk => risk.id !== id));
    setControls(controls.filter(control => control.riskId !== id));
  };

  const handleDeleteControl = (id: string) => {
    setControls(controls.filter(control => control.id !== id));
  };

  if (selectedCompany) {
    return (
      <CompanyDetail
        company={selectedCompany}
        risks={risks}
        controls={controls}
        onBack={() => setSelectedCompany(null)}
        onAddRisk={handleAddRisk}
        onAddControl={handleAddControl}
        onDeleteRisk={handleDeleteRisk}
        onDeleteControl={handleDeleteControl}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('companies')}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>{t('addCompany')}</span>
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('description')}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingCompany ? t('update') : t('create')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCompany(null);
                  setFormData({ name: '', description: '' });
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedCompany(company)}
          >
            <div>
              <h3 className="text-lg font-semibold">{company.name}</h3>
              <p className="text-gray-600">{company.description}</p>
              <p className="text-sm text-gray-500">
                {t('created')}: {new Date(company.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(company);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(company.id);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}