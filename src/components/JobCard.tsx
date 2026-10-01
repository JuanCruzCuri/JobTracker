import {
  Building2,
  ExternalLink,
  MapPin,
  DollarSign,
  Calendar,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { JobApplication, STATUS_COLORS } from '../types';
import { useState } from 'react';

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
}

export default function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const statusColors = STATUS_COLORS[job.status];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const modalityIcon = {
    'Presencial': '🏢',
    'Híbrido': '🔄',
    'Remoto': '🏠',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">{job.company}</span>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
          >
            {job.status}
          </span>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {modalityIcon[job.modality]} {job.modality}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              {job.salary} {job.currency}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(job.applicationDate)}
          </span>
        </div>

        {/* URL */}
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver publicación
          </a>
        )}

        {/* Notes preview */}
        {job.notes && !expanded && (
          <p className="mt-3 text-sm text-gray-500 line-clamp-2">
            {job.notes}
          </p>
        )}

        {/* Expanded notes */}
        {job.notes && expanded && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {job.notes && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" /> Ocultar notas
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" /> Ver notas
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(job)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar
            </button>
            <button
              onClick={() => {
                if (window.confirm('¿Estás seguro de eliminar esta postulación?')) {
                  onDelete(job.id);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
