// src/components/todos/todos-page.tsx

import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import FocusTrap from 'focus-trap-react';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { setTodos, addTodo, updateTodo, deleteTodo } from '@/components/todos/todoSlice';

import type { Todo } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TodoForm } from '@/components/todos/todo-form';
import { TodoList } from '@/components/todos/todo-list';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerBody,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { todosApiService } from '@/api/todos.api.service';

export default function TodosPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);

  const dispatch: AppDispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);

  const [projectName, setProjectName] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSetSearchTerm(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const [projectRes, todosRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/projects/${projectId}`),
          todosApiService.getByProject(projectId),
        ]);

        setProjectName(projectRes.data.name);
        dispatch(setTodos(todosRes));
        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to load data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [projectId, dispatch, debouncedSetSearchTerm]);

  const handleAddOrUpdate = async (todo: Partial<Todo>) => {
    try {
      let result: Todo;

      if (todo.id) {
        result = await todosApiService.update(todo.id, todo);
        dispatch(updateTodo(result));
      } else {
        result = await todosApiService.create({ ...todo, project_id: projectId });
        dispatch(addTodo(result));
      }

      setIsFormOpen(false);
      setEditingTodo(null);
    } catch (err) {
      console.error('❌ Error saving todo:', err);
    }
  };

  const handleToggle = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const updated = await todosApiService.update(id, { completed: !todo.completed });
      dispatch(updateTodo(updated));
    } catch (err) {
      console.error('❌ Error toggling todo:', err);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await todosApiService.remove(id);
      dispatch(deleteTodo(id));
    } catch (err) {
      console.error('❌ Error deleting todo:', err);
    }
  };

  // Priority order with string keys
  const priorityOrder: Record<string, number> = { High: 1, Medium: 2, Low: 3 };

  // Sort todos safely by priority with fallback to 'Low'
  const sortedTodos = Array.isArray(todos)
    ? todos.slice().sort((a, b) => {
        const aPriority = a.priority && priorityOrder[a.priority] ? a.priority : 'Low';
        const bPriority = b.priority && priorityOrder[b.priority] ? b.priority : 'Low';
        return priorityOrder[aPriority] - priorityOrder[bPriority];
      })
    : [];

  // Filter todos by debounced search term (case-insensitive)
  const filteredTodos = sortedTodos.filter((todo) =>
    todo.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    (todo.description?.toLowerCase() ?? '').includes(debouncedSearchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className={`container mx-auto px-4 py-8 ${isFormOpen ? 'pointer-events-none select-none' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Todos for Project: {projectName || `#${projectId}`}
        </h1>
        <Button onClick={() => { setIsFormOpen(true); setEditingTodo(null); }} className="flex gap-2">
          <Plus className="h-4 w-4" />
          New Todo
        </Button>
      </div>

      <Input
        type="text"
        placeholder="Search by title or description..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 w-full max-w-md"
        aria-label="Search todos"
      />

      <div className="mt-6">
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Drawer open={isFormOpen} onOpenChange={setIsFormOpen} modal={true}>
        <FocusTrap active={isFormOpen}>
          <DrawerContent position="right" className="max-w-md" tabIndex={-1}>
            <DrawerHeader>
              <DrawerTitle>{editingTodo ? 'Edit Todo' : 'New Todo'}</DrawerTitle>
              <DrawerClose />
            </DrawerHeader>
            <DrawerBody>
              <TodoForm
                editingTodo={editingTodo}
                onSubmit={handleAddOrUpdate}
                onCancel={() => setIsFormOpen(false)}
              />
            </DrawerBody>
          </DrawerContent>
        </FocusTrap>
      </Drawer>
    </div>
  );
}
