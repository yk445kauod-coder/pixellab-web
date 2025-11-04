import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Save, Download } from 'lucide-react';
import { getProjects, deleteProject, saveProject, ProjectData } from '@/lib/storage';

interface ProjectManagerProps {
  onLoadProject: (canvasData: any) => void;
  onSaveProject: (canvasData: any) => void;
  currentCanvasData: any;
}

export default function ProjectManager({
  onLoadProject,
  onSaveProject,
  currentCanvasData,
}: ProjectManagerProps) {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [projectName, setProjectName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    setProjects(getProjects());
  };

  const handleSaveProject = () => {
    if (!projectName.trim()) return;

    saveProject(projectName, currentCanvasData);
    setProjectName('');
    loadProjects();
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    loadProjects();
  };

  const handleLoadProject = (project: ProjectData) => {
    onLoadProject(project.canvasData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          المشاريع
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>إدارة المشاريع</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Save new project */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">حفظ مشروع جديد</h3>
            <div className="flex gap-2">
              <Input
                placeholder="اسم المشروع"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="text-sm"
              />
              <Button onClick={handleSaveProject} size="sm">
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* List of projects */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">المشاريع المحفوظة</h3>
            {projects.length === 0 ? (
              <p className="text-sm text-gray-500">لا توجد مشاريع محفوظة</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {projects.map((project) => (
                  <Card key={project.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{project.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(project.timestamp).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleLoadProject(project)}
                          variant="default"
                          size="sm"
                          className="text-xs"
                        >
                          فتح
                        </Button>
                        <Button
                          onClick={() => handleDeleteProject(project.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
