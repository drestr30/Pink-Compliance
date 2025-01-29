import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, X } from 'lucide-react';
import { Company, Risk, Control } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CompanyDetailProps {
  company: Company;
  risks: Risk[];
  controls: Control[];
  onBack: () => void;
  onAddRisk: (risk: Omit<Risk, 'id'>) => void;
  onAddControl: (control: Omit<Control, 'id'>) => void;
  onDeleteRisk: (id: string) => void;
  onDeleteControl: (id: string) => void;
}

export function CompanyDetail({
  company,
  risks,
  controls,
  onBack,
  onAddRisk,
  onAddControl,
  onDeleteRisk,
  onDeleteControl
}: CompanyDetailProps) {
  const { t } = useLanguage();
  const [showRiskSelector, setShowRiskSelector] = useState(false);
  const [showControlSelector, setShowControlSelector] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<string>('');
  const [showNewRiskForm, setShowNewRiskForm] = useState(false);
  const [showNewControlForm, setShowNewControlForm] = useState(false);
  const [riskForm, setRiskForm] = useState({
    name: '',
    description: '',
    level: 'Low' as const,
  });
  const [controlForm, setControlForm] = useState({
    name: '',
    description: '',
    frequency: 'Monthly' as const,
    riskId: '',
  });

  const availableRisks = risks.filter(risk => risk.companyId !== company.id);
  const companyRisks = risks.filter(risk => risk.companyId === company.id);
  const companyControls = controls.filter(control => 
    companyRisks.some(risk => risk.id === control.riskId)
  );

  const handleRiskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRisk({
      ...riskForm,
      companyId: company.id,
    });
    setRiskForm({ name: '', description: '', level: 'Low' });
    setShowNewRiskForm(false);
    setShowRiskSelector(false);
  };

  const handleControlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddControl({
      ...controlForm,
      riskId: selectedRisk,
    });
    setControlForm({ name: '', description: '', frequency: 'Monthly', riskId: '' });
    setShowNewControlForm(false);
    setShowControlSelector(false);
  };

  const handleAssignExistingRisk = (risk: Risk) => {
    onAddRisk({
      name: risk.name,
      description: risk.description,
      level: risk.level,
      companyId: company.id,
    });
    setShowRiskSelector(false);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 relative">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="mr-2" size={20} />
        {t('back')}
      </button>

      {/* Company Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{company.name}</h1>
        <p className="text-gray-600">{company.description}</p>
      </div>

      {/* Risk and Control Matrix */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t('riskAndControlMatrix')}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('risk')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('impact')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('control')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('frequency')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companyRisks.map(risk => {
                const riskControls = controls.filter(control => control.riskId === risk.id);
                return riskControls.length > 0 ? (
                  riskControls.map((control, controlIndex) => (
                    <tr key={`${risk.id}-${control.id}`}>
                      {controlIndex === 0 && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap" rowSpan={riskControls.length}>
                            <div className="text-sm font-medium text-gray-900">{risk.name}</div>
                            <div className="text-sm text-gray-500">{risk.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap" rowSpan={riskControls.length}>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(risk.level)}`}>
                              {t(risk.level.toLowerCase())}
                            </span>
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{control.name}</div>
                        <div className="text-sm text-gray-500">{control.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {t(control.frequency.toLowerCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {controlIndex === 0 && (
                          <button
                            onClick={() => onDeleteRisk(risk.id)}
                            className="text-red-600 hover:text-red-900 mr-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteControl(control.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key={risk.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{risk.name}</div>
                      <div className="text-sm text-gray-500">{risk.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(risk.level)}`}>
                        {t(risk.level.toLowerCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" colSpan={2}>
                      <div className="text-sm text-gray-500 italic">No controls assigned</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onDeleteRisk(risk.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Risk and Control Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t('assignRiskAndControl')}</h2>
          <div className="space-x-4">
            <button
              onClick={() => setShowRiskSelector(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <Plus size={20} />
              <span>{t('addRisk')}</span>
            </button>
            {companyRisks.length > 0 && (
              <button
                onClick={() => {
                  setSelectedRisk(companyRisks[0].id);
                  setShowControlSelector(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
              >
                <Plus size={20} />
                <span>{t('addControl')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Risk Selector Modal */}
        {showRiskSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{t('addRisk')}</h3>
                <button
                  onClick={() => setShowRiskSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              {!showNewRiskForm ? (
                <>
                  <div className="mb-4">
                    <button
                      onClick={() => setShowNewRiskForm(true)}
                      className="w-full py-3 px-4 bg-gray-50 text-left rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Plus size={20} />
                      <span>{t('createNewRisk')}</span>
                    </button>
                  </div>

                  {availableRisks.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium mb-2">{t('existingRisks')}</h4>
                      {availableRisks.map(risk => (
                        <button
                          key={risk.id}
                          onClick={() => handleAssignExistingRisk(risk)}
                          className="w-full p-3 bg-white border rounded-lg hover:bg-gray-50 text-left"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{risk.name}</h5>
                              <p className="text-sm text-gray-600">{risk.description}</p>
                            </div>
                            <span className={`inline-block px-2 py-1 rounded-full text-sm ${getLevelColor(risk.level)}`}>
                              {t(risk.level.toLowerCase())}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <form onSubmit={handleRiskSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
                    <input
                      type="text"
                      value={riskForm.name}
                      onChange={(e) => setRiskForm({ ...riskForm, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('description')}</label>
                    <textarea
                      value={riskForm.description}
                      onChange={(e) => setRiskForm({ ...riskForm, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('level')}</label>
                    <select
                      value={riskForm.level}
                      onChange={(e) => setRiskForm({ ...riskForm, level: e.target.value as 'Low' | 'Medium' | 'High' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Low">{t('low')}</option>
                      <option value="Medium">{t('medium')}</option>
                      <option value="High">{t('high')}</option>
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {t('create')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewRiskForm(false)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      {t('back')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Control Selector Modal */}
        {showControlSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{t('addControl')}</h3>
                <button
                  onClick={() => {
                    setShowControlSelector(false);
                    setShowNewControlForm(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              {!showNewControlForm ? (
                <>
                  <div className="mb-4">
                    <button
                      onClick={() => setShowNewControlForm(true)}
                      className="w-full py-3 px-4 bg-gray-50 text-left rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Plus size={20} />
                      <span>{t('createNewControl')}</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium mb-2">{t('existingControls')}</h4>
                    {controls
                      .filter(control => control.riskId !== selectedRisk)
                      .map(control => (
                        <button
                          key={control.id}
                          onClick={() => {
                            onAddControl({
                              name: control.name,
                              description: control.description,
                              frequency: control.frequency,
                              riskId: selectedRisk,
                            });
                            setShowControlSelector(false);
                          }}
                          className="w-full p-3 bg-white border rounded-lg hover:bg-gray-50 text-left"
                        >
                          <div>
                            <h5 className="font-medium">{control.name}</h5>
                            <p className="text-sm text-gray-600">{control.description}</p>
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {t(control.frequency.toLowerCase())}
                            </span>
                          </div>
                        </button>
                      ))}
                  </div>
                </>
              ) : (
                <form onSubmit={handleControlSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
                    <input
                      type="text"
                      value={controlForm.name}
                      onChange={(e) => setControlForm({ ...controlForm, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('description')}</label>
                    <textarea
                      value={controlForm.description}
                      onChange={(e) => setControlForm({ ...controlForm, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('frequency')}</label>
                    <select
                      value={controlForm.frequency}
                      onChange={(e) => setControlForm({ ...controlForm, frequency: e.target.value as Control['frequency'] })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Daily">{t('daily')}</option>
                      <option value="Weekly">{t('weekly')}</option>
                      <option value="Monthly">{t('monthly')}</option>
                      <option value="Quarterly">{t('quarterly')}</option>
                      <option value="Yearly">{t('yearly')}</option>
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {t('create')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewControlForm(false)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      {t('back')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}