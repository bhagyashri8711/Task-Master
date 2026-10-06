import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const Toast = () => {
  const { toast } = useTasks();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={20} className="text-emerald-400" />,
    error: <AlertCircle size={20} className="text-rose-400" />,
    info: <Info size={20} className="text-indigo-400" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-emerald-950/80',
    error: 'border-rose-500/40 bg-rose-950/80',
    info: 'border-indigo-500/40 bg-indigo-950/80'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl ${borders[toast.type] || borders.info} text-slate-100`}>
        {icons[toast.type] || icons.info}
        <span className="text-sm font-medium pr-2">{toast.message}</span>
      </div>
    </div>
  );
};
