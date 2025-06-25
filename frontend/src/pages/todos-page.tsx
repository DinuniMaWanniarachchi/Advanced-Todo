import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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

import FocusTrap from 'focus-trap-react';
import debounce from 'lodash.debounce';

export default function TodosPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);

  const dispatch: AppDispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);

  const [projectName, setProjectName] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search input updates
  // useCallback to avoid recreation on every render
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

    const fetchProject = axios.get(`http://localhost:5000/api/projects/${projectId}`);
    const fetchTodos = axios.get(`http://localhost:5000/api/todos/project/${projectId}`);

    Promise.all([fetchProject, fetchTodos])
      .then(([projectRes, todosRes]) => {
        setProjectName(projectRes.data.name);
        dispatch(setTodos(todosRes.data));
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Failed to load data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      });

    // Cleanup debounce on unmount
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [projectId, dispatch, debouncedSetSearchTerm]);

  const handleAddOrUpdate = async (todo: Partial<Todo>) => {
    try {
      if (todo.id) {
        const res = await axios.put(`http://localhost:5000/api/todos/${todo.id}`, {
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          priority: todo.priority,
        });
        dispatch(updateTodo(res.data));
      } else {
        const res = await axios.post(`http://localhost:5000/api/todos`, {
          title: todo.title,
          description: todo.description,
          project_id: projectId,
          priority: todo.priority || 'Medium',
        });
        dispatch(addTodo(res.data));
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
      dispatch(updateTodo(res.data));
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
      dispatch(deleteTodo(id));
    } catch (error) {
      console.error('❌ Error deleting todo:', error);
    }
  };

  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  const sortedTodos = todos.slice().sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const filteredTodos = sortedTodos.filter(todo =>
    todo.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    (todo.description?.toLowerCase() ?? '').includes(debouncedSearchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  return (
    // Add inert effect by disabling pointer events and select when drawer open
    <div className={`container mx-auto px-4 py-8 ${isFormOpen ? 'pointer-events-none select-none' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Todos for Project: {projectName || `#${projectId}`}
        </h1>
        <Button
          onClick={() => {
            setIsFormOpen(true);
            setEditingTodo(null);
          }}
          className="flex gap-2"
        >
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
