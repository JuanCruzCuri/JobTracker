import { Download, Upload, AlertTriangle } from 'lucide-react';
import { JobApplication } from '../types';
import { useRef } from 'react';

interface ImportExportProps {
  jobs: JobApplication[];
  onImport: (jobs: JobApplication[]) => void;
}

export default function ImportExport({ jobs, onImport }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jobtracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          const validJobs = data.filter(
            (item: any) => item.company && item.title && item.status
          );
          if (validJobs.length > 0) {
            const confirmMsg = `Se importarán ${validJobs.length} postulaciones. ¿Deseás reemplazar los datos actuales o agregar a los existentes?\n\nAceptar = Reemplazar\nCancelar = Se cancela la importación`;
            if (window.confirm(confirmMsg)) {
              onImport(validJobs);
            }
          } else {
            alert('El archivo no contiene postulaciones válidas.');
          }
        } else {
          alert('Formato de archivo inválido.');
        }
      } catch {
        alert('Error al leer el archivo. Asegurate de que sea un JSON válido.');
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        disabled={jobs.length === 0}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Exportar datos como JSON"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Exportar</span>
      </button>
      <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">Importar</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
      <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 ml-2">
        <AlertTriangle className="w-3 h-3" />
        <span>Los datos se guardan localmente</span>
      </div>
    </div>
  );
}
