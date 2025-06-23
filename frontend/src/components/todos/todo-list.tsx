import type { Todo } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../ui/table';
import { Check, Pencil, Trash2 } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export function TodoList({ todos, onToggle, onEdit, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400">No todos yet.</div>;
  }

  // Optional: Style priority with colors
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-500 font-semibold';
      case 'Medium':
        return 'text-yellow-500 font-medium';
      case 'Low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Done</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead className="text-right w-[120px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos.map((todo) => (
          <TableRow key={todo.id}>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggle(todo.id)}
                aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
              >
                {todo.completed ? (
                  <Check className="text-green-500" />
                ) : (
                  <Check className="opacity-30" />
                )}
              </Button>
            </TableCell>

            <TableCell className={todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}>
              {todo.title}
            </TableCell>

            <TableCell className={todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}>
              {todo.description}
            </TableCell>

            <TableCell className={getPriorityColor(todo.priority)}>
              {todo.priority || '—'}
            </TableCell>

            <TableCell className="text-right space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(todo)}
                aria-label="Edit todo"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(todo.id)}
                aria-label="Delete todo"
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
