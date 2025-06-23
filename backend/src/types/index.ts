export interface Project {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  project_id: number;
  priority: 'High' | 'Medium' | 'Low';  // Added priority here
  created_at: Date;
  updated_at: Date;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  project_id: number;
  priority?: 'High' | 'Medium' | 'Low';  // Added priority here (optional for creation)
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'High' | 'Medium' | 'Low';  // Added priority here (optional for update)
}
