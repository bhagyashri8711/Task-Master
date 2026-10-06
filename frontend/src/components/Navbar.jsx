import React from 'react';
import { Plus, Search, CheckCircle2, AlertTriangle, LogIn, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

export const Navbar = () => {
  const { user, setAuthModalOpen, loginAsDemo, logout } = useAuth();
  const { filters, setFilters, openCreateModal, analytics } = useTasks();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            TaskMaster <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">Pro</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">Centralized Task Management Platform</p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks, tags, descriptions..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* Quick Overdue Alert Pill */}
            {analytics?.overdueTasks > 0 && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                <span>{analytics.overdueTasks} Overdue</span>
              </div>
            )}

            {/* "+ New Task" Button */}
            <button
              onClick={openCreateModal}
              className="gradient-btn px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                alt={user.name}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/40"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-200">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[110px]">{user.email}</p>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-1"
              >
                <LogIn className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={loginAsDemo}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Login</span>
            </button>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
