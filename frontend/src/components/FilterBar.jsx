import React from 'react';
import { Filter, ArrowUpDown, X, LayoutGrid, ListTodo, Calendar, BarChart3, Timer } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const FilterBar = () => {
  const { filters, setFilters, activeView, setActiveView } = useTasks();

  const statuses = [
    { id: 'all', label: 'All' },
    { id: 'to do', label: 'To Do' },
    { id: 'in progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' }
  ];

  const priorities = [
    { id: 'all', label: 'All Priorities' },
    { id: 'urgent', label: '🔴 Urgent' },
    { id: 'high', label: '🟠 High' },
    { id: 'medium', label: '🔵 Medium' },
    { id: 'low', label: '🟢 Low' }
  ];

  const hasActiveFilters = filters.status !== 'all' || filters.priority !== 'all' || filters.categoryId !== 'all' || filters.search !== '';

  const resetFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      categoryId: 'all',
      search: '',
      sortBy: 'dueDate',
      sortOrder: 'asc'
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-slate-900/40 rounded-2xl border border-slate-800/80 mb-6">
      {/* View switcher for mobile */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 md:hidden border-b border-slate-800 pb-3">
        {[
          { id: 'kanban', icon: LayoutGrid, label: 'Kanban' },
          { id: 'list', icon: ListTodo, label: 'List' },
          { id: 'calendar', icon: Calendar, label: 'Calendar' },
          { id: 'analytics', icon: BarChart3, label: 'Analytics' },
          { id: 'pomodoro', icon: Timer, label: 'Timer' }
        ].map(v => {
          const Icon = v.icon;
          return (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeView === v.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Status:
        </span>
        {statuses.map(s => (
          <button
            key={s.id}
            onClick={() => setFilters(prev => ({ ...prev, status: s.id }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
              filters.status === s.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Priority & Sorting Dropdowns */}
      <div className="flex items-center gap-2.5">
        {/* Priority Select */}
        <select
          value={filters.priority}
          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          className="px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
        >
          {priorities.map(p => (
            <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
              {p.label}
            </option>
          ))}
        </select>

        {/* Sort Select */}
        <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/60 rounded-xl px-2 py-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none pr-1"
          >
            <option value="dueDate" className="bg-slate-900">Due Date</option>
            <option value="priority" className="bg-slate-900">Priority</option>
            <option value="title" className="bg-slate-900">Title</option>
            <option value="createdAt" className="bg-slate-900">Date Created</option>
          </select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="p-1.5 text-xs text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-all flex items-center gap-1 font-semibold"
            title="Reset Filters"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
