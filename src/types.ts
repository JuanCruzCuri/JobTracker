export type JobStatus =
  | 'Guardado'
  | 'Aplicado'
  | 'Entrevista RRHH'
  | 'Entrevista Técnica'
  | 'Oferta'
  | 'Rechazado';

export type WorkModality = 'Presencial' | 'Híbrido' | 'Remoto';

export type Currency = 'ARS' | 'USD' | 'EUR' | 'BRL' | 'CLP' | 'MXN' | 'UYU';

export interface JobApplication {
  id: string;
  company: string;
  title: string;
  url: string;
  status: JobStatus;
  modality: WorkModality;
  salary: string;
  currency: Currency;
  notes: string;
  applicationDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const STATUS_COLORS: Record<JobStatus, { bg: string; text: string; border: string }> = {
  'Guardado': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  'Aplicado': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  'Entrevista RRHH': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  'Entrevista Técnica': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  'Oferta': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  'Rechazado': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
};

export const ALL_STATUSES: JobStatus[] = [
  'Guardado',
  'Aplicado',
  'Entrevista RRHH',
  'Entrevista Técnica',
  'Oferta',
  'Rechazado',
];

export const ALL_MODALITIES: WorkModality[] = ['Presencial', 'Híbrido', 'Remoto'];

export const ALL_CURRENCIES: Currency[] = ['ARS', 'USD', 'EUR', 'BRL', 'CLP', 'MXN', 'UYU'];
