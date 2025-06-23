import { Request, Response } from 'express';
import pool from '../config/database';
import { CreateTodoRequest, UpdateTodoRequest } from '../types';

export const getTodosByProjectId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const result = await pool.query(
      'SELECT * FROM todos WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, project_id, priority }: CreateTodoRequest = req.body;

    if (!title) {
      res.status(400).json({ error: 'Todo title is required' });
      return;
    }

    if (!project_id) {
      res.status(400).json({ error: 'Project ID is required' });
      return;
    }

    // Verify project exists
    const projectCheck = await pool.query('SELECT id FROM projects WHERE id = $1', [project_id]);
    if (projectCheck.rows.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Default priority to 'Medium' if not provided
    const priorityValue = priority || 'Medium';

    const result = await pool.query(
      'INSERT INTO todos (title, description, project_id, priority) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, project_id, priorityValue]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority }: UpdateTodoRequest = req.body;

    const result = await pool.query(
      `UPDATE todos
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           completed = COALESCE($3, completed),
           priority = COALESCE($4, priority),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [title, description, completed, priority, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
