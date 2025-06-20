import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil } from 'lucide-react';
import type { Todo } from '@/types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
        />
        <div className={todo.completed ? 'line-through text-gray-400' : ''}>
          <div className="font-semibold">{todo.title}</div>
          {todo.description && (
            <div className="text-sm text-gray-600">{todo.description}</div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="icon" variant="outline" onClick={() => onEdit(todo)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="destructive" onClick={() => onDelete(todo.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
