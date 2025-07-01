
import React from 'react';
import { FileText, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProjectData } from '@/types/calculator';

interface ProjectDataCardProps {
  projectData: ProjectData;
  setProjectData: (data: ProjectData) => void;
}

const ProjectDataCard: React.FC<ProjectDataCardProps> = ({ projectData, setProjectData }) => {
  return (
    <Card className="cyberpunk-card border-accent/30">
      <CardHeader className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-t-lg border-b border-accent/30">
        <CardTitle className="flex items-center gap-3 text-accent neon-text font-mono">
          <div className="cyberpunk-glow-green rounded p-1">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-lg">[04] PROJECT DATA MATRIX</span>
          <Database className="h-4 w-4 text-secondary cyberpunk-pulse ml-auto" />
        </CardTitle>
        <CardDescription className="text-muted-foreground font-mono">
          <span className="text-accent">&gt;</span> Parametri specifici del progetto target
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6 bg-card/50">
        <div>
          <Label htmlFor="projectName" className="font-mono text-foreground mb-2 block">
            <span className="text-accent">&gt;</span> Identificativo Progetto
          </Label>
          <Input
            value={projectData.name}
            onChange={(e) => setProjectData({...projectData, name: e.target.value})}
            placeholder="es. Neural Network E-commerce Platform"
            className="cyberpunk-input font-mono"
          />
        </div>
        <div>
          <Label htmlFor="durationMonths" className="font-mono text-foreground mb-2 block">
            <span className="text-primary">&gt;</span> Durata Temporale (mesi)
          </Label>
          <Input
            type="number"
            min="0.5"
            step="0.5"
            value={projectData.durationMonths}
            onChange={(e) => setProjectData({...projectData, durationMonths: parseFloat(e.target.value) || 1})}
            placeholder="es. 3.5"
            className="cyberpunk-input font-mono"
          />
        </div>
        <div>
          <Label htmlFor="directCosts" className="font-mono text-foreground mb-2 block">
            <span className="text-secondary">&gt;</span> Costi Diretti Specifici (€)
          </Label>
          <Input
            type="number"
            value={projectData.directCosts}
            onChange={(e) => setProjectData({...projectData, directCosts: parseFloat(e.target.value) || 0})}
            placeholder="Licenze software, API premium, hardware dedicato..."
            className="cyberpunk-input font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-accent">&gt;</span> Influisce solo sui costi dei dipendenti, non sui freelancer o sull'overhead
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDataCard;
