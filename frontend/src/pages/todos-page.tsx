import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import type { Todo } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TodoForm } from '@/components/todos/todo-form';
import { TodoList } from '@/components/todos/todo-list';

export default function TodosPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);

  const [projectName, setProjectName] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    // Load project name
    axios
      .get(`http://localhost:5000/api/projects/${projectId}`)
      .then((res) => setProjectName(res.data.name))
      .catch((err) => {
        console.error('❌ Failed to load project:', err);
        setProjectName(`Project #${projectId}`);
      });

    // Load todos
    axios
      .get(`http://localhost:5000/api/todos/project/${projectId}`)
      .then((res) => setTodos(res.data))
      .catch((err) => console.error('❌ Failed to load todos:', err));
  }, [projectId]);

  const handleAddOrUpdate = async (todo: Partial<Todo>) => {
    try {
      if (todo.id) {
        // Update existing todo, including priority
        const res = await axios.put(`http://localhost:5000/api/todos/${todo.id}`, {
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          priority: todo.priority, // <-- Important to add this here!
        });
        setTodos((prev) =>
          prev.map((t) => (t.id === todo.id ? res.data : t))
        );
      } else {
        // Create new todo, including priority with default
        const res = await axios.post(`http://localhost:5000/api/todos`, {
          title: todo.title,
          description: todo.description,
          project_id: projectId,
          priority: todo.priority || 'Medium',
        });
        setTodos((prev) => [res.data, ...prev]);
      }

      setIsFormOpen(false);
      setEditingTodo(null);
    } catch (error) {
      console.error('❌ Error saving todo:', error);
    }
  };

  const handleToggle = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? res.data : t))
      );
    } catch (error) {
      console.error('❌ Error toggling todo:', error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('❌ Error deleting todo:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Todos for Project: {projectName || `#${projectId}`}
        </h1>
        <Button onClick={() => setIsFormOpen(true)} className="flex gap-2">
          <Plus className="h-4 w-4" />
          New Todo
        </Button>
      </div>

      {isFormOpen && (
        <TodoForm
          onSubmit={handleAddOrUpdate}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingTodo(null);
          }}
          editingTodo={editingTodo}
        />
      )}

      <div className="mt-6">
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
