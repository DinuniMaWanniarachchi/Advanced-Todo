import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

export default function TodosPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);

  const dispatch: AppDispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);

  const [projectName, setProjectName] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/projects/${projectId}`)
      .then((res) => setProjectName(res.data.name))
      .catch(() => setProjectName(`Project #${projectId}`));

    axios
      .get(`http://localhost:5000/api/todos/project/${projectId}`)
      .then((res) => dispatch(setTodos(res.data)))
      .catch((err) => console.error('❌ Failed to load todos:', err));
  }, [projectId, dispatch]);

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

  // First sort by priority
  const sortedTodos = todos.slice().sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Then apply search filtering
  const filteredTodos = sortedTodos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (todo.description?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
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

      {/* 🔍 Search Input */}
      <Input
        type="text"
        placeholder="Search todos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full max-w-md"
      />

      {/* 📝 Todo List */}
      <div className="mt-6">
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* 📄 Drawer Form */}
      <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DrawerContent position="right" className="max-w-md">
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
      </Drawer>
    </div>
  );
}
