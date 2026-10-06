const bcrypt = require('bcryptjs');
const db = require('../config/db');

const seedInitialData = async () => {
  const users = db.get('users');
  
  // Seed demo user if no users exist
  if (users.length === 0) {
    console.log('Seeding initial demo data...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUserId = 'usr_demo_001';

    const demoUser = {
      id: demoUserId,
      name: 'Sarah Jenkins',
      email: 'demo@taskmaster.com',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: 'Project Lead',
      bio: 'Managing cross-functional engineering & design teams.',
      createdAt: new Date().toISOString()
    };

    db.insert('users', demoUser);

    // Initial Categories
    const categories = [
      { id: 'cat_work', name: 'Work Projects', color: '#6366f1', icon: 'Briefcase', userId: demoUserId },
      { id: 'cat_personal', name: 'Personal Growth', color: '#10b981', icon: 'User', userId: demoUserId },
      { id: 'cat_design', name: 'UI/UX Design', color: '#ec4899', icon: 'Palette', userId: demoUserId },
      { id: 'cat_health', name: 'Health & Fitness', color: '#f59e0b', icon: 'Heart', userId: demoUserId }
    ];

    categories.forEach(cat => db.insert('categories', cat));

    // Current date helpers
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const tomorrow = new Date(now.getTime() + 86400000).toISOString().split('T')[0];
    const in3Days = new Date(now.getTime() + 86400000 * 3).toISOString().split('T')[0];
    const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];

    // Initial Tasks
    const tasks = [
      {
        id: 'tsk_1',
        title: 'Design System Documentation',
        description: 'Update color palette tokens, typography scales, and component guidelines for the v2 release.',
        status: 'In Progress',
        priority: 'High',
        categoryId: 'cat_design',
        dueDate: tomorrow,
        dueTime: '15:00',
        estimatedHours: 4,
        actualHours: 2.5,
        tags: ['Design', 'Docs', 'v2.0'],
        subtasks: [
          { id: 'sub_1_1', title: 'Audit current Figma tokens', completed: true },
          { id: 'sub_1_2', title: 'Create dark mode color variables', completed: true },
          { id: 'sub_1_3', title: 'Export CSS variables file', completed: false }
        ],
        userId: demoUserId,
        createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'tsk_2',
        title: 'Backend API Authentication Migration',
        description: 'Refactor JWT auth middleware to support refresh tokens and rate limiting for security compliance.',
        status: 'To Do',
        priority: 'Urgent',
        categoryId: 'cat_work',
        dueDate: today,
        dueTime: '18:00',
        estimatedHours: 6,
        actualHours: 0,
        tags: ['Security', 'NodeJS', 'API'],
        subtasks: [
          { id: 'sub_2_1', title: 'Setup JWT refresh token route', completed: false },
          { id: 'sub_2_2', title: 'Implement rate-limiting middleware', completed: false },
          { id: 'sub_2_3', title: 'Write unit tests for auth flow', completed: false }
        ],
        userId: demoUserId,
        createdAt: new Date(now.getTime() - 86400000 * 3).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'tsk_3',
        title: 'Weekly Team Sync & Sprint Planning',
        description: 'Prepare sprint backlog items, review velocity metrics, and assign engineering tickets.',
        status: 'Completed',
        priority: 'Medium',
        categoryId: 'cat_work',
        dueDate: yesterday,
        dueTime: '10:00',
        estimatedHours: 1.5,
        actualHours: 1.5,
        tags: ['Agile', 'Meeting'],
        subtasks: [
          { id: 'sub_3_1', title: 'Gather weekly status reports', completed: true },
          { id: 'sub_3_2', title: 'Update Jira board tickets', completed: true }
        ],
        userId: demoUserId,
        createdAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
        updatedAt: new Date(now.getTime() - 86400000).toISOString()
      },
      {
        id: 'tsk_4',
        title: 'Read "Atomic Habits" - Chapter 4 & 5',
        description: 'Focus on identity-based habit formation and environment design strategies.',
        status: 'In Progress',
        priority: 'Low',
        categoryId: 'cat_personal',
        dueDate: in3Days,
        dueTime: '21:00',
        estimatedHours: 2,
        actualHours: 1,
        tags: ['Reading', 'Self-Growth'],
        subtasks: [
          { id: 'sub_4_1', title: 'Read Chapter 4', completed: true },
          { id: 'sub_4_2', title: 'Take bullet notes on environment cues', completed: false }
        ],
        userId: demoUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'tsk_5',
        title: '30-Minute High-Intensity Interval Workout',
        description: 'Cardio endurance training session focused on core and leg strength.',
        status: 'To Do',
        priority: 'Medium',
        categoryId: 'cat_health',
        dueDate: today,
        dueTime: '19:30',
        estimatedHours: 0.75,
        actualHours: 0,
        tags: ['Fitness', 'Cardio'],
        subtasks: [],
        userId: demoUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    tasks.forEach(t => db.insert('tasks', t));

    // Initial Activity Logs
    const logs = [
      { id: 'log_1', action: 'CREATE_TASK', details: 'Created task "Backend API Authentication Migration"', userId: demoUserId, timestamp: new Date(now.getTime() - 86400000 * 3).toISOString() },
      { id: 'log_2', action: 'UPDATE_STATUS', details: 'Marked "Weekly Team Sync" as Completed', userId: demoUserId, timestamp: new Date(now.getTime() - 86400000).toISOString() },
      { id: 'log_3', action: 'UPDATE_TASK', details: 'Updated subtasks for "Design System Documentation"', userId: demoUserId, timestamp: new Date().toISOString() }
    ];

    logs.forEach(l => db.insert('activityLogs', l));

    console.log('Seed data successfully created!');
  }
};

module.exports = { seedInitialData };
