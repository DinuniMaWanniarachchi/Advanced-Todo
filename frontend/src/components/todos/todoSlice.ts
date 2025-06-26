import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from '@/types'; 

type TodoState = {
  todos: Todo[];
};

const initialState: TodoState = {
  todos: [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.unshift(action.payload); 
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    clearTodos: (state) => {
      state.todos = [];
    }
  },
});

// ✅ Export all actions including clearTodos
export const { setTodos, addTodo, updateTodo, deleteTodo, clearTodos } = todoSlice.actions;
export default todoSlice.reducer;
