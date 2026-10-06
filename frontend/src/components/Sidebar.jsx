import React, { useState } from 'react';
import { LayoutGrid, ListTodo, Calendar, BarChart3, Timer, FolderPlus, Tag, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const Sidebar = () => {
  const { activeView, setActiveView, categories, filters, setFilters, analytics, createCategory } = useTasks();
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#6366f1');

  const navItems = [
    { id: 'kanban', label: 'Kanban Board', icon: LayoutGrid, count: analytics?.totalTasks || 0 },
    { id: 'list', label: 'Task List', icon: ListTodo, count: analytics?.totalTasks || 0 },
    { id: 'calendar', label: 'Calendar View', icon: Calendar },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'pomodoro', label: 'Pomodoro Timer', icon: Timer }
  ];

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    createCategory({ name: newCategoryName.trim(), color: newCategoryColor });
    setNewCategoryName('');
    setShowCategoryInput(false);
  };

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-900/60 p-4 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        {/* Navigation Views */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 px-3">Views</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Categories</p>
            <button
              onClick={() => setShowCategoryInput(!showCategoryInput)}
              className="text-slate-400 hover:text-indigo-400 p-1 rounded transition-colors"
              title="Add Category"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>

          {showCategoryInput && (
            <form onSubmit={handleAddCategory} className="px-3 mb-3 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-2 animate-fade-in">
              <input
                type="text"
                placeholder="Category Name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          <div className="space-y-1">
            {/* 'All Categories' Option */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, categoryId: 'all' }))}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                filters.categoryId === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                <span>All Projects</span>
              </div>
            </button>

            {categories.map((cat) => {
              const isSelected = filters.categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilters(prev => ({ ...prev, categoryId: cat.id }))}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || '#6366f1' }}
                    ></span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Productivity Widget */}
      {analytics && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 space-y-2 mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Productivity
            </span>
            <span>{analytics.completionRate}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${analytics.completionRate}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium text-center">
            {analytics.completedTasks} of {analytics.totalTasks} tasks completed
          </p>
        </div>
      )}
    </aside>
  );
};
