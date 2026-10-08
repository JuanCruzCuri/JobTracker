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
  X,
} from 'lucide-react';
import { JobApplication, STATUS_COLORS } from '../types';
import { useState } from 'react';

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
}

const TAG_COLORS = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-teal-100 text-teal-700 border-teal-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-cyan-100 text-cyan-700 border-cyan-200',
  'bg-rose-100 text-rose-700 border-rose-200',
];

function getTagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
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

  const jobTags = job.tags || [];

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

        {/* Tags */}
        {jobTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {jobTags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

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
