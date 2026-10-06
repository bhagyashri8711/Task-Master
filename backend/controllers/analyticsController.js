const db = require('../config/db');

const getDashboardAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tasks = db.find('tasks', t => t.userId === userId);
    const categories = db.find('categories', c => c.userId === userId);
    const logs = db.find('activityLogs', l => l.userId === userId).slice(-10).reverse();

    const todayStr = new Date().toISOString().split('T')[0];

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const toDoTasks = tasks.filter(t => t.status === 'To Do').length;

    // Overdue tasks: due date before today and not completed
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.status === 'Completed') return false;
      return t.dueDate < todayStr;
    }).length;

    // Due Today tasks
    const dueTodayTasks = tasks.filter(t => t.dueDate === todayStr && t.status !== 'Completed').length;

    // Priority breakdown
    const priorityBreakdown = {
      Urgent: tasks.filter(t => t.priority === 'Urgent').length,
      High: tasks.filter(t => t.priority === 'High').length,
      Medium: tasks.filter(t => t.priority === 'Medium').length,
      Low: tasks.filter(t => t.priority === 'Low').length
    };

    // Category breakdown
    const categoryMap = {};
    categories.forEach(c => { categoryMap[c.id] = c.name; });

    const categoryBreakdown = categories.map(c => {
      const catTasks = tasks.filter(t => t.categoryId === c.id);
      return {
        id: c.id,
        name: c.name,
        color: c.color,
        count: catTasks.length,
        completed: catTasks.filter(t => t.status === 'Completed').length
      };
    });

    // Completion Rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Total estimated vs actual hours
    const totalEstHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const totalActHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

    res.json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        toDoTasks,
        overdueTasks,
        dueTodayTasks,
        completionRate,
        totalEstHours,
        totalActHours,
        priorityBreakdown,
        categoryBreakdown,
        recentActivity: logs
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardAnalytics };
