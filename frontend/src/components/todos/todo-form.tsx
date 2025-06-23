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
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium'); // ✅ Add state for priority

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || '');
      setPriority(editingTodo.priority || 'Medium');
    }
  }, [editingTodo]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      id: editingTodo?.id,
      title,
      description,
      priority, // ✅ Include priority
      completed: editingTodo?.completed ?? false,
    });

    setTitle('');
    setDescription('');
    setPriority('Medium');
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

      {/* ✅ Priority Dropdown */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
        className="w-full border p-2 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
      >
        <option value="High">High Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="Low">Low Priority</option>
      </select>

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
