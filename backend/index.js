const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { seedInitialData } = require('./utils/seedData');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Seed initial demo data on startup
seedInitialData();

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Task Management Central API',
    time: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve static frontend files if built
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendBuildPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Task Management Backend API is running. Frontend dev server is available on port 5173.');
    }
  });
});

// Central Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Task Management Server listening on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});
