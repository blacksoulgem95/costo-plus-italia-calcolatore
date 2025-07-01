import React from 'react';
import { FileText, Database, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectData, Projects } from '@/types/calculator';

interface ProjectDataCardProps {
  projects: Projects;
  setProjects: (projects: Projects) => void;
}

const ProjectDataCard: React.FC<ProjectDataCardProps> = ({ projects, setProjects }) => {
  const addProject = () => {
    const newProject: ProjectData = {
      id: Date.now().toString(),
      name: '',
      directCosts: 0,
      durationMonths: 1
    };
    setProjects({
      ...projects,
      items: [...projects.items, newProject],
      activeProjectId: newProject.id
    });
  };

  const removeProject = (id: string) => {
    if (projects.items.length <= 1) {
      return; // Impedisce la rimozione dell'ultimo progetto
    }

    const newProjects = projects.items.filter(p => p.id !== id);
    const newActiveId = id === projects.activeProjectId 
      ? newProjects[0].id 
      : projects.activeProjectId;

    setProjects({
      ...projects,
      items: newProjects,
      activeProjectId: newActiveId
    });
  };

  const updateProject = (id: string, field: keyof ProjectData, value: any) => {
    setProjects({
      ...projects,
      items: projects.items.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    });
  };

  const activeProject = projects.items.find(p => p.id === projects.activeProjectId) || projects.items[0];

  return (
    <Card className="cyberpunk-card border-accent/30">
      <CardHeader className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-t-lg border-b border-accent/30">
        <CardTitle className="flex items-center gap-3 text-accent neon-text font-mono">
          <div className="cyberpunk-glow-green rounded p-1">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-lg">[04] PROJECTS DATA MATRIX</span>
          <Database className="h-4 w-4 text-secondary cyberpunk-pulse ml-auto" />
        </CardTitle>
        <CardDescription className="text-muted-foreground font-mono">
          <span className="text-accent">&gt;</span> Parametri specifici dei progetti target
        </CardDescription>

        <div className="mt-2 text-xs text-muted-foreground font-mono bg-primary/5 p-2 rounded border border-primary/20">
          <span className="text-primary font-semibold">&gt; INFO:</span> Aggiungi più progetti per calcolare l'overhead distribuito sui mesi effettivi di lavoro
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6 bg-card/50">
        <Tabs 
          value={projects.activeProjectId} 
          onValueChange={(value) => setProjects({...projects, activeProjectId: value})}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList className="cyberpunk-card bg-card/80 p-1">
              {projects.items.map((project) => (
                <TabsTrigger 
                  key={project.id} 
                  value={project.id}
                  className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent font-mono"
                >
                  {project.name || `Progetto ${project.id.substring(project.id.length - 4)}`}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex gap-2">
              <Button
                onClick={addProject}
                variant="outline"
                size="sm"
                className="cyberpunk-input border-accent/50 text-accent hover:bg-accent/10 font-mono"
              >
                <Plus className="h-4 w-4" />
              </Button>

              {projects.items.length > 1 && (
                <Button
                  onClick={() => removeProject(activeProject.id)}
                  variant="outline"
                  size="sm"
                  className="cyberpunk-input border-destructive/50 text-destructive hover:bg-destructive/10 font-mono"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {projects.items.map((project) => (
            <TabsContent key={project.id} value={project.id} className="mt-0">
              <div className="space-y-6">
                <div>
                  <Label htmlFor={`projectName-${project.id}`} className="font-mono text-foreground mb-2 block">
                    <span className="text-accent">&gt;</span> Identificativo Progetto
                  </Label>
                  <Input
                    id={`projectName-${project.id}`}
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    placeholder="es. Neural Network E-commerce Platform"
                    className="cyberpunk-input font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor={`durationMonths-${project.id}`} className="font-mono text-foreground mb-2 block">
                    <span className="text-primary">&gt;</span> Durata Temporale (mesi)
                  </Label>
                  <Input
                    id={`durationMonths-${project.id}`}
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={project.durationMonths}
                    onChange={(e) => updateProject(project.id, 'durationMonths', parseFloat(e.target.value) || 1)}
                    placeholder="es. 3.5"
                    className="cyberpunk-input font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor={`directCosts-${project.id}`} className="font-mono text-foreground mb-2 block">
                    <span className="text-secondary">&gt;</span> Costi Diretti Specifici (€)
                  </Label>
                  <Input
                    id={`directCosts-${project.id}`}
                    type="number"
                    value={project.directCosts}
                    onChange={(e) => updateProject(project.id, 'directCosts', parseFloat(e.target.value) || 0)}
                    placeholder="Licenze software, API premium, hardware dedicato..."
                    className="cyberpunk-input font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-accent">&gt;</span> Costi diretti specifici per questo progetto
                  </p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectDataCard;
