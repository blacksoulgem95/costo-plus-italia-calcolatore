
import React from 'react';
import { FileText } from 'lucide-react';
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
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          4. Dati del Progetto
        </CardTitle>
        <CardDescription className="text-orange-100">
          Informazioni specifiche del progetto da stimare
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <Label htmlFor="projectName">Nome Progetto</Label>
          <Input
            value={projectData.name}
            onChange={(e) => setProjectData({...projectData, name: e.target.value})}
            placeholder="es. Sviluppo Piattaforma E-commerce"
          />
        </div>
        <div>
          <Label htmlFor="durationMonths">Durata Progetto (mesi)</Label>
          <Input
            type="number"
            min="0.5"
            step="0.5"
            value={projectData.durationMonths}
            onChange={(e) => setProjectData({...projectData, durationMonths: parseFloat(e.target.value) || 1})}
            placeholder="es. 3"
          />
        </div>
        <div>
          <Label htmlFor="directCosts">Costi Diretti Specifici (€)</Label>
          <Input
            type="number"
            value={projectData.directCosts}
            onChange={(e) => setProjectData({...projectData, directCosts: parseFloat(e.target.value) || 0})}
            placeholder="Licenze, API, hardware dedicato..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDataCard;
