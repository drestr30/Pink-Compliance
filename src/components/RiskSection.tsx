import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Riesgo } from '../types';

export function RiskSection() {
  const [riesgos, setRiesgos] = useState<Riesgo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRiesgo, setEditingRiesgo] = useState<Riesgo | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nivel: 'Bajo',
    empresaId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRiesgo) {
      setRiesgos(riesgos.map(riesgo => 
        riesgo.id === editingRiesgo.id 
          ? { ...riesgo, ...formData }
          : riesgo
      ));
    } else {
      const newRiesgo: Riesgo = {
        id: Date.now().toString(),
        ...formData,
      };
      setRiesgos([...riesgos, newRiesgo]);
    }
    setShowForm(false);
    setEditingRiesgo(null);
    setFormData({ nombre: '', descripcion: '', nivel: 'Bajo', empresaId: '' });
  };

  const handleEdit = (riesgo: Riesgo) => {
    setEditingRiesgo(riesgo);
    setFormData({
      nombre: riesgo.nombre,
      descripcion: riesgo.descripcion,
      nivel: riesgo.nivel,
      empresaId: riesgo.empresaId,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setRiesgos(riesgos.filter(riesgo => riesgo.id !== id));
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Alto':
        return 'bg-red-100 text-red-800';
      case 'Medio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Bajo':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Riesgos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Agregar Riesgo</span>
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nivel</label>
              <select
                value={formData.nivel}
                onChange={(e) => setFormData({ ...formData, nivel: e.target.value as 'Bajo' | 'Medio' | 'Alto' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Bajo">Bajo</option>
                <option value="Medio">Medio</option>
                <option value="Alto">Alto</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingRiesgo ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingRiesgo(null);
                  setFormData({ nombre: '', descripcion: '', nivel: 'Bajo', empresaId: '' });
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {riesgos.map((riesgo) => (
          <div
            key={riesgo.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{riesgo.nombre}</h3>
              <p className="text-gray-600">{riesgo.descripcion}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-sm ${getNivelColor(riesgo.nivel)}`}>
                {riesgo.nivel}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(riesgo)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDelete(riesgo.id)}
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