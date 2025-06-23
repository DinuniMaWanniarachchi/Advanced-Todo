import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Todo } from '@/types';

interface TodoFormProps {
  onSubmit: (todo: Partial<Todo>) => void;
  onCancel: () => void;
  editingTodo: Todo | null;
}

export function TodoForm({ onSubmit, onCancel, editingTodo }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || '');
    }
  }, [editingTodo]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      id: editingTodo?.id,
      title,
      description,
      completed: editingTodo?.completed ?? false,
    });

    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl bg-white dark:bg-gray-900">
      <Input
        placeholder="Todo title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-black dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400"
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="text-black dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400"
      />
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {editingTodo ? 'Update Todo' : 'Add Todo'}
        </Button>
      </div>
    </div>
  );
}
