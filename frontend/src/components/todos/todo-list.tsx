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
  // Handle empty state
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        No todos yet.
      </div>
    );
  }

  // Get color classes for priority levels
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 font-semibold';
      case 'Medium':
        return 'text-yellow-600 font-medium';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="overflow-x-auto">
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
          {todos.map((todo) => {
            const isCompleted = todo.completed;

            return (
              <TableRow key={todo.id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggle(todo.id)}
                    aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    <Check className={isCompleted ? 'text-green-500' : 'opacity-30'} />
                  </Button>
                </TableCell>

                <TableCell
                  className={
                    isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''
                  }
                >
                  {todo.title}
                </TableCell>

                <TableCell
                  className={
                    isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''
                  }
                >
                  {todo.description}
                </TableCell>

                <TableCell className={getPriorityColor(todo.priority)}>
                  {todo.priority || '—'}
                </TableCell>

                <TableCell className="text-right space-x-1">
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
