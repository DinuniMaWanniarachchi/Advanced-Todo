import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Todo } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TodoForm } from '@/components/todos/todo-form';
import { TodoList } from '@/components/todos/todo-list';

export default function TodosPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    // Here you could fetch from an API or localStorage
    // For now, initialize empty
    setTodos([]);
  }, [projectId]);

  const handleAddOrUpdate = (todo: Todo) => {
    const newTodo: Todo = {
      ...todo,
      project_id: projectId,
      created_at: todo.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTodos((prev) =>
      prev.some((t) => t.id === newTodo.id)
        ? prev.map((t) => (t.id === newTodo.id ? newTodo : t))
        : [newTodo, ...prev]
    );
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  const handleToggle = (id: number) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Todos for Project #{projectId}</h1>
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
