import express from 'express';
import {
  getTodosByProjectId,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from '../controllers/todoController';
import { authMiddleware } from '../middleware/authMiddleware'; // Add this import

const router = express.Router();

// Protect all routes with authMiddleware
router.use(authMiddleware);

router.get('/project/:projectId', getTodosByProjectId);
router.get('/:id', getTodoById);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;