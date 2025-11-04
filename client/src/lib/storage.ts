/**
 * Local Storage utilities for saving and loading canvas projects
 */

export interface ProjectData {
  id: string;
  name: string;
  timestamp: number;
  canvasData: any;
}

const STORAGE_KEY = 'pixellab_projects';

/**
 * Save project to local storage
 */
export const saveProject = (name: string, canvasData: any): ProjectData => {
  const project: ProjectData = {
    id: Date.now().toString(),
    name,
    timestamp: Date.now(),
    canvasData,
  };

  const projects = getProjects();
  projects.push(project);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  return project;
};

/**
 * Load project from local storage
 */
export const loadProject = (id: string): ProjectData | null => {
  const projects = getProjects();
  return projects.find((p) => p.id === id) || null;
};

/**
 * Get all projects
 */
export const getProjects = (): ProjectData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
};

/**
 * Delete project
 */
export const deleteProject = (id: string): void => {
  const projects = getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

/**
 * Update project
 */
export const updateProject = (id: string, canvasData: any): void => {
  const projects = getProjects();
  const project = projects.find((p) => p.id === id);
  if (project) {
    project.canvasData = canvasData;
    project.timestamp = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }
};
