import { JobApplication, JobStatus } from '../types';
import {
  Briefcase,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

interface StatsBarProps {
  jobs: JobApplication[];
}

export default function StatsBar({ jobs }: StatsBarProps) {
  const total = jobs.length;
  const active = jobs.filter((j) => !['Rechazado', 'Oferta'].includes(j.status)).length;
  const interviews = jobs.filter(
    (j) => j.status === 'Entrevista RRHH' || j.status === 'Entrevista Técnica'
  ).length;
  const offers = jobs.filter((j) => j.status === 'Oferta').length;
  const rejected = jobs.filter((j) => j.status === 'Rechazado').length;
  const saved = jobs.filter((j) => j.status === 'Guardado').length;

  const stats = [
    { label: 'Total', value: total, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Activas', value: active, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Entrevistas', value: interviews, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Guardadas', value: saved, icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50' },
    { label: 'Ofertas', value: offers, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Rechazadas', value: rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3"
        >
          <div className={`p-2 rounded-lg ${stat.bg}`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
