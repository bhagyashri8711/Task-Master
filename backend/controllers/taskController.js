const db = require('../config/db');

// Helper to log user activity
const logActivity = (action, details, userId) => {
  db.insert('activityLogs', {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    action,
    details,
    userId,
    timestamp: new Date().toISOString()
  });
};

// Get All Tasks for logged-in user with filters
const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, priority, categoryId, search, sortBy, sortOrder } = req.query;

    let tasks = db.find('tasks', t => t.userId === userId);

    // Filter by Status
    if (status && status !== 'all') {
      tasks = tasks.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by Priority
    if (priority && priority !== 'all') {
      tasks = tasks.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
    }

    // Filter by Category
    if (categoryId && categoryId !== 'all') {
      tasks = tasks.filter(t => t.categoryId === categoryId);
    }

    // Search term in title, description, or tags
    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    // Sort tasks
    const order = sortOrder === 'asc' ? 1 : -1;
    tasks.sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return (new Date(a.dueDate) - new Date(b.dueDate)) * order;
      }
      if (sortBy === 'priority') {
        const pMap = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return ((pMap[b.priority] || 0) - (pMap[a.priority] || 0)) * order;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title) * order;
      }
      // Default sort by createdAt descending
      return (new Date(b.createdAt) - new Date(a.createdAt)) * order;
    });

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Task by ID
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = db.findOne('tasks', t => t.id === id && t.userId === req.user.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// Create New Task
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, categoryId, dueDate, dueTime, estimatedHours, tags, subtasks } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }

    const taskId = `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newTask = {
      id: taskId,
      title: title.trim(),
      description: description || '',
      status: status || 'To Do',
      priority: priority || 'Medium',
      categoryId: categoryId || 'cat_work',
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : 0,
      actualHours: 0,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      subtasks: Array.isArray(subtasks) ? subtasks.map(s => ({
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        title: typeof s === 'string' ? s : s.title,
        completed: s.completed || false
      })) : [],
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.insert('tasks', newTask);
    logActivity('CREATE_TASK', `Created task "${newTask.title}"`, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task: newTask
    });
  } catch (error) {
    next(error);
  }
};

// Update Task
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = db.findOne('tasks', t => t.id === id && t.userId === req.user.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or access denied.' });
    }

    const { title, description, status, priority, categoryId, dueDate, dueTime, estimatedHours, actualHours, tags, subtasks } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) updateFields.status = status;
    if (priority !== undefined) updateFields.priority = priority;
    if (categoryId !== undefined) updateFields.categoryId = categoryId;
    if (dueDate !== undefined) updateFields.dueDate = dueDate;
    if (dueTime !== undefined) updateFields.dueTime = dueTime;
    if (estimatedHours !== undefined) updateFields.estimatedHours = parseFloat(estimatedHours);
    if (actualHours !== undefined) updateFields.actualHours = parseFloat(actualHours);
    if (tags !== undefined) updateFields.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    if (subtasks !== undefined) updateFields.subtasks = subtasks;

    const updatedTask = db.update('tasks', t => t.id === id, updateFields);

    if (status && status !== task.status) {
      logActivity('UPDATE_STATUS', `Changed status of "${updatedTask.title}" to ${status}`, req.user.id);
    } else {
      logActivity('UPDATE_TASK', `Updated task "${updatedTask.title}"`, req.user.id);
    }

    res.json({
      success: true,
      message: 'Task updated successfully!',
      task: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// Toggle Subtask Completion
const toggleSubtask = async (req, res, next) => {
  try {
    const { taskId, subtaskId } = req.params;
    const task = db.findOne('tasks', t => t.id === taskId && t.userId === req.user.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const updatedSubtasks = (task.subtasks || []).map(st => {
      if (st.id === subtaskId) {
        return { ...st, completed: !st.completed };
      }
      return st;
    });

    const updatedTask = db.update('tasks', t => t.id === taskId, { subtasks: updatedSubtasks });

    res.json({
      success: true,
      task: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// Delete Task
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = db.findOne('tasks', t => t.id === id && t.userId === req.user.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    db.remove('tasks', t => t.id === id);
    logActivity('DELETE_TASK', `Deleted task "${task.title}"`, req.user.id);

    res.json({
      success: true,
      message: 'Task deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
};

// Bulk Operations (Update Status / Delete)
const bulkOperation = async (req, res, next) => {
  try {
    const { taskIds, action, status, priority } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No task IDs provided.' });
    }

    if (action === 'delete') {
      db.remove('tasks', t => t.userId === userId && taskIds.includes(t.id));
      logActivity('BULK_DELETE', `Deleted ${taskIds.length} tasks`, userId);
      return res.json({ success: true, message: `Successfully deleted ${taskIds.length} tasks.` });
    }

    if (action === 'updateStatus' && status) {
      taskIds.forEach(id => {
        db.update('tasks', t => t.id === id && t.userId === userId, { status });
      });
      logActivity('BULK_UPDATE_STATUS', `Updated status to "${status}" for ${taskIds.length} tasks`, userId);
      return res.json({ success: true, message: `Updated status for ${taskIds.length} tasks.` });
    }

    if (action === 'updatePriority' && priority) {
      taskIds.forEach(id => {
        db.update('tasks', t => t.id === id && t.userId === userId, { priority });
      });
      logActivity('BULK_UPDATE_PRIORITY', `Updated priority to "${priority}" for ${taskIds.length} tasks`, userId);
      return res.json({ success: true, message: `Updated priority for ${taskIds.length} tasks.` });
    }

    res.status(400).json({ success: false, message: 'Invalid bulk action requested.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleSubtask,
  deleteTask,
  bulkOperation
};
