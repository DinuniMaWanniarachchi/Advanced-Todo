import axios from 'axios';
import type {
    Project,
    Todo,
    CreateProjectRequest,
    UpdateProjectRequest,
    CreateTodoRequest,
    UpdateTodoRequest
} from '@/types';

const API_BASE_URL = 'http://localhost:5000/api';

function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Project API calls
export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get('/projects', { headers: getAuthHeaders() });
    return response.data;
  },

  getById: async (id: number): Promise<Project> => {
    const response = await api.get(`/projects/${id}`, { headers: getAuthHeaders() });
    return response.data;
  },

  create: async (project: CreateProjectRequest): Promise<Project> => {
    const response = await api.post('/projects', project, { headers: getAuthHeaders() });
    return response.data;
  },

  update: async (id: number, project: UpdateProjectRequest): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, project, { headers: getAuthHeaders() });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`, { headers: getAuthHeaders() });
  },
};

// Todo API calls
export const todoApi = {
  getByProjectId: async (projectId: number): Promise<Todo[]> => {
    const response = await api.get(`/todos/project/${projectId}`, { headers: getAuthHeaders() });
    return response.data;
  },

  getById: async (id: number): Promise<Todo> => {
    const response = await api.get(`/todos/${id}`, { headers: getAuthHeaders() });
    return response.data;
  },

  create: async (todo: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post('/todos', todo, { headers: getAuthHeaders() });
    return response.data;
  },

  update: async (id: number, todo: UpdateTodoRequest): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, todo, { headers: getAuthHeaders() });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`, { headers: getAuthHeaders() });
  },
};