import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Control } from '../types';

export function ControlSection() {
  const [controles, setControles] = useState<Control[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingControl, setEditingControl] = useState<Control | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    frecuencia: 'Mensual',
    riesgoId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingControl) {
      setControles(controles.map(control => 
        control.id === editingControl.id 
          ? { ...control, ...formData }
          : control
      ));
    } else {
      const newControl: Control = {
        id: Date.now().toString(),
        ...formData,
      };
      setControles([...controles, newControl]);
    }
    setShowForm(false);
    setEditingControl(null);
    setFormData({ nombre: '', descripcion: '', frecuencia: 'Mensual', riesgoId: '' });
  };

  const handleEdit = (control: Control) => {
    setEditingControl(control);
    setFormData({
      nombre: control.nombre,
      descripcion: control.descripcion,
      frecuencia: control.frecuencia,
      riesgoId: control.riesgoId,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setControles(controles.filter(control => control.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Controles</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Agregar Control</span>
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
              <label className="block text-sm font-medium text-gray-700">Frecuencia</label>
              <select
                value={formData.frecuencia}
                onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value as Control['frecuencia'] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Diario">Diario</option>
                <option value="Semanal">Semanal</option>
                <option value="Mensual">Mensual</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingControl ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingControl(null);
                  setFormData({ nombre: '', descripcion: '', frecuencia: 'Mensual', riesgoId: '' });
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
        {controles.map((control) => (
          <div
            key={control.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{control.nombre}</h3>
              <p className="text-gray-600">{control.descripcion}</p>
              <span className="inline-block px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                {control.frecuencia}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(control)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDelete(control.id)}
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