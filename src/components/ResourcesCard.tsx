
import React from 'react';
import { Users, Plus, Trash2, Zap } from 'lucide-react';
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
    <Card className="cyberpunk-card border-primary/30">
      <CardHeader className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-t-lg border-b border-primary/30">
        <CardTitle className="flex items-center gap-3 text-primary neon-text font-mono">
          <div className="cyberpunk-glow rounded p-1">
            <Users className="h-5 w-5" />
          </div>
          <span className="text-lg">[02] HUMAN RESOURCES MATRIX</span>
          <Zap className="h-4 w-4 text-accent cyberpunk-pulse ml-auto" />
        </CardTitle>
        <CardDescription className="text-muted-foreground font-mono">
          <span className="text-primary">&gt;</span> Configurazione team di sviluppo e personale
        </CardDescription>
        <div className="mt-2 text-xs text-muted-foreground font-mono bg-primary/5 p-2 rounded border border-primary/20">
          <span className="text-primary font-semibold">&gt; INFO:</span> Per freelancer (P.IVA) inserire <span className="text-accent">solo tariffa oraria</span> o <span className="text-accent">solo compenso mensile</span>, non entrambi.<br/>
          <span className="text-secondary font-semibold">&gt; NOTA:</span> I freelancer vengono pagati per <span className="text-accent">ore effettive di lavoro</span>, mentre dipendenti/co.co.co per <span className="text-accent">tutta la durata del progetto</span>.
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6 bg-card/50">
        <div className="space-y-6">
          {resources.map((resource, index) => (
            <div key={resource.id} className="p-4 cyberpunk-card border-accent/20 rounded-lg bg-accent/5">
              <div className="flex items-center justify-between mb-4">
                <Badge className="cyberpunk-badge font-mono">
                  RISORSA #{index + 1}
                </Badge>
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => removeResource(resource.id)}
                  className="cyberpunk-input border-destructive/50 text-destructive hover:bg-destructive/10 font-mono"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-mono text-foreground mb-2 block">
                    <span className="text-primary">&gt;</span> Nome/Ruolo
                  </Label>
                  <Input
                    value={resource.name}
                    onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                    placeholder="es. Sviluppatore Senior"
                    className="cyberpunk-input font-mono"
                  />
                </div>
                <div>
                  <Label className="font-mono text-foreground mb-2 block">
                    <span className="text-secondary">&gt;</span> Tipo Contratto
                  </Label>
                  <Select value={resource.contractType} onValueChange={(value) => 
                    updateResource(resource.id, 'contractType', value)}>
                    <SelectTrigger className="cyberpunk-input font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="cyberpunk-card border-primary/50">
                      <SelectItem value="employee" className="font-mono hover:bg-primary/10">Dipendente</SelectItem>
                      <SelectItem value="cococo" className="font-mono hover:bg-primary/10">Co.Co.Co.</SelectItem>
                      <SelectItem value="partitaiva" className="font-mono hover:bg-primary/10">Partita IVA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {resource.contractType !== 'partitaiva' ? (
                  <>
                    <div>
                      <Label className="font-mono text-foreground mb-2 block">
                        <span className="text-accent">&gt;</span> Stipendio Netto Mensile (€)
                      </Label>
                      <Input
                        type="number"
                        value={resource.netSalary || ''}
                        onChange={(e) => updateResource(resource.id, 'netSalary', parseFloat(e.target.value) || undefined)}
                        className="cyberpunk-input font-mono"
                      />
                    </div>
                    <div>
                      <Label className="font-mono text-foreground mb-2 block">
                        <span className="text-secondary">&gt;</span> Stipendio Lordo Mensile (€)
                      </Label>
                      <Input
                        type="number"
                        value={resource.grossSalary || ''}
                        onChange={(e) => updateResource(resource.id, 'grossSalary', parseFloat(e.target.value) || undefined)}
                        className="cyberpunk-input font-mono"
                      />
                    </div>
                    <div>
                      <Label className="font-mono text-foreground mb-2 block">
                        <span className="text-primary">&gt;</span> Aliquota IRPEF (%)  
                      </Label>
                      <Input
                        type="number"
                        value={resource.irpef || '27'}
                        onChange={(e) => updateResource(resource.id, 'irpef', parseFloat(e.target.value) || undefined)}
                        className="cyberpunk-input font-mono"
                      />
                    </div>
                    <div>
                      <Label className="font-mono text-foreground mb-2 block">
                        <span className="text-primary">&gt;</span> Contributi INPS lavoratore (%)  
                      </Label>
                      <Input
                        type="number"
                        value={resource.inps || '9'}
                        onChange={(e) => updateResource(resource.id, 'inps', parseFloat(e.target.value) || undefined)}
                        className="cyberpunk-input font-mono"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label className="font-mono text-foreground mb-2 block">
                        <span className="text-primary">&gt;</span> Tariffa Oraria (€/h)
                      </Label>
                      <Input
                        type="number"
                        value={resource.hourlyRate || ''}
                        onChange={(e) => {
                          // Se si imposta la tariffa oraria, annulliamo il compenso mensile
                          if (parseFloat(e.target.value)) {
                            updateResource(resource.id, 'compensation', undefined);
                          }
                          updateResource(resource.id, 'hourlyRate', parseFloat(e.target.value) || undefined);
                        }}
                        placeholder="Inserisci tariffa oraria"
                        className="cyberpunk-input font-mono"
                      />
                    </div>
                    {!resource.hourlyRate && (
                      <div>
                        <Label className="font-mono text-foreground mb-2 block">
                          <span className="text-secondary">&gt;</span> Compenso Mensile (€)
                        </Label>
                        <Input
                          type="number"
                          value={resource.compensation || ''}
                          onChange={(e) => {
                            // Se si imposta il compenso mensile, annulliamo la tariffa oraria
                            if (parseFloat(e.target.value)) {
                              updateResource(resource.id, 'hourlyRate', undefined);
                            }
                            updateResource(resource.id, 'compensation', parseFloat(e.target.value) || undefined);
                          }}
                          placeholder="Solo se non usi tariffa oraria"
                          className="cyberpunk-input font-mono"
                        />
                      </div>
                    )}
                    <div>
                      <Label className="font-mono text-foreground mb-2 block">
                        <span className="text-accent">&gt;</span> Aliquota IVA (%)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        value={resource.vatRate !== undefined ? resource.vatRate : '22'}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                          updateResource(resource.id, 'vatRate', value);
                        }}
                        className="cyberpunk-input font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Inserire 0 per forfettari o esenti IVA
                      </p>
                    </div>
                  </>
                )}
                
                <div>
                  <Label className="font-mono text-foreground mb-2 block">
                    <span className="text-accent">&gt;</span> Ore Fatturabili Annue
                  </Label>
                  <Input
                    type="number"
                    value={resource.billableHours}
                    onChange={(e) => updateResource(resource.id, 'billableHours', parseFloat(e.target.value) || 0)}
                    className="cyberpunk-input font-mono"
                  />
                </div>
                <div>
                  <Label className="font-mono text-foreground mb-2 block">
                    <span className="text-primary">&gt;</span> Ore Stimate su Progetto
                  </Label>
                  <Input
                    type="number"
                    value={resource.projectHours || ''}
                    onChange={(e) => updateResource(resource.id, 'projectHours', parseFloat(e.target.value) || undefined)}
                    placeholder="Ore dedicate al progetto"
                    className="cyberpunk-input font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button onClick={addResource} className="w-full cyberpunk-button font-mono" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            AGGIUNGI RISORSA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourcesCard;
