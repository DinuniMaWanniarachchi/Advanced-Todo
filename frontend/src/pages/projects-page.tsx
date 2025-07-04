import { useState, useEffect } from 'react';
import type { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { ProjectList } from '@/components/projects/project-list';
import { ProjectForm } from '@/components/projects/project-form';
import { projectsApiService } from '@/api/projects.api.service'; // ✅ updated import
import { ThemeToggle } from '@/components/theme-toggle';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [error, setError] = useState('');

  // ✅ Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // ✅ Fetch projects with token
  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await projectsApiService.getAll(); // ✅ this includes auth headers
      setProjects(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err?.response?.data?.error || err.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleFormSuccess = (project: Project) => {
    if (editingProject) {
      setProjects(projects.map((p) => (p.id === project.id ? project : p)));
    } else {
      setProjects([project, ...projects]);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
          <span className="ml-2 text-gray-500 dark:text-gray-400">Loading projects...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Projects</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Organize your todos by creating projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={loadProjects}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''} text-gray-500 dark:text-gray-400`}
            />
            Refresh
          </Button>
          <Button onClick={handleCreateProject} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
          <div className="text-red-800 dark:text-red-300">{error}</div>
          <Button variant="outline" size="sm" onClick={loadProjects} className="mt-2">
            Try Again
          </Button>
        </div>
      )}

      <ProjectList projects={projects} onEdit={handleEditProject} onDelete={handleDeleteProject} />

      <ProjectForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editingProject={editingProject}
      />
    </div>
  );
}
