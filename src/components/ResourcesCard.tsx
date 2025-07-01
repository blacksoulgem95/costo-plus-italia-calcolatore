
import React from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Resource } from '@/types/calculator';

interface ResourcesCardProps {
  resources: Resource[];
  setResources: (resources: Resource[]) => void;
}

const ResourcesCard: React.FC<ResourcesCardProps> = ({ resources, setResources }) => {
  const addResource = () => {
    const newResource: Resource = {
      id: Date.now().toString(),
      name: '',
      contractType: 'employee',
      billableHours: 1320
    };
    setResources([...resources, newResource]);
  };

  const removeResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const updateResource = (id: string, field: keyof Resource, value: any) => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          2. Risorse e Personale
        </CardTitle>
        <CardDescription className="text-green-100">
          Aggiungi i membri del tuo team
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {resources.map((resource, index) => (
            <div key={resource.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">Risorsa {index + 1}</Badge>
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => removeResource(resource.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome/Ruolo</Label>
                  <Input
                    value={resource.name}
                    onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                    placeholder="es. Sviluppatore Senior"
                  />
                </div>
                <div>
                  <Label>Tipo Contratto</Label>
                  <Select value={resource.contractType} onValueChange={(value) => 
                    updateResource(resource.id, 'contractType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Dipendente</SelectItem>
                      <SelectItem value="cococo">Co.Co.Co.</SelectItem>
                      <SelectItem value="partitaiva">Partita IVA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {resource.contractType !== 'partitaiva' ? (
                  <>
                    <div>
                      <Label>Stipendio Netto Mensile (€)</Label>
                      <Input
                        type="number"
                        value={resource.netSalary || ''}
                        onChange={(e) => updateResource(resource.id, 'netSalary', parseFloat(e.target.value) || undefined)}
                      />
                    </div>
                    <div>
                      <Label>Stipendio Lordo Mensile (€)</Label>
                      <Input
                        type="number"
                        value={resource.grossSalary || ''}
                        onChange={(e) => updateResource(resource.id, 'grossSalary', parseFloat(e.target.value) || undefined)}
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <Label>Compenso Mensile (€)</Label>
                    <Input
                      type="number"
                      value={resource.compensation || ''}
                      onChange={(e) => updateResource(resource.id, 'compensation', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                )}
                
                <div>
                  <Label>Ore Fatturabili Annue</Label>
                  <Input
                    type="number"
                    value={resource.billableHours}
                    onChange={(e) => updateResource(resource.id, 'billableHours', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Ore Stimate su Progetto</Label>
                  <Input
                    type="number"
                    value={resource.projectHours || ''}
                    onChange={(e) => updateResource(resource.id, 'projectHours', parseFloat(e.target.value) || undefined)}
                    placeholder="Ore dedicate al progetto"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button onClick={addResource} className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Aggiungi Risorsa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourcesCard;
