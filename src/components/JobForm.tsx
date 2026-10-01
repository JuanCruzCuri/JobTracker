import React, { useState, useEffect } from 'react';
import {
  Building2,
  Link2,
  Tag,
  MapPin,
  DollarSign,
  FileText,
  Calendar,
  Save,
  X,
  Briefcase,
} from 'lucide-react';
import {
  JobApplication,
  JobStatus,
  WorkModality,
  Currency,
  ALL_STATUSES,
  ALL_MODALITIES,
  ALL_CURRENCIES,
  STATUS_COLORS,
} from '../types';
import { v4 as uuidv4 } from 'uuid';

interface JobFormProps {
  job?: JobApplication | null;
  onSave: (job: JobApplication) => void;
  onCancel: () => void;
}

const emptyForm = {
  company: '',
  title: '',
  url: '',
  status: 'Guardado' as JobStatus,
  modality: 'Remoto' as WorkModality,
  salary: '',
  currency: 'USD' as Currency,
  notes: '',
  applicationDate: new Date().toISOString().split('T')[0],
};

export default function JobForm({ job, onSave, onCancel }: JobFormProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (job) {
      setForm({
        company: job.company,
        title: job.title,
        url: job.url,
        status: job.status,
        modality: job.modality,
        salary: job.salary,
        currency: job.currency,
        notes: job.notes,
        applicationDate: job.applicationDate,
      });
    } else {
      setForm(emptyForm);
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const jobData: JobApplication = {
      id: job?.id || uuidv4(),
      ...form,
      createdAt: job?.createdAt || now,
      updatedAt: now,
    };
    onSave(jobData);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            {job ? 'Editar Postulación' : 'Nueva Postulación'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Company & Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Building2 className="w-4 h-4 text-gray-400" />
                Empresa *
              </label>
              <input
                type="text"
                required
                value={form.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Ej: Google, Mercado Libre..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Briefcase className="w-4 h-4 text-gray-400" />
                Título del Puesto *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ej: Frontend Developer"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Link2 className="w-4 h-4 text-gray-400" />
              URL de la Publicación
            </label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Status & Modality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Tag className="w-4 h-4 text-gray-400" />
                Estado
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_STATUSES.map((status) => {
                  const colors = STATUS_COLORS[status];
                  const isSelected = form.status === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleChange('status', status)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        isSelected
                          ? `${colors.bg} ${colors.text} ${colors.border} ring-2 ring-offset-1 ring-blue-400`
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <MapPin className="w-4 h-4 text-gray-400" />
                Modalidad
              </label>
              <div className="flex gap-2">
                {ALL_MODALITIES.map((mod) => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => handleChange('modality', mod)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      form.modality === mod
                        ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-offset-1 ring-blue-400'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <DollarSign className="w-4 h-4 text-gray-400" />
                Salario / Banda Salarial
              </label>
              <input
                type="text"
                value={form.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
                placeholder="Ej: 3000 - 5000, A convenir..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Moneda
              </label>
              <select
                value={form.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 bg-white"
              >
                {ALL_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              Fecha de Aplicación
            </label>
            <input
              type="date"
              value={form.applicationDate}
              onChange={(e) => handleChange('applicationDate', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <FileText className="w-4 h-4 text-gray-400" />
              Notas / Detalles / Beneficios
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={5}
              placeholder="Notas de entrevistas, beneficios, requisitos, contacto..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder:text-gray-400 resize-y"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              {job ? 'Guardar Cambios' : 'Agregar Postulación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
