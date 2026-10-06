import React from 'react';
import { useTasks } from '../context/TaskContext';
import { BarChart3, CheckCircle2, Clock, AlertTriangle, PieChart, Activity, Zap, TrendingUp } from 'lucide-react';

export const AnalyticsView = () => {
  const { analytics, loading } = useTasks();

  if (loading || !analytics) {
    return (
      <div className="p-8 text-center text-slate-400">Loading productivity insights...</div>
    );
  }

  const {
    totalTasks,
    completedTasks,
    inProgressTasks,
    toDoTasks,
    overdueTasks,
    completionRate,
    totalEstHours,
    totalActHours,
    priorityBreakdown,
    categoryBreakdown,
    recentActivity
  } = analytics;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> Performance & Productivity Insights
          </h2>
          <p className="text-xs text-slate-400 mt-1">Real-time metrics, completion velocity, and activity history.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-black text-emerald-400">{completionRate}%</p>
            <p className="text-[11px] font-semibold text-slate-400">Completion Rate</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
            ✓
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Tasks</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalTasks}</p>
          <p className="text-[11px] text-slate-400">{completedTasks} finished, {inProgressTasks} in progress</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Overdue Tasks</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400">{overdueTasks}</p>
          <p className="text-[11px] text-slate-400">{overdueTasks > 0 ? 'Requires immediate attention' : 'All clear!'}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Est. vs Actual Hours</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-300">{totalActHours}h <span className="text-xs font-normal text-slate-400">/ {totalEstHours}h</span></p>
          <p className="text-[11px] text-slate-400">Time tracked on tasks</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Productivity Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{Math.min(100, Math.round(completionRate * 1.1))}/100</p>
          <p className="text-[11px] text-slate-400">Based on sprint velocity</p>
        </div>
      </div>

      {/* Grid: Priority Distribution & Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" /> Priority Distribution
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Urgent', count: priorityBreakdown.Urgent, color: 'bg-rose-500', text: 'text-rose-400' },
              { label: 'High', count: priorityBreakdown.High, color: 'bg-amber-500', text: 'text-amber-400' },
              { label: 'Medium', count: priorityBreakdown.Medium, color: 'bg-indigo-500', text: 'text-indigo-400' },
              { label: 'Low', count: priorityBreakdown.Low, color: 'bg-emerald-500', text: 'text-emerald-400' }
            ].map(p => {
              const pct = totalTasks > 0 ? Math.round((p.count / totalTasks) * 100) : 0;
              return (
                <div key={p.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={p.text}>{p.label}</span>
                    <span className="text-slate-400">{p.count} tasks ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`${p.color} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" /> Category Breakdown
          </h3>
          <div className="space-y-3">
            {categoryBreakdown.map(cat => {
              const pct = cat.count > 0 ? Math.round((cat.completed / cat.count) * 100) : 0;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                      {cat.name}
                    </span>
                    <span className="text-slate-400">{cat.completed}/{cat.count} completed</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" /> Recent Activity Log
        </h3>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-xs text-slate-500">No recent activity logged yet.</p>
          ) : (
            recentActivity.map(log => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
                <span className="text-slate-300 font-medium">{log.details}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
