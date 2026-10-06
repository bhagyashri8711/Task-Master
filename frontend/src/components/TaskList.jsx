import React from 'react';
import { TaskCard } from './TaskCard';
import { useTasks } from '../context/TaskContext';
import { Plus, CheckCircle2 } from 'lucide-react';

export const TaskList = () => {
  const { tasks, loading, openCreateModal } = useTasks();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-44 bg-slate-800/50 rounded-2xl border border-slate-800"></div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-3xl border border-slate-800/80 my-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-1">No tasks found</h3>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          You have no tasks matching your current search or filters. Create a new task to get started!
        </p>
        <button
          onClick={openCreateModal}
          className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add New Task</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
