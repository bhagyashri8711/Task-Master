import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskList } from './components/TaskList';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskModal } from './components/TaskModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const MainContent = () => {
  const { user, loginAsDemo, setAuthModalOpen } = useAuth();
  const { activeView } = useTasks();

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 text-center max-w-4xl mx-auto my-12 animate-fade-in space-y-8">
        {/* Landing Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Centralized Task Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Organize Your Work & <br />
            <span className="gradient-text">Supercharge Productivity</span>
          </h1>

          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate traditional notebook confusion and fragmented apps. Securely create, organize, prioritize, and track all your tasks from a single responsive platform.
          </p>
        </div>

        {/* Hero CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={loginAsDemo}
            className="gradient-btn px-8 py-3.5 rounded-2xl text-sm font-extrabold flex items-center gap-2.5 shadow-xl shadow-indigo-600/40"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Demo Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-8 py-3.5 rounded-2xl text-sm font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-all"
          >
            Sign In / Register
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left w-full border-t border-slate-800/80">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Kanban & Calendar</h3>
            <p className="text-xs text-slate-400">Drag & drop Kanban board, list view, and interactive due date calendar.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Secure Authentication</h3>
            <p className="text-xs text-slate-400">JWT-encrypted multi-user isolation with custom categories and tags.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Focus & Analytics</h3>
            <p className="text-xs text-slate-400">Built-in Pomodoro timer and real-time velocity productivity stats.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-4">
      {/* Show FilterBar for Kanban, List, and Calendar views */}
      {['kanban', 'list', 'calendar'].includes(activeView) && <FilterBar />}

      {/* Active View Renderer */}
      {activeView === 'kanban' && <KanbanBoard />}
      {activeView === 'list' && <TaskList />}
      {activeView === 'calendar' && <CalendarView />}
      {activeView === 'analytics' && <AnalyticsView />}
      {activeView === 'pomodoro' && <PomodoroTimer />}
    </main>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <div className="flex-1 flex">
            <Sidebar />
            <MainContent />
          </div>
          <TaskModal />
          <AuthModal />
          <Toast />
        </div>
      </TaskProvider>
    </AuthProvider>
  );
}
