
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Database } from 'lucide-react';
import { CalculationResults, Resource, ProjectData, CompanyData } from '@/types/calculator';
import { calculateHourlyCost } from '@/utils/calculationUtils';

interface ResultsCardProps {
  results: CalculationResults;
  projectData: ProjectData;
  companyData: CompanyData;
  resources: Resource[];
}

const ResultsCard: React.FC<ResultsCardProps> = ({ results, projectData, companyData, resources }) => {
  // Funzione helper per formattare i valori in Euro
  const formatEuro = (value: number): string => {
    return `€${value.toLocaleString('it-IT', {maximumFractionDigits: 0})}`;
  };

  // Funzione helper per il plurale di 'mese'
  const getMesiLabel = (num: number): string => {
    return num === 1 ? 'mese' : 'mesi';
  };

  return (
    <div className="space-y-6">
      <Card className="cyberpunk-card border-accent/30 sticky top-4">
        <div className="text-xs font-mono p-2 bg-primary/10 border-b border-primary/30 text-muted-foreground">
          <span className="text-primary font-semibold">&gt; INFORMAZIONE:</span> I costi dei freelancer sono fissi per le ore di progetto indicate, mentre i costi di dipendenti e collaboratori sono calcolati per l'intera durata del progetto ({projectData.durationMonths} {projectData.durationMonths === 1 ? 'mese' : 'mesi'}).
        </div>
        <CardHeader className="bg-gradient-to-r from-accent/20 to-secondary/20 rounded-t-lg border-b border-accent/30">
          <CardTitle className="flex items-center gap-3 text-accent neon-text font-mono">
            <div className="cyberpunk-glow-green rounded p-1">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-lg">[05] COST ANALYSIS OUTPUT</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground font-mono">
            <span className="text-accent">&gt;</span> {projectData.name} - {projectData.durationMonths} {getMesiLabel(projectData.durationMonths)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4 bg-card/50">
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-mono">
              <span><span className="text-primary">&gt;</span> Costo Personale ({projectData.durationMonths} {getMesiLabel(projectData.durationMonths)}):</span>
              <span className="font-medium text-accent neon-text">{formatEuro(results.personnelCost)}</span>
            </div>

            <div className="flex justify-between text-sm font-mono">
              <span><span className="text-secondary">&gt;</span> Overhead:</span>
              <span className="font-medium text-accent neon-text">{formatEuro(results.overheadCost)}</span>
            </div>

            <div className="flex justify-between text-sm font-mono">
              <span><span className="text-primary">&gt;</span> Costi Diretti:</span>
              <span className="font-medium text-accent neon-text">{formatEuro(projectData.directCosts)}</span>
            </div>
            
            <Separator className="bg-border" />
            
            <div className="flex justify-between font-medium font-mono">
              <span><span className="text-accent">&gt;</span> Costo Totale Progetto:</span>
              <span className="text-secondary neon-text">{formatEuro(results.totalProjectCost)}</span>
            </div>

            <Separator className="bg-border" />

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-lg font-semibold font-mono">
                <span><span className="text-primary">&gt;</span> Prezzo Base (no IVA):</span>
                <span className="text-primary neon-text">{formatEuro(results.basePrice)}</span>
              </div>

              <div className="flex justify-between text-sm font-mono">
                <span><span className="text-secondary">&gt;</span> IVA ({companyData.vatRate}%):</span>
                <span className="text-accent neon-text">{formatEuro(results.vatAmount)}</span>
              </div>

              <div className="flex justify-between text-xl font-bold cyberpunk-card bg-accent/10 p-3 rounded-lg border-accent/30 font-mono">
                <span><span className="text-accent">&gt;</span> Prezzo Finale:</span>
                <span className="text-accent neon-text glitch-text" data-text={formatEuro(results.finalPrice)}>{formatEuro(results.finalPrice)}</span>
              </div>
            </div>
            
            <Separator className="bg-border" />
            
            <div className="cyberpunk-card bg-secondary/10 p-3 rounded-lg border-secondary/30">
              <div className="flex justify-between text-sm font-medium font-mono">
                <span><span className="text-secondary">&gt;</span> Utile Lordo Stimato:</span>
                <span className="text-secondary neon-text">{formatEuro(results.grossProfit)}</span>
              </div>
              <div className="flex justify-between text-xs font-mono mt-1">
                <span><span className="text-accent">&gt;</span> IRAP ({companyData.irapRate}%):</span>
                <span className="text-accent neon-text">{formatEuro(results.irapAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium font-mono mt-2 pt-2 border-t border-secondary/30">
                <span><span className="text-secondary">&gt;</span> Utile Netto Stimato:</span>
                <span className="text-secondary neon-text">{formatEuro(results.netProfit)}</span>
              </div>
              <div className="flex justify-between text-xs font-mono mt-1">
                <span><span className="text-accent">&gt;</span> Margine sul costo:</span>
                <span className="text-accent neon-text">{companyData.profitMargin}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Resource breakdown */}
      <Card className="cyberpunk-card border-primary/30">
        <CardHeader className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-t-lg border-b border-primary/30">
          <CardTitle className="flex items-center gap-3 text-primary neon-text font-mono">
            <div className="cyberpunk-glow rounded p-1">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-lg">RESOURCE BREAKDOWN</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 bg-card/50">
          <div className="space-y-3">
            {resources.filter(r => (r.projectHours || 0) > 0).map((resource) => {
              const hourlyCost = calculateHourlyCost(resource);
              const resourceCost = hourlyCost * (resource.projectHours || 0);
              
              return (
                <div key={resource.id} className="flex justify-between items-center text-sm p-2 cyberpunk-card bg-accent/5 rounded border-accent/20 font-mono">
                  <div>
                    <div className="font-medium text-foreground">
                      <span className="text-accent">&gt;</span> {resource.name || 'Risorsa'}
                      {resource.contractType === 'partitaiva' && (
                        <Badge className="ml-2 bg-primary/20 text-primary text-xs" variant="outline">
                          Freelancer {resource.vatRate ? `IVA ${resource.vatRate}%` : ''}
                        </Badge>
                      )}
                      {resource.contractType === 'employee' && (
                        <Badge className="ml-2 bg-secondary/20 text-secondary text-xs" variant="outline">
                          Dipendente
                        </Badge>
                      )}
                      {resource.contractType === 'cococo' && (
                        <Badge className="ml-2 bg-accent/20 text-accent text-xs" variant="outline">
                          Co.Co.Co.
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {resource.projectHours}h × {formatEuro(hourlyCost)}/h
                      {resource.contractType !== 'partitaiva' && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (incl. contributi, × {projectData.durationMonths} {projectData.durationMonths === 1 ? 'mese' : 'mesi'})
                        </span>
                      )}
                      {resource.contractType === 'partitaiva' && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (costo fisso, indip. da durata)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="font-medium text-accent neon-text">
                    {formatEuro(resourceCost)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsCard;
