# 🛡️ TaskMaster Pro - Centralized Task Management Application

A full-stack, enterprise-grade Task Management Application built to replace traditional notebooks, fragmented spreadsheets, and basic reminder tools with a single centralized platform.

---

## 🌟 Key Features

### 1. 🔐 Secure User Authentication & Profile Management
- **JWT Bearer Token Authentication**: Multi-user data isolation with password hashing using `bcryptjs`.
- **Demo Fast Pass**: 1-click instant login mode (`demo@taskmaster.com`) pre-configured with sample tasks across work, personal, design, and health projects.
- **User Profiles**: Custom avatars, bio, and roles.

### 2. 📋 Comprehensive Task Management
- **Multiple Views**:
  - 🎨 **Kanban Board**: Drag-and-drop workflow across `To Do`, `In Progress`, and `Completed` columns with visual column counts and column highlight states.
  - 📝 **Task List**: Dense list view with expandable subtask checklists, priority badges, and inline status dropdowns.
  - 📅 **Calendar View**: Monthly interactive grid displaying tasks on due dates with date navigation and quick-add controls.
  - 📊 **Analytics & Reports**: Real-time velocity metrics, completion rate gauges, priority distribution, category breakdown, estimated vs actual hours, and activity logs.
  - ⏱️ **Focus Pomodoro Timer**: Integrated timer with work (25m), short break (5m), and long break (15m) sessions, task time tracking, and streak counters.
- **Task Attributes**: Title, Description, Priority (`Urgent`, `High`, `Medium`, `Low`), Status, Category/Project, Due Date & Time, Estimated & Actual Hours, Tags, Subtasks/Checklists.

### 3. ⚡ Productivity & Dynamic Updates
- **Filtering & Search**: Global search across titles, descriptions, and tags; status filtering; priority filtering; category filtering; and sorting (Due Date, Priority, Title, Date Created).
- **Celebrations & Alerts**: Confetti completion animations, toast notifications, overdue alert pills, and due-today warnings.

---

## 📁 Directory Structure

```
Task management/
├── package.json
├── server/
│   ├── config/
│   │   └── db.js                 # Atomic JSON database with SQLite-style API
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile management
│   │   ├── taskController.js     # Task CRUD, status updates, subtasks, bulk ops
│   │   ├── categoryController.js # Custom project/category management
│   │   └── analyticsController.js# Dashboard statistics, completion rates, logs
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification middleware
│   │   └── errorHandler.js       # Centralized error handler
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── taskRoutes.js         # /api/tasks routes
│   │   ├── categoryRoutes.js     # /api/categories routes
│   │   └── analyticsRoutes.js    # /api/analytics routes
│   ├── utils/
│   │   ├── jwt.js                # Token sign & verification
│   │   └── seedData.js           # Pre-populated demo user, tasks & activity logs
│   └── index.js                  # Express API server entry point
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js            # Vite config with API proxy (/api -> :5000)
│   └── src/
│       ├── main.jsx              # React DOM entry point
│       ├── App.jsx               # App layout & view switcher
│       ├── index.css             # Design tokens, glassmorphism & animations
│       ├── components/
│       │   ├── Navbar.jsx        # Brand logo, global search, profile dropdown
│       │   ├── Sidebar.jsx       # View navigation, category filter, productivity widget
│       │   ├── TaskCard.jsx      # Reusable task card with subtasks & inline status
│       │   ├── TaskList.jsx      # Dense list view
│       │   ├── KanbanBoard.jsx   # Drag and drop Kanban column board
│       │   ├── CalendarView.jsx  # Monthly calendar grid with task pills
│       │   ├── AnalyticsView.jsx # Productivity charts & recent activity timeline
│       │   ├── PomodoroTimer.jsx # Focus timer with task attachment
│       │   ├── FilterBar.jsx     # Status, priority & sorting control bar
│       │   ├── TaskModal.jsx     # Create/Edit task modal dialog
│       │   ├── AuthModal.jsx     # Sign in / Register modal dialog
│       │   └── Toast.jsx         # Toast notification component
│       ├── context/
│       │   ├── AuthContext.jsx   # Global user state & auth handlers
│       │   └── TaskContext.jsx   # Global tasks, categories, & active view state
│       ├── services/
│       │   └── api.js            # REST API client service layer
│       └── utils/
│           └── dateUtils.js      # Date formatting & overdue status helper
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Running Locally

1. **Install Root Dependencies**:
   ```bash
   npm install
   ```

2. **Install Client Dependencies**:
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Start Development Environment (Runs Backend API + Client Dev Server)**:
   ```bash
   npm run dev
   ```
   - **Client App**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000/api`

4. **Production Build & Run**:
   ```bash
   npm run build
   npm start
   ```
   - Access the single-port production server at `http://localhost:5000`

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in user and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user details | Yes |
| `PUT` | `/api/auth/profile` | Update profile information | Yes |
| `GET` | `/api/tasks` | Get filtered & sorted task list | Yes |
| `POST` | `/api/tasks` | Create a new task | Yes |
| `PUT` | `/api/tasks/:id` | Update an existing task | Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes |
| `PATCH` | `/api/tasks/:id/subtasks/:subId` | Toggle subtask completion status | Yes |
| `POST` | `/api/tasks/bulk` | Bulk delete or update status/priority | Yes |
| `GET` | `/api/categories` | Get user categories | Yes |
| `POST` | `/api/categories` | Create custom category | Yes |
| `GET` | `/api/analytics/dashboard` | Fetch dashboard analytics & metrics | Yes |
