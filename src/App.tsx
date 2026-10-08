import { useState, useMemo } from 'react';
import { Plus, Search, Briefcase, LayoutGrid, List } from 'lucide-react';
import { JobApplication, JobStatus } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import JobForm from './components/JobForm';
import JobCard from './components/JobCard';
import FilterBar from './components/FilterBar';
import TagFilter from './components/TagFilter';
import ImportExport from './components/ImportExport';
import StatsBar from './components/StatsBar';

type SortOption = 'date-desc' | 'date-asc' | 'company' | 'status';

export default function App() {
  const [jobs, setJobs] = useLocalStorage<JobApplication[]>('jobtracker-applications', []);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [activeFilter, setActiveFilter] = useState<JobStatus | 'Todos'>('Todos');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get all unique tags from jobs
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    jobs.forEach((job) => {
      (job.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [jobs]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Filter by status
    if (activeFilter !== 'Todos') {
      result = result.filter((job) => job.status === activeFilter);
    }

    // Filter by tags (OR logic - show jobs that have ANY of the selected tags)
    if (selectedTags.length > 0) {
      result = result.filter((job) => {
        const jobTags = job.tags || [];
        return selectedTags.some((tag) => jobTags.includes(tag));
      });
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.company.toLowerCase().includes(query) ||
          job.title.toLowerCase().includes(query) ||
          job.notes.toLowerCase().includes(query) ||
          (job.tags || []).some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'date-desc':
        result.sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
        break;
      case 'date-asc':
        result.sort((a, b) => new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime());
        break;
      case 'company':
        result.sort((a, b) => a.company.localeCompare(b.company));
        break;
      case 'status':
        result.sort((a, b) => a.status.localeCompare(b.status));
        break;
    }

    return result;
  }, [jobs, activeFilter, selectedTags, searchQuery, sortBy]);

  // Counts for filter bar
  const counts = useMemo(() => {
    const c: Record<string, number> = { Todos: jobs.length };
    jobs.forEach((job) => {
      c[job.status] = (c[job.status] || 0) + 1;
    });
    return c;
  }, [jobs]);

  // Handlers
  const handleSave = (job: JobApplication) => {
    setJobs((prev) => {
      const existing = prev.findIndex((j) => j.id === job.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = job;
        return updated;
      }
      return [job, ...prev];
    });
    setShowForm(false);
    setEditingJob(null);
  };

  const handleEdit = (job: JobApplication) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingJob(null);
  };

  const handleImport = (importedJobs: JobApplication[]) => {
    setJobs(importedJobs);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">JobTracker</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Seguimiento de Postulaciones</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ImportExport jobs={jobs} onImport={handleImport} />
              <button
                onClick={() => {
                  setEditingJob(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nueva Postulación</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        {jobs.length > 0 && <StatsBar jobs={jobs} />}

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por empresa, puesto, notas o etiquetas..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="date-desc">Más recientes</option>
              <option value="date-asc">Más antiguas</option>
              <option value="company">Empresa (A-Z)</option>
              <option value="status">Estado</option>
            </select>
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${
                  viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        {jobs.length > 0 && (
          <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />
        )}

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <TagFilter
            allTags={allTags}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            onClearAll={handleClearTags}
          />
        )}

        {/* Job Cards */}
        {filteredJobs.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                : 'flex flex-col gap-4'
            }
          >
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
              <Briefcase className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Comenzá a trackear tus postulaciones!
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Agregá tu primera postulación para empezar a organizar tu búsqueda laboral.
              Todos los datos se guardan localmente en tu navegador.
            </p>
            <button
              onClick={() => {
                setEditingJob(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Agregar Primera Postulación
            </button>
          </div>
        ) : (
          /* No results */
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron postulaciones con los filtros actuales.</p>
            <button
              onClick={() => {
                setActiveFilter('Todos');
                setSelectedTags([]);
                setSearchQuery('');
              }}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Results count */}
        {filteredJobs.length > 0 && (
          <p className="text-center text-sm text-gray-400">
            Mostrando {filteredJobs.length} de {jobs.length} postulaciones
          </p>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <JobForm job={editingJob} onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  );
}
