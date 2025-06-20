import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, FolderOpen } from 'lucide-react';
import { projectApi } from '@/lib/api';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project? This will also delete all associated todos.')) {
      setIsDeleting(true);
      try {
        await projectApi.delete(project.id);
        onDelete(project.id);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleOpenProject = () => {
    navigate(`/project/${project.id}/todos`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1" onClick={handleOpenProject}>
            <CardTitle className="text-lg font-semibold hover:text-blue-600 transition-colors">
              {project.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {project.description || 'No description provided'}
            </CardDescription>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(project)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-xs">
            Created {new Date(project.created_at).toLocaleDateString()}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenProject}
            className="text-blue-600 hover:text-blue-800 p-2"
          >
            <FolderOpen className="h-4 w-4 mr-1" />
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}