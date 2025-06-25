// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../components/todos/todoSlice'; 
import projectReducer from '../components/projects/projectSlice'; 

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    projects: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
