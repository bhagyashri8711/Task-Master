const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleSubtask,
  deleteTask,
  bulkOperation
} = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', getTasks);
router.post('/', createTask);
router.post('/bulk', bulkOperation);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:taskId/subtasks/:subtaskId', toggleSubtask);

module.exports = router;
