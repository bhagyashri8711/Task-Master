import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { Plus, Circle, Clock, CheckCircle2 } from 'lucide-react';

export const KanbanBoard = () => {
  const { tasks, updateTaskStatus, openCreateModal } = useTasks();
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  const columns = [
    { id: 'To Do', label: 'To Do', icon: Circle, color: 'border-slate-500 text-slate-400 bg-slate-500/10' },
    { id: 'In Progress', label: 'In Progress', icon: Clock, color: 'border-indigo-500 text-indigo-400 bg-indigo-500/10' },
    { id: 'Completed', label: 'Completed', icon: CheckCircle2, color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10' }
  ];

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedOverColumn !== columnId) {
      setDraggedOverColumn(columnId);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDraggedOverColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      await updateTaskStatus(taskId, targetStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map(col => {
        const Icon = col.icon;
        const columnTasks = tasks.filter(t => t.status === col.id);
        const isDraggedOver = draggedOverColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`p-4 rounded-3xl bg-slate-900/60 border transition-all min-h-[500px] flex flex-col ${
              isDraggedOver ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-slate-800/80 scale-[1.01]' : 'border-slate-800/80'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-lg border ${col.color}`}>
                  <Icon size={16} />
                </span>
                <h3 className="font-bold text-slate-200 text-sm">{col.label}</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {columnTasks.length}
                </span>
              </div>
              <button
                onClick={openCreateModal}
                className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Add task to column"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Task Cards Column */}
            <div className="space-y-4 flex-1">
              {columnTasks.length === 0 ? (
                <div className="h-32 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-xs text-slate-500 font-medium">
                  <span>No {col.label.toLowerCase()} tasks</span>
                  <span className="text-[10px] text-slate-600 mt-1">Drag tasks here</span>
                </div>
              ) : (
                columnTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskCard task={task} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
