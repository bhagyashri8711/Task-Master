import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Clock, Tag, CheckSquare } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const TaskModal = () => {
  const { taskModalState, closeModal, createTask, updateTask, categories } = useTasks();

  const { isOpen, mode, task } = taskModalState;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setCategoryId(task.categoryId || (categories[0]?.id || 'cat_work'));
        setPriority(task.priority || 'Medium');
        setStatus(task.status || 'To Do');
        setDueDate(task.dueDate || '');
        setDueTime(task.dueTime || '');
        setEstimatedHours(task.estimatedHours ? String(task.estimatedHours) : '');
        setTagsInput(task.tags ? task.tags.join(', ') : '');
        setSubtasks(task.subtasks || []);
      } else {
        // Reset form for Create
        setTitle('');
        setDescription('');
        setCategoryId(categories[0]?.id || 'cat_work');
        setPriority('Medium');
        setStatus('To Do');
        setDueDate(new Date().toISOString().split('T')[0]);
        setDueTime('17:00');
        setEstimatedHours('2');
        setTagsInput('');
        setSubtasks([]);
      }
      setNewSubtaskTitle('');
    }
  }, [isOpen, mode, task, categories]);

  if (!isOpen) return null;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks(prev => [
      ...prev,
      { id: `sub_${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      description,
      categoryId,
      priority,
      status,
      dueDate,
      dueTime,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : 0,
      tags: tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [],
      subtasks
    };

    if (mode === 'edit' && task) {
      await updateTask(task.id, payload);
    } else {
      await createTask(payload);
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">
            {mode === 'edit' ? 'Edit Task Details' : 'Create New Task'}
          </h2>
          <button
            onClick={closeModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {/* Title */}
          <div>
            <label className="block text-slate-400 mb-1.5">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Finalize UI Component Specs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 mb-1.5">Description & Notes</label>
            <textarea
              rows={3}
              placeholder="Add key context, requirements, or links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1.5">Category / Project</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Urgent">🔴 Urgent</option>
                <option value="High">🟠 High</option>
                <option value="Medium">🔵 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>
          </div>

          {/* Status & Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5">Estimated Hours</label>
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="e.g. 3.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5">Time</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-slate-400 mb-1.5">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., Design, API, Frontend"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Subtasks Builder */}
          <div>
            <label className="block text-slate-400 mb-1.5">Subtasks Checklist</label>
            <div className="space-y-2">
              {subtasks.map(st => (
                <div key={st.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs"
            >
              {mode === 'edit' ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
