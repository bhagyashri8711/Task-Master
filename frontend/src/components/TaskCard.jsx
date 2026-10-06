import React, { useState } from 'react';
import { Calendar, Clock, CheckSquare, Trash2, Edit3, AlertCircle, Tag, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { formatDate, getDueDateStatus } from '../utils/dateUtils';

export const TaskCard = ({ task }) => {
  const { categories, openEditModal, deleteTask, updateTaskStatus, toggleSubtask, setActiveView } = useTasks();
  const [showSubtasks, setShowSubtasks] = useState(false);

  const category = categories.find(c => c.id === task.categoryId);
  const dueStatus = getDueDateStatus(task.dueDate, task.status);

  const priorityStyles = {
    Urgent: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    High: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Medium: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    Low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
  };

  const statusColors = {
    'To Do': 'bg-slate-700/60 text-slate-300',
    'In Progress': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    'Completed': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  };

  const subtasksCount = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter(s => s.completed)?.length || 0;
  const subtaskProgress = subtasksCount > 0 ? Math.round((completedSubtasks / subtasksCount) * 100) : 0;

  const isCompleted = task.status === 'Completed';

  return (
    <div className={`group glass-panel rounded-2xl p-4 transition-all duration-200 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 relative flex flex-col justify-between ${
      isCompleted ? 'opacity-75 bg-slate-900/40' : ''
    }`}>
      {/* Header: Category & Priority Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {category && (
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1.5"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
                border: `1px solid ${category.color}40`
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }}></span>
              {category.name}
            </span>
          )}
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${priorityStyles[task.priority] || priorityStyles.Medium}`}>
            {task.priority}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setActiveView('pomodoro')}
            title="Focus Timer"
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openEditModal(task)}
            title="Edit Task"
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            title="Delete Task"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body: Title & Description */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-start gap-2.5">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => updateTaskStatus(task.id, e.target.checked ? 'Completed' : 'In Progress')}
            className="mt-1 w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer accent-indigo-600 shrink-0"
          />
          <h3 className={`text-sm font-bold text-slate-100 leading-snug ${isCompleted ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h3>
        </div>
        {task.description && (
          <p className="text-xs text-slate-400 line-clamp-2 pl-6 font-normal">
            {task.description}
          </p>
        )}
      </div>

      {/* Subtasks Progress Bar & Expand */}
      {subtasksCount > 0 && (
        <div className="mb-3 pl-6 pr-1 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <button
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
            >
              <CheckSquare className="w-3 h-3 text-indigo-400" />
              <span>{completedSubtasks}/{subtasksCount} Subtasks</span>
              {showSubtasks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <span>{subtaskProgress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${subtaskProgress}%` }}
            ></div>
          </div>

          {/* Subtask Checklist Details */}
          {showSubtasks && (
            <div className="mt-2 space-y-1.5 pt-1 animate-fade-in">
              {task.subtasks.map(st => (
                <div key={st.id} className="flex items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => toggleSubtask(task.id, st.id)}
                    className="w-3.5 h-3.5 rounded border-slate-700 text-indigo-600 accent-indigo-600 cursor-pointer"
                  />
                  <span className={st.completed ? 'line-through text-slate-500' : ''}>{st.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 pl-6">
          {task.tags.map((tag, i) => (
            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50 flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Meta: Status Dropdown, Due Date, Hours */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-medium">
        {/* Status Dropdown */}
        <select
          value={task.status}
          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer transition-colors ${
            statusColors[task.status] || 'bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          <option value="To Do" className="bg-slate-900 text-slate-200">To Do</option>
          <option value="In Progress" className="bg-slate-900 text-slate-200">In Progress</option>
          <option value="Completed" className="bg-slate-900 text-slate-200">Completed</option>
        </select>

        {/* Due Date & Hours */}
        <div className="flex items-center gap-3">
          {task.estimatedHours > 0 && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1" title="Estimated Hours">
              <Clock className="w-3 h-3 text-slate-500" />
              {task.estimatedHours}h
            </span>
          )}

          {task.dueDate && (
            <span
              className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md ${
                dueStatus === 'overdue'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : dueStatus === 'today'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400'
              }`}
            >
              <Calendar className="w-3 h-3" />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
