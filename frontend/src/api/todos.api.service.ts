// src/api/todos.api.service.ts
import axios from 'axios';
import type { Todo } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const BASE_URL = `${API_BASE_URL}/todos`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const todosApiService = {
  async getByProject(projectId: number): Promise<Todo[]> {
    const res = await axios.get<Todo[]>(`${BASE_URL}/project/${projectId}`, getAuthHeaders());
    return res.data;
  },

  async getById(id: number): Promise<Todo> {
    const res = await axios.get<Todo>(`${BASE_URL}/${id}`, getAuthHeaders());
    return res.data;
  },

  async create(todo: Partial<Todo>): Promise<Todo> {
    const res = await axios.post<Todo>(BASE_URL, todo, getAuthHeaders());
    return res.data;
  },

  async update(id: number, todo: Partial<Todo>): Promise<Todo> {
    const res = await axios.put<Todo>(`${BASE_URL}/${id}`, todo, getAuthHeaders());
    return res.data;
  },

  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`, getAuthHeaders());
  },
};
