import { Filter } from 'lucide-react';
import { JobStatus, ALL_STATUSES, STATUS_COLORS } from '../types';

interface FilterBarProps {
  activeFilter: JobStatus | 'Todos';
  onFilterChange: (filter: JobStatus | 'Todos') => void;
  counts: Record<string, number>;
}

export default function FilterBar({ activeFilter, onFilterChange, counts }: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filtrar por estado:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('Todos')}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            activeFilter === 'Todos'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          Todos ({counts['Todos'] || 0})
        </button>
        {ALL_STATUSES.map((status) => {
          const colors = STATUS_COLORS[status];
          const isActive = activeFilter === status;
          return (
            <button
              key={status}
              onClick={() => onFilterChange(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                isActive
                  ? `${colors.bg} ${colors.text} ${colors.border} shadow-sm`
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {status} ({counts[status] || 0})
            </button>
          );
        })}
      </div>
    </div>
  );
}
