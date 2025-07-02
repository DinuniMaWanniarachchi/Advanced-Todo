import axios from 'axios';
import type { Project } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const BASE_URL = `${API_BASE_URL}/projects`;

// 1. Utility to get token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

// 2. Utility to construct Authorization header
function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 3. API Service methods
export const projectsApiService = {
  async getAll(): Promise<Project[]> {
    const res = await axios.get<Project[]>(BASE_URL, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  async getById(id: number): Promise<Project> {
    const res = await axios.get<Project>(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  async create(project: Partial<Project>): Promise<Project> {
    const res = await axios.post<Project>(BASE_URL, project, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  async update(id: number, project: Partial<Project>): Promise<Project> {
    const res = await axios.put<Project>(`${BASE_URL}/${id}`, project, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
  },
};
