import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Active View: 'list' | 'kanban' | 'calendar' | 'analytics' | 'pomodoro'
  const [activeView, setActiveView] = useState('kanban');

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    categoryId: 'all',
    search: '',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });

  // Modal State
  const [taskModalState, setTaskModalState] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    task: null
  });

  // Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.getTasks(filters);
      setTasks(res.tasks || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  const fetchCategories = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.getCategories();
      setCategories(res.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, [user]);

  const fetchAnalytics = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.getAnalytics();
      setAnalytics(res.stats);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchCategories();
      fetchAnalytics();
    } else {
      setTasks([]);
      setCategories([]);
      setAnalytics(null);
    }
  }, [user, fetchTasks, fetchCategories, fetchAnalytics]);

  // Task Actions
  const createTask = async (taskData) => {
    try {
      const res = await api.createTask(taskData);
      setTasks(prev => [res.task, ...prev]);
      fetchAnalytics();
      showToast('Task created successfully!', 'success');
      return res.task;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const res = await api.updateTask(id, taskData);
      setTasks(prev => prev.map(t => t.id === id ? res.task : t));
      
      if (taskData.status === 'Completed') {
        triggerConfetti();
      }

      fetchAnalytics();
      showToast('Task updated successfully!', 'success');
      return res.task;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    return updateTask(id, { status: newStatus });
  };

  const deleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      fetchAnalytics();
      showToast('Task deleted.', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    try {
      const res = await api.toggleSubtask(taskId, subtaskId);
      setTasks(prev => prev.map(t => t.id === taskId ? res.task : t));
      fetchAnalytics();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const createCategory = async (catData) => {
    try {
      const res = await api.createCategory(catData);
      setCategories(prev => [...prev, res.category]);
      showToast('Category created!', 'success');
      return res.category;
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openCreateModal = () => {
    setTaskModalState({ isOpen: true, mode: 'create', task: null });
  };

  const openEditModal = (task) => {
    setTaskModalState({ isOpen: true, mode: 'edit', task });
  };

  const closeModal = () => {
    setTaskModalState({ isOpen: false, mode: 'create', task: null });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        analytics,
        loading,
        activeView,
        setActiveView,
        filters,
        setFilters,
        taskModalState,
        openCreateModal,
        openEditModal,
        closeModal,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        toggleSubtask,
        createCategory,
        fetchTasks,
        fetchAnalytics,
        toast,
        showToast
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
